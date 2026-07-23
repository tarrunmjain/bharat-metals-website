const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotsDir = path.join(root, "qa", "screenshots");
const reportsDir = path.join(root, "reports");

function fileUrl(relativePath) {
  return `file:///${path.join(root, relativePath).replace(/\\/g, "/")}`;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function findPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForJson(url, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // Edge may need a moment to expose the DevTools endpoint.
    }
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function connect(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(webSocketDebuggerUrl);
    let nextId = 1;
    const pending = new Map();

    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId;
          nextId += 1;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((sendResolve, sendReject) => {
            pending.set(id, { resolve: sendResolve, reject: sendReject });
          });
        },
        close() {
          ws.close();
        }
      });
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const deferred = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) deferred.reject(new Error(message.error.message));
      else deferred.resolve(message.result);
    });

    ws.addEventListener("error", reject);
  });
}

async function navigate(cdp, url, width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480
  });
  await cdp.send("Page.navigate", { url });

  for (let index = 0; index < 60; index += 1) {
    const ready = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true
    });
    if (ready.result.value === "complete") break;
    await delay(100);
  }
  await delay(350);
}

async function screenshot(cdp, filename) {
  const image = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false
  });
  const target = path.join(screenshotsDir, filename);
  fs.writeFileSync(target, Buffer.from(image.data, "base64"));
  return path.relative(root, target).replace(/\\/g, "/");
}

async function main() {
  if (!fs.existsSync(edgePath)) throw new Error(`Microsoft Edge not found at ${edgePath}`);
  fs.mkdirSync(screenshotsDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });

  const port = await findPort();
  const profileDir = path.join(root, "qa", `edge-profile-ga4-${port}`);
  const edge = spawn(edgePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ], { stdio: "ignore" });

  try {
    const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`);
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("No Edge page target available");

    const cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        window.__ga4QaErrors = [];
        window.addEventListener("error", (event) => {
          window.__ga4QaErrors.push(event.message || "window error");
        });
        window.addEventListener("unhandledrejection", (event) => {
          window.__ga4QaErrors.push(String(event.reason || "unhandled rejection"));
        });
      })();`
    });

    const homepageUrl = fileUrl("index.html");
    await navigate(cdp, homepageUrl, 1440, 1000);
    const functional = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        const labels = [
          "topbar_call",
          "topbar_whatsapp",
          "topbar_email",
          "header_quick_quote",
          "hero_call",
          "hero_whatsapp",
          "hero_email",
          "fast_rfq_mail_requirement",
          "final_quote_call",
          "final_quote_whatsapp",
          "final_quote_email_rfq",
          "footer_google_maps",
          "footer_indiamart"
        ];
        const missingLabels = labels.filter((label) => !document.querySelector('[data-ga-label="' + label + '"]'));
        const originalUrl = window.location.href;
        const originalGtag = window.gtag;
        window.__ga4QaEvents = [];
        window.gtag = function () {
          const args = Array.from(arguments);
          if (args[0] === "event") window.__ga4QaEvents.push(args);
          return originalGtag.apply(this, args);
        };
        const stopNavigation = (event) => {
          if (event.target instanceof Element && event.target.closest("[data-ga-event]")) event.preventDefault();
        };
        document.addEventListener("click", stopNavigation, true);
        labels.forEach((label) => {
          const element = document.querySelector('[data-ga-label="' + label + '"]');
          if (element) element.click();
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
        document.removeEventListener("click", stopNavigation, true);
        window.gtag = originalGtag;
        return {
          gtagFunctionExists: typeof originalGtag === "function",
          missingLabels,
          navigationUnchanged: window.location.href === originalUrl,
          eventCount: window.__ga4QaEvents.length,
          events: window.__ga4QaEvents.map((args) => ({
            eventName: args[1],
            linkLocation: args[2] && args[2].link_location,
            actionLabel: args[2] && args[2].action_label,
            outboundDomain: args[2] && args[2].outbound_domain
          })),
          errors: window.__ga4QaErrors || []
        };
      })()`
    });
    const desktopScreenshot = await screenshot(cdp, "ga4-home-desktop.png");

    await navigate(cdp, homepageUrl, 390, 1000);
    const mobile = await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const toggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector("#site-nav");
        if (toggle) toggle.click();
        return {
          gtagFunctionExists: typeof window.gtag === "function",
          navOpen: nav ? nav.classList.contains("is-open") : false,
          navAriaExpanded: toggle ? toggle.getAttribute("aria-expanded") : null,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          errors: window.__ga4QaErrors || []
        };
      })()`,
      returnByValue: true
    });
    const mobileScreenshot = await screenshot(cdp, "ga4-home-mobile.png");

    await navigate(cdp, fileUrl(path.join("contact-us", "index.html")), 1440, 1000);
    const contact = await cdp.send("Runtime.evaluate", {
      expression: `(() => ({
        gtagFunctionExists: typeof window.gtag === "function",
        trackedElements: document.querySelectorAll("[data-ga-event]").length,
        hasCall: !!document.querySelector('[data-ga-event="click_call"]'),
        hasWhatsApp: !!document.querySelector('[data-ga-event="click_whatsapp"]'),
        hasQuote: !!document.querySelector('[data-ga-event="click_request_quote"]'),
        hasMaps: !!document.querySelector('[data-ga-event="click_google_maps"]'),
        errors: window.__ga4QaErrors || []
      }))()`,
      returnByValue: true
    });
    const contactScreenshot = await screenshot(cdp, "ga4-contact-page.png");
    cdp.close();

    const functionalValue = functional.result.value;
    const mobileValue = mobile.result.value;
    const contactValue = contact.result.value;
    const errors = [];
    if (!functionalValue.gtagFunctionExists) errors.push("window.gtag is not available on the homepage.");
    if (functionalValue.missingLabels.length) errors.push(`Missing tracked labels: ${functionalValue.missingLabels.join(", ")}`);
    if (!functionalValue.navigationUnchanged) errors.push("A test click changed the browser URL.");
    if (functionalValue.eventCount !== 13) errors.push(`Expected 13 test events, received ${functionalValue.eventCount}.`);
    if (functionalValue.errors.length) errors.push(...functionalValue.errors);
    if (!mobileValue.gtagFunctionExists || !mobileValue.navOpen || mobileValue.navAriaExpanded !== "true") {
      errors.push("Mobile GA4 or navigation functional check failed.");
    }
    if (mobileValue.horizontalOverflow || mobileValue.errors.length) errors.push("Mobile viewport has overflow or JavaScript errors.");
    if (!contactValue.gtagFunctionExists || !contactValue.hasCall || !contactValue.hasWhatsApp || !contactValue.hasQuote || !contactValue.hasMaps) {
      errors.push("Contact-page analytics coverage is incomplete.");
    }
    if (contactValue.errors.length) errors.push(...contactValue.errors);

    const report = {
      generatedAt: new Date().toISOString(),
      result: errors.length ? "FAIL" : "PASS",
      homepage: functionalValue,
      mobile: mobileValue,
      contact: contactValue,
      screenshots: [desktopScreenshot, mobileScreenshot, contactScreenshot],
      errors
    };
    fs.writeFileSync(path.join(reportsDir, "google-analytics-browser-qa.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (errors.length) process.exitCode = 1;
  } finally {
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
