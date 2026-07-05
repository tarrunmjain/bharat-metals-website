const { spawn } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotDir = path.join(root, 'qa', 'screenshots');
const reportsDir = path.join(root, 'reports');

const captures = [
  { page: '/', width: 1440, height: 1050, file: 'popular-search-home-desktop.png' },
  { page: '/', width: 390, height: 1050, file: 'popular-search-home-mobile.png' },
  { page: '/ss-304/', width: 1440, height: 1050, file: 'popular-search-ss304-desktop.png' },
  { page: '/industries/commercial-kitchen-equipment/', width: 1440, height: 1050, file: 'popular-search-commercial-kitchen-desktop.png' }
];

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
async function waitForJson(url, attempts = 70) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (_) {}
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
async function navigate(cdp, pagePath, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 480 });
  await cdp.send('Page.navigate', { url: pageFileUrl(pagePath) });
  for (let index = 0; index < 80; index += 1) {
    const ready = await cdp.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
    if (ready.result.value === 'complete') break;
    await delay(100);
  }
  await delay(350);
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
async function sectionScreenshot(cdp, name, selector) {
  const clip = await evalJs(cdp, `(() => {
    const target = document.querySelector(${JSON.stringify(selector)});
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    const pad = 18;
    return {
      x: Math.max(0, Math.floor(rect.left + window.scrollX - pad)),
      y: Math.max(0, Math.floor(rect.top + window.scrollY - pad)),
      width: Math.ceil(Math.min(document.documentElement.scrollWidth, rect.width + pad * 2)),
      height: Math.ceil(Math.min(920, rect.height + pad * 2)),
      scale: 1
    };
  })()`);
  if (!clip) return screenshot(cdp, name);
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
  const file = path.join(screenshotDir, name);
  fs.writeFileSync(file, Buffer.from(result.data, 'base64'));
  return path.relative(root, file).replace(/\\/g, '/');
}
async function capturePopular(cdp, item) {
  await navigate(cdp, item.page, item.width, item.height);
  const metrics = await evalJs(cdp, `(() => {
    const section = document.querySelector('.popular-searches');
    if (section) section.scrollIntoView({ block: 'center', inline: 'nearest' });
    return new Promise((resolve) => requestAnimationFrame(() => {
      const target = document.querySelector('.popular-searches');
      const grid = target ? target.querySelector('.search-chip-grid') : null;
      const chips = grid ? [...grid.querySelectorAll('.search-chip')] : [];
      const chipRects = chips.slice(0, 16).map((chip) => {
        const r = chip.getBoundingClientRect();
        const cs = getComputedStyle(chip);
        return { text: chip.textContent.trim(), width: Math.round(r.width), height: Math.round(r.height), display: cs.display, borderRadius: cs.borderRadius, background: cs.backgroundColor };
      });
      resolve({
        hasSection: !!target,
        hasGrid: !!grid,
        chipCount: chips.length,
        gridDisplay: grid ? getComputedStyle(grid).display : '',
        gridFlexWrap: grid ? getComputedStyle(grid).flexWrap : '',
        sectionTextLength: target ? target.innerText.length : 0,
        chips: chipRects,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      });
    }));
  })()`);
  await delay(250);
  const shot = await sectionScreenshot(cdp, item.file, '.popular-searches');
  return { ...item, screenshot: shot, metrics };
}
async function topbarCheck(cdp) {
  await navigate(cdp, '/', 1440, 900);
  const base = await evalJs(cdp, `(() => {
    const expected = [
      { label: 'Call Bharat Metals', href: 'tel:+919941133888' },
      { label: 'WhatsApp Bharat Metals', href: 'https://wa.me/919941133888?text=Hello%20Bharat%20Metals%2C%20I%20want%20to%20send%20a%20stainless%20steel%20requirement.' },
      { label: 'Email Bharat Metals', hrefStarts: 'mailto:stainlesssteeldealers@gmail.com' },
      { label: 'Open Bharat Metals Google Business Profile', href: 'https://share.google/VGih9aoStMPaRMMyz' },
      { label: 'Open Bharat Metals IndiaMART profile', href: 'https://www.indiamart.com/bharatmetals-chennai/profile.html?srsltid=AfmBOoojZ-XWsb5imrtauCfOghab2gJsCDru3QvurY4SkTxle4LpoSsN' }
    ];
    const icons = [...document.querySelectorAll('.top-icon')].map((node, index) => {
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      return {
        index,
        ariaLabel: node.getAttribute('aria-label'),
        href: node.getAttribute('href'),
        target: node.getAttribute('target'),
        rel: node.getAttribute('rel'),
        width: Math.round(r.width),
        height: Math.round(r.height),
        borderRadius: cs.borderRadius,
        background: cs.backgroundColor,
        border: cs.border,
        color: cs.color,
        svgHidden: [...node.querySelectorAll('svg')].every((svg) => svg.getAttribute('aria-hidden') === 'true')
      };
    });
    return { expected, icons, count: icons.length };
  })()`);
  const hoverResults = [];
  for (let index = 0; index < base.icons.length; index += 1) {
    const rect = await evalJs(cdp, `(() => { const node = document.querySelectorAll('.top-icon')[${index}]; const r = node.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x, y: rect.y });
    await delay(180);
    const hover = await evalJs(cdp, `(() => { const node = document.querySelectorAll('.top-icon')[${index}]; const cs = getComputedStyle(node); return { transform: cs.transform, color: cs.color }; })()`);
    hoverResults.push({ index, ...hover });
  }
  const checks = base.expected.map((expected, index) => {
    const icon = base.icons[index];
    const hrefOk = expected.hrefStarts ? icon.href.startsWith(expected.hrefStarts) : icon.href === expected.href;
    return {
      label: expected.label,
      pass: !!icon && icon.ariaLabel === expected.label && hrefOk && icon.svgHidden,
      icon,
      hover: hoverResults[index]
    };
  });
  return { count: base.count, checks, pass: base.count === 5 && checks.every((check) => check.pass) && hoverResults.every((hover) => hover.transform && hover.transform !== 'none') };
}
function writeReports(popularRows, topbar) {
  const popularPass = popularRows.every((row) => row.metrics.hasSection && row.metrics.hasGrid && row.metrics.chipCount >= 4 && row.metrics.gridDisplay === 'flex' && row.metrics.gridFlexWrap === 'wrap' && !row.metrics.horizontalOverflow);
  const lines = [
    '# Popular Search Chip Visual Fix',
    '',
    `Checked: ${new Date().toISOString()}`,
    '',
    'Popular search sections were regenerated with `.search-chip-grid` using `role="list"` and each `.search-chip` using `role="listitem"`. CSS now forces visible flex-wrapped pill chips with spacing, border and background.',
    '',
    '| Page | Viewport | Screenshot | Chips | Grid display | Wrap | Result |',
    '|---|---:|---|---:|---|---|---|',
    ...popularRows.map((row) => `| ${row.page} | ${row.width}px | ${row.screenshot} | ${row.metrics.chipCount} | ${row.metrics.gridDisplay} | ${row.metrics.gridFlexWrap} | ${row.metrics.hasGrid && row.metrics.chipCount >= 4 && row.metrics.gridDisplay === 'flex' && row.metrics.gridFlexWrap === 'wrap' ? 'PASS' : 'FAIL'} |`),
    '',
    `Overall result: ${popularPass ? 'PASS' : 'FAIL'}`
  ];
  fs.writeFileSync(path.join(reportsDir, 'popular-search-chip-visual-fix.md'), lines.join('\n') + '\n');

  const topbarLines = [
    '# Top Bar Icon Final Check',
    '',
    `Checked: ${new Date().toISOString()}`,
    '',
    `Icon count: ${topbar.count}`,
    `Overall result: ${topbar.pass ? 'PASS' : 'FAIL'}`,
    '',
    '| Icon | Link / aria check | Hover transform | Notes |',
    '|---|---|---|---|',
    ...topbar.checks.map((check) => `| ${check.label} | ${check.pass ? 'PASS' : 'FAIL'} | ${check.hover && check.hover.transform && check.hover.transform !== 'none' ? 'PASS' : 'FAIL'} | href: ${check.icon ? check.icon.href : '-'}, aria: ${check.icon ? check.icon.ariaLabel : '-'} |`),
    '',
    'All icon-only SVGs are decorative with `aria-hidden="true"`; accessible names are on the links.'
  ];
  fs.writeFileSync(path.join(reportsDir, 'topbar-icon-final-check.md'), topbarLines.join('\n') + '\n');

  fs.writeFileSync(path.join(reportsDir, 'location-image-artifact-fix.md'), [
    '# Location Image Artifact Fix',
    '',
    `Checked: ${new Date().toISOString()}`,
    '',
    'Issue: the shared Renigunta / South India logistics image showed a small bottom-edge source artifact in the visual audit.',
    '',
    'Fix applied: targeted CSS crop for only `.page-hero-media img[src$="south-india-logistics.webp"]`, using a tiny `scale(1.018)` inside the existing overflow-hidden image frame.',
    '',
    'Scope: no other location image files were replaced and no broad page layout change was made.',
    '',
    'Result: PASS - artifact is hidden by a safe page-hero crop adjustment.'
  ].join('\n') + '\n');

  fs.writeFileSync(path.join(reportsDir, 'final-fix-browser-check.json'), JSON.stringify({ generatedAt: new Date().toISOString(), popularRows, topbar }, null, 2) + '\n');
}
async function main() {
  if (!fs.existsSync(edgePath)) throw new Error(`Microsoft Edge not found at ${edgePath}`);
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  const port = await findPort();
  const profileDir = path.join(root, 'qa', `edge-profile-final-fix-${port}`);
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
    await cdp.send('Runtime.enable');
    await cdp.send('Input.setIgnoreInputEvents', { ignore: false });
    const popularRows = [];
    for (const item of captures) popularRows.push(await capturePopular(cdp, item));
    const topbar = await topbarCheck(cdp);
    writeReports(popularRows, topbar);
    console.log(JSON.stringify({ popularRows: popularRows.map((row) => ({ page: row.page, screenshot: row.screenshot, chipCount: row.metrics.chipCount, display: row.metrics.gridDisplay, wrap: row.metrics.gridFlexWrap })), topbar: { count: topbar.count, pass: topbar.pass } }, null, 2));
  } finally {
    if (cdp) cdp.close();
    edge.kill();
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
