const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const fileUrl = "file:///" + path.join(root, "index.html").replace(/\\/g, "/");
const qaDir = path.join(root, "qa");
const reportsDir = path.join(root, "reports");

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1200 },
  { name: "tablet-768", width: 768, height: 1100 },
  { name: "mobile-390", width: 390, height: 1000 },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function waitForJson(url, attempts = 50) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
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
        },
      });
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) {
        return;
      }
      const deferred = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        deferred.reject(new Error(message.error.message));
      } else {
        deferred.resolve(message.result);
      }
    });

    ws.addEventListener("error", reject);
  });
}

async function captureViewport(cdp, viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width <= 480,
  });
  await cdp.send("Page.navigate", { url: fileUrl });

  for (let index = 0; index < 50; index += 1) {
    const ready = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true,
    });
    if (ready.result.value === "complete") {
      break;
    }
    await delay(100);
  }

  await delay(300);

  const metrics = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const rect = (selector) => {
        const node = document.querySelector(selector);
        return node ? node.getBoundingClientRect().toJSON() : null;
      };
      const style = (selector, property) => {
        const node = document.querySelector(selector);
        return node ? getComputedStyle(node)[property] : null;
      };
      const navToggle = document.querySelector(".nav-toggle");
      const nav = document.querySelector("#site-nav");
      const dropdownButton = document.querySelector(".nav-menu-button");
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        },
        header: {
          logo: rect(".brand img"),
          navToggle: rect(".nav-toggle"),
          navToggleDisplay: style(".nav-toggle", "display"),
          navAriaExpanded: navToggle ? navToggle.getAttribute("aria-expanded") : null
        },
        hero: {
          h1: rect("#hero-title"),
          media: rect(".hero-media")
        },
        topBar: {
          line: rect(".top-bar-line"),
          icons: rect(".top-icons")
        },
        mobileNav: {
          beforeOpenClass: nav ? nav.className : null,
          dropdownAriaExpanded: dropdownButton ? dropdownButton.getAttribute("aria-expanded") : null
        }
      };
    })()`,
  });

  let mobileNavCheck = null;
  if (viewport.width <= 480) {
    mobileNavCheck = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const toggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector("#site-nav");
        const dropdownButton = document.querySelector(".nav-menu-button");
        if (!toggle || !nav) return { skipped: true };
        toggle.click();
        const afterToggle = {
          navOpen: nav.classList.contains("is-open"),
          ariaExpanded: toggle.getAttribute("aria-expanded")
        };
        if (dropdownButton) dropdownButton.click();
        const afterDropdown = {
          ariaExpanded: dropdownButton ? dropdownButton.getAttribute("aria-expanded") : null,
          groupOpen: dropdownButton ? dropdownButton.closest(".nav-group").classList.contains("is-open") : null
        };
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        return {
          afterToggle,
          afterDropdown,
          afterEscape: {
            navOpen: nav.classList.contains("is-open"),
            ariaExpanded: toggle.getAttribute("aria-expanded")
          }
        };
      })()`,
    });
  }

  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const screenshotPath = path.join(qaDir, `mega-cdp-${viewport.name}.png`);
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));

  return {
    ...viewport,
    screenshot: path.relative(root, screenshotPath).replace(/\\/g, "/"),
    metrics: metrics.result.value,
    mobileNavCheck: mobileNavCheck ? mobileNavCheck.result.value : null,
  };
}

async function main() {
  if (!fs.existsSync(edgePath)) {
    throw new Error(`Microsoft Edge not found at ${edgePath}`);
  }
  fs.mkdirSync(qaDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });

  const port = await findPort();
  const profileDir = path.join(qaDir, `edge-profile-cdp-${port}`);
  const edge = spawn(edgePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ], { stdio: "ignore" });

  try {
    const pages = await waitForJson(`http://127.0.0.1:${port}/json/list`);
    const page = pages.find((item) => item.type === "page");
    if (!page) {
      throw new Error("No Edge page target available");
    }

    const cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    const results = [];
    for (const viewport of viewports) {
      results.push(await captureViewport(cdp, viewport));
    }

    cdp.close();

    const report = {
      generatedAt: new Date().toISOString(),
      fileUrl,
      viewports: results,
    };
    fs.writeFileSync(path.join(reportsDir, "qa-browser-cdp.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify(report, null, 2));
  } finally {
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
