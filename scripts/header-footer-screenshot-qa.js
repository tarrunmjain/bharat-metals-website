const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotsDir = path.join(root, "qa", "screenshots");
const homeUrl = "file:///" + path.join(root, "index.html").replace(/\\/g, "/");
const sitemapUrl = "file:///" + path.join(root, "site-map", "index.html").replace(/\\/g, "/");

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
        },
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

async function ready(cdp) {
  for (let index = 0; index < 50; index += 1) {
    const result = await cdp.send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (result.result.value === "complete") return;
    await delay(100);
  }
}

async function capture(cdp, job) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: job.width,
    height: job.height,
    deviceScaleFactor: 1,
    mobile: job.width <= 480,
  });
  await cdp.send("Page.navigate", { url: job.url });
  await delay(500);
  await ready(cdp);
  await delay(300);

  if (job.scroll === "footer") {
    await cdp.send("Runtime.evaluate", { expression: `document.querySelector(".site-footer").scrollIntoView({ block: "start" })` });
    await delay(250);
  } else if (job.scroll === "sitemap-list") {
    await cdp.send("Runtime.evaluate", { expression: `document.querySelector(".sitemap-group").scrollIntoView({ block: "start" })` });
    await delay(250);
  }

  let clip;
  if (job.clipSelector) {
    const clipResult = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const node = document.querySelector(${JSON.stringify(job.clipSelector)});
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return {
          x: 0,
          y: Math.max(0, rect.top + window.scrollY - ${(job.clipPad || 0)}),
          width: document.documentElement.clientWidth,
          height: Math.min(${job.clipHeight || job.height}, rect.height + ${(job.clipPad || 0) * 2})
        };
      })()`,
    });
    clip = clipResult.result.value ? { ...clipResult.result.value, scale: 1 } : null;
  }

  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: !!clip,
    ...(clip ? { clip } : {}),
  });
  const out = path.join(screenshotsDir, job.file);
  fs.writeFileSync(out, Buffer.from(screenshot.data, "base64"));
  return path.relative(root, out).replace(/\\/g, "/");
}

async function main() {
  if (!fs.existsSync(edgePath)) throw new Error(`Microsoft Edge not found at ${edgePath}`);
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const port = await findPort();
  const profileDir = path.join(root, "qa", `edge-profile-header-footer-${port}`);
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
    if (!page) throw new Error("No Edge page target available");

    const cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    const jobs = [
      { file: "final-topbar-desktop.png", url: homeUrl, width: 1440, height: 260 },
      { file: "final-topbar-mobile.png", url: homeUrl, width: 390, height: 220 },
      { file: "final-home-footer-desktop.png", url: homeUrl, width: 1440, height: 900, scroll: "footer", clipSelector: ".site-footer", clipHeight: 900 },
      { file: "final-home-footer-mobile.png", url: homeUrl, width: 390, height: 1900, scroll: "footer", clipSelector: ".site-footer", clipHeight: 1900 },
      { file: "final-sitemap-desktop.png", url: sitemapUrl, width: 1440, height: 1100, scroll: "sitemap-list" },
    ];
    const screenshots = [];
    for (const job of jobs) screenshots.push(await capture(cdp, job));
    cdp.close();
    console.log(JSON.stringify({ screenshots }, null, 2));
  } finally {
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
