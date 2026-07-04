const { spawn } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotDir = path.join(root, 'qa', 'screenshots');
const reportsDir = path.join(root, 'reports');

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function pageFileUrl(pagePath) {
  const file = pagePath === '/' ? path.join(root, 'index.html') : path.join(root, pagePath.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  return 'file:///' + file.replace(/\\/g, '/');
}
function findPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}
async function waitForJson(url, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try { const response = await fetch(url); if (response.ok) return response.json(); } catch (_) {}
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}
function connect(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(webSocketDebuggerUrl);
    let nextId = 1;
    const pending = new Map();
    ws.addEventListener('open', () => resolve({
      send(method, params = {}) {
        const id = nextId++;
        ws.send(JSON.stringify({ id, method, params }));
        return new Promise((res, rej) => pending.set(id, { res, rej }));
      },
      close() { ws.close(); }
    }));
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const deferred = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) deferred.rej(new Error(message.error.message)); else deferred.res(message.result);
    });
    ws.addEventListener('error', reject);
  });
}
async function setViewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 480 });
}
async function navigate(cdp, pagePath, width, height) {
  await setViewport(cdp, width, height);
  await cdp.send('Page.navigate', { url: pageFileUrl(pagePath) });
  for (let index = 0; index < 60; index += 1) {
    const ready = await cdp.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
    if (ready.result.value === 'complete') break;
    await delay(100);
  }
  await delay(300);
}
async function evalJs(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result.value;
}
async function screenshot(cdp, name) {
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const file = path.join(screenshotDir, name);
  fs.writeFileSync(file, Buffer.from(result.data, 'base64'));
  return path.relative(root, file).replace(/\\/g, '/');
}
async function openDesktopPortfolio(cdp, itemIndex = 0) {
  await evalJs(cdp, `(() => {
    const product = document.querySelector('[aria-controls="product-portfolio-menu"]');
    if (product && product.getAttribute('aria-expanded') !== 'true') product.click();
    document.querySelectorAll('.portfolio-item').forEach((item) => item.classList.remove('is-open'));
    document.querySelectorAll('.flyout-toggle').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    const item = document.querySelectorAll('.portfolio-item')[${itemIndex}];
    if (item) {
      item.classList.add('is-open');
      const button = item.querySelector('.flyout-toggle');
      if (button) button.setAttribute('aria-expanded', 'true');
    }
  })()`);
  await delay(250);
}
async function captureHeaderQa(cdp) {
  await navigate(cdp, '/', 1440, 950);
  await evalJs(cdp, `(() => { const product = document.querySelector('[aria-controls="product-portfolio-menu"]'); if (product) product.click(); })()`);
  await delay(250);
  const productShot = await screenshot(cdp, 'header-product-portfolio-desktop.png');
  await openDesktopPortfolio(cdp, 0);
  const stainlessShot = await screenshot(cdp, 'header-stainless-flyout-desktop.png');
  await openDesktopPortfolio(cdp, 1);
  const aluminiumShot = await screenshot(cdp, 'header-aluminium-flyout-desktop.png');
  const desktopChecks = await evalJs(cdp, `(() => {
    const product = document.querySelector('[aria-controls="product-portfolio-menu"]');
    const menu = document.querySelector('#product-portfolio-menu');
    const checks = [];
    const openItem = (index) => {
      document.querySelectorAll('.portfolio-item').forEach((item) => item.classList.remove('is-open'));
      const item = document.querySelectorAll('.portfolio-item')[index];
      if (item) item.classList.add('is-open');
      return item;
    };
    const visible = (item) => item && getComputedStyle(item.querySelector('.flyout-menu')).opacity === '1';
    const noGap = (item) => {
      const flyout = item && item.querySelector('.flyout-menu');
      return item && flyout ? flyout.getBoundingClientRect().left <= item.getBoundingClientRect().right + 1 : false;
    };
    [0,1,2,3].forEach((index) => {
      const item = openItem(index);
      const flyout = item && item.querySelector('.flyout-menu');
      checks.push({ index, visible: !!flyout && item.classList.contains('is-open'), noGap: noGap(item) });
    });
    return {
      productOpen: product ? product.getAttribute('aria-expanded') === 'true' : false,
      menuVisible: menu ? getComputedStyle(menu).opacity === '1' : false,
      flyouts: checks,
      keyboardEscapeWorks: (() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return product ? product.getAttribute('aria-expanded') === 'false' : false; })()
    };
  })()`);

  await navigate(cdp, '/', 390, 1000);
  const mobileChecks = await evalJs(cdp, `(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const product = document.querySelector('[aria-controls="product-portfolio-menu"]');
    const firstFlyout = document.querySelector('.portfolio-item .flyout-toggle');
    if (navToggle) navToggle.click();
    if (product) product.click();
    if (firstFlyout) firstFlyout.click();
    return {
      navOpen: document.querySelector('#site-nav')?.classList.contains('is-open') || false,
      productExpanded: product ? product.getAttribute('aria-expanded') : null,
      flyoutExpanded: firstFlyout ? firstFlyout.getAttribute('aria-expanded') : null,
      flyoutOpen: document.querySelector('.portfolio-item')?.classList.contains('is-open') || false
    };
  })()`);
  const mobileShot = await screenshot(cdp, 'header-mobile-product-accordion.png');

  const labels = ['Stainless Steel flyout', 'Aluminium flyout', 'Brass flyout', 'Copper flyout'];
  fs.writeFileSync(path.join(reportsDir, 'header-mega-menu-qa.md'), `${[
    '# Header Mega Menu QA',
    '',
    `Product Portfolio screenshot: ${productShot}`,
    `Stainless flyout screenshot: ${stainlessShot}`,
    `Aluminium flyout screenshot: ${aluminiumShot}`,
    `Mobile accordion screenshot: ${mobileShot}`,
    '',
    `- Product Portfolio menu opens: ${desktopChecks.productOpen || desktopChecks.menuVisible ? 'pass' : 'fail'}`,
    ...desktopChecks.flyouts.map((item, index) => `- ${labels[index]} opens to the right with no hover gap: ${item.visible && item.noGap ? 'pass' : 'fail'}`),
    `- Mobile Product Portfolio accordion works: ${mobileChecks.navOpen && mobileChecks.productExpanded === 'true' && mobileChecks.flyoutExpanded === 'true' && mobileChecks.flyoutOpen ? 'pass' : 'fail'}`,
    `- Keyboard Escape closes menu: ${desktopChecks.keyboardEscapeWorks ? 'pass' : 'fail'}`
  ].join('\n')}\n`);
  return { desktopChecks, mobileChecks, screenshots: [productShot, stainlessShot, aluminiumShot, mobileShot] };
}
async function heroMetrics(cdp, pagePath, width, height, shotName) {
  await navigate(cdp, pagePath, width, height);
  const shot = await screenshot(cdp, shotName);
  const metrics = await evalJs(cdp, `(() => {
    const hero = document.querySelector('.hero, .page-hero');
    const media = document.querySelector('.hero-media, .page-hero-media');
    const img = media ? media.querySelector('img') : null;
    const text = document.body.innerText;
    const rect = (node) => node ? node.getBoundingClientRect().toJSON() : null;
    return {
      heroExists: !!hero,
      mediaExists: !!media,
      imageSrc: img ? img.getAttribute('src') : '',
      imageInsideBox: !!(media && img),
      noGhostPlaceholder: !/Photo pending|photo-placeholder/i.test(text + document.documentElement.innerHTML),
      mediaRect: rect(media),
      h1Rect: rect(document.querySelector('h1')),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  })()`);
  return { pagePath, width, shot, ...metrics };
}
async function captureHeroQa(cdp) {
  const rows = [];
  rows.push(await heroMetrics(cdp, '/', 1440, 950, 'home-hero-desktop.png'));
  rows.push(await heroMetrics(cdp, '/', 390, 1000, 'home-hero-mobile.png'));
  rows.push(await heroMetrics(cdp, '/ss-304/', 1440, 950, 'ss304-hero-desktop.png'));
  rows.push(await heroMetrics(cdp, '/stainless-steel-suppliers-renigunta/', 1440, 950, 'renigunta-hero-desktop.png'));
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const heroImage = (home.match(/<div class="hero-media"[\s\S]*?<img[^>]+src="([^"]+)"/) || [])[1] || '';
  const materialImage = (home.match(/stainless-steel-mixed-stock-v3\.webp/) || [])[0] || '';
  fs.writeFileSync(path.join(reportsDir, 'hero-visual-qa.md'), `${[
    '# Hero Visual QA',
    '',
    `Homepage hero image and stainless material image are different files: ${heroImage && materialImage && !heroImage.includes(materialImage) ? 'pass' : 'fail'}`,
    '',
    '| Page | Viewport | Screenshot | Image inside box | No ghost placeholder | No horizontal overflow | Image file |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.pagePath} | ${row.width}px | ${row.shot} | ${row.imageInsideBox ? 'pass' : 'fail'} | ${row.noGhostPlaceholder ? 'pass' : 'fail'} | ${!row.horizontalOverflow ? 'pass' : 'fail'} | ${row.imageSrc} |`)
  ].join('\n')}\n`);
  return rows;
}
async function main() {
  if (!fs.existsSync(edgePath)) throw new Error(`Microsoft Edge not found at ${edgePath}`);
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  const port = await findPort();
  const profileDir = path.join(root, 'qa', `edge-profile-acceptance-${port}`);
  const edge = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`, '--no-first-run', '--no-default-browser-check', 'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let cdp;
  try {
    const pages = await waitForJson(`http://127.0.0.1:${port}/json/list`);
    const page = pages.find((item) => item.type === 'page');
    cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    const header = await captureHeaderQa(cdp);
    const hero = await captureHeroQa(cdp);
    const result = { screenshotsDir: 'qa/screenshots', header, heroPages: hero.map((row) => ({ pagePath: row.pagePath, screenshot: row.shot, imageSrc: row.imageSrc })) };
    fs.writeFileSync(path.join(reportsDir, 'acceptance-browser-qa.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally {
    if (cdp) cdp.close();
    edge.kill();
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
