const { spawn } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotDir = path.join(root, 'qa', 'screenshots');
const reportsDir = path.join(root, 'reports');
const baseUrl = 'https://tarrunmjain.github.io/bharat-metals-website';
const buildMarker = 'ACCEPTANCE-FIX-2026-07-04-HARDPASS';

const targetPages = [
  '/',
  '/stainless-steel/',
  '/products/',
  '/request-quote/',
  '/contact-us/',
  '/ss-304/',
  '/ss-316/',
  '/stainless-steel-pipes/',
  '/stainless-steel-sheets/',
  '/stainless-steel-rods/',
  '/stainless-steel-bars/',
  '/stainless-steel-suppliers-chennai/',
  '/stainless-steel-suppliers-coimbatore/',
  '/stainless-steel-suppliers-hosur/',
  '/stainless-steel-suppliers-renigunta/',
  '/stainless-steel-suppliers-sricity/',
  '/industries/automobile-auto-components/',
  '/industries/food-processing/',
  '/industries/hotel-commercial-kitchen-equipment/'
];

const screenshotPlan = [
  { path: '/', width: 1440, height: 1050, file: 'visual-polish-home-desktop.png' },
  { path: '/', width: 390, height: 1050, file: 'visual-polish-home-mobile.png' },
  { path: '/ss-304/', width: 1440, height: 1050, file: 'visual-polish-ss304-desktop.png' },
  { path: '/stainless-steel-rods/', width: 1440, height: 1050, file: 'visual-polish-rods-desktop.png' },
  { path: '/stainless-steel-suppliers-renigunta/', width: 1440, height: 1050, file: 'visual-polish-renigunta-desktop.png' }
];

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function pageUrl(pagePath) { return baseUrl + pagePath; }
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
      if (message.error) deferred.rej(new Error(message.error.message));
      else deferred.res(message.result);
    });
    ws.addEventListener('error', reject);
  });
}
async function fetchStatus(pagePath) {
  const url = pageUrl(pagePath);
  try {
    const response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'BharatMetalsVisualAudit/1.0' } });
    const html = await response.text();
    return { path: pagePath, url, status: response.status, length: html.length, markerFound: html.includes(buildMarker) };
  } catch (error) {
    return { path: pagePath, url, status: 'ERROR', length: 0, markerFound: false, error: error.message };
  }
}
async function setViewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 480 });
}
async function navigate(cdp, pagePath, width, height) {
  await setViewport(cdp, width, height);
  await cdp.send('Page.navigate', { url: pageUrl(pagePath) });
  for (let index = 0; index < 80; index += 1) {
    const ready = await cdp.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
    if (ready.result.value === 'complete') break;
    await delay(100);
  }
  await delay(600);
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
async function metrics(cdp, pagePath, width) {
  await navigate(cdp, pagePath, width, width <= 480 ? 1050 : 1100);
  return evalJs(cdp, `(() => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom) };
    };
    const visibleText = document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : '';
    const hero = document.querySelector('.hero, .page-hero');
    const heroText = document.querySelector('.hero-content, .page-hero-grid > div:first-child');
    const heroMedia = document.querySelector('.hero-media, .page-hero-media');
    const heroImage = heroMedia ? heroMedia.querySelector('img') : null;
    const popularSections = [...document.querySelectorAll('.popular-searches')].map((section) => ({
      chipCount: section.querySelectorAll('.search-chip').length,
      hasGrid: !!section.querySelector('.search-chip-grid'),
      rect: section.getBoundingClientRect().toJSON()
    }));
    const cardSelectors = ['.industry-card', '.compact-card', '.info-card', '.product-card', '.grade-card', '.link-card'];
    const cards = cardSelectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((node) => ({
      selector,
      tag: node.tagName.toLowerCase(),
      clickable: node.matches('a') || !!node.closest('a') || !!node.querySelector('a'),
      text: node.innerText.trim().slice(0, 80)
    })));
    const footer = document.querySelector('.site-footer');
    const footerSitemapCount = footer ? [...footer.querySelectorAll('a')].filter((a) => a.textContent.trim() === 'Sitemap').length : 0;
    const images = [...document.images].map((img) => img.getAttribute('src')).filter(Boolean);
    const ctas = [...document.querySelectorAll('.button')].map((button) => button.textContent.trim()).filter(Boolean);
    const topIcons = [...document.querySelectorAll('.top-icon')].map((node) => {
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      return { width: Math.round(r.width), height: Math.round(r.height), background: cs.backgroundColor, border: cs.border, borderRadius: cs.borderRadius };
    });
    return {
      path: '${pagePath}',
      viewportWidth: window.innerWidth,
      title: document.title,
      h1: document.querySelector('h1')?.innerText.trim() || '',
      hasHeader: !!document.querySelector('.site-header'),
      topIconCount: topIcons.length,
      topIcons,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      heroExists: !!hero,
      heroRect: rect('.hero, .page-hero'),
      heroTextRect: heroText ? heroText.getBoundingClientRect().toJSON() : null,
      heroMediaRect: heroMedia ? heroMedia.getBoundingClientRect().toJSON() : null,
      heroImageSrc: heroImage ? heroImage.getAttribute('src') : '',
      heroImageObjectFit: heroImage ? getComputedStyle(heroImage).objectFit : '',
      heroHasPlaceholder: /Photo pending|photo-placeholder/i.test(document.documentElement.innerHTML),
      popularSections,
      cardCount: cards.length,
      nonClickableCards: cards.filter((card) => !card.clickable).slice(0, 8),
      ctaCount: ctas.length,
      ctas: ctas.slice(0, 12),
      footerExists: !!footer,
      footerColumns: document.querySelectorAll('.footer-grid > div').length,
      footerSitemapCount,
      imageSources: images,
      genericSignals: ['Buyers can send', 'Open common city pages', 'Bharat Metals helps buyers describe'].filter((phrase) => visibleText.includes(phrase))
    };
  })()`);
}
async function captureMobileMenu(cdp) {
  await navigate(cdp, '/', 390, 1050);
  await evalJs(cdp, `(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const product = document.querySelector('[aria-controls="product-portfolio-menu"]');
    const firstFlyout = document.querySelector('.portfolio-item .flyout-toggle');
    if (navToggle && navToggle.getAttribute('aria-expanded') !== 'true') navToggle.click();
    if (product && product.getAttribute('aria-expanded') !== 'true') product.click();
    if (firstFlyout && firstFlyout.getAttribute('aria-expanded') !== 'true') firstFlyout.click();
    window.scrollTo(0, 0);
  })()`);
  await delay(300);
  const shot = await screenshot(cdp, 'visual-polish-mobile-menu.png');
  const check = await evalJs(cdp, `(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-nav');
    const product = document.querySelector('[aria-controls="product-portfolio-menu"]');
    const firstFlyout = document.querySelector('.portfolio-item .flyout-toggle');
    return {
      navOpen: nav ? nav.classList.contains('is-open') : false,
      navToggleExpanded: navToggle ? navToggle.getAttribute('aria-expanded') : null,
      productExpanded: product ? product.getAttribute('aria-expanded') : null,
      firstFlyoutExpanded: firstFlyout ? firstFlyout.getAttribute('aria-expanded') : null,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  })()`);
  return { screenshot: shot, check };
}
function imageReuse(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row.desktop || !row.desktop.imageSources) continue;
    for (const src of row.desktop.imageSources) {
      if (!map.has(src)) map.set(src, new Set());
      map.get(src).add(row.path);
    }
  }
  return [...map.entries()]
    .map(([src, paths]) => ({ src, count: paths.size, paths: [...paths] }))
    .filter((item) => item.count > 2 && !/logo|brand|icon/i.test(item.src))
    .sort((a, b) => b.count - a.count);
}
function pageResult(row) {
  const issues = [];
  if (row.status.status !== 200) issues.push(`HTTP ${row.status.status}`);
  if (row.status.status === 200 && !row.status.markerFound) issues.push('build marker missing');
  for (const label of ['desktop', 'mobile']) {
    const item = row[label];
    if (!item) continue;
    if (item.horizontalOverflow) issues.push(`${label} horizontal overflow`);
    if (!item.hasHeader) issues.push(`${label} header missing`);
    if (item.topIconCount !== 5) issues.push(`${label} top icon count ${item.topIconCount}`);
    if (!item.heroExists) issues.push(`${label} hero missing`);
    if (item.heroHasPlaceholder) issues.push(`${label} photo placeholder found`);
    if (item.popularSections.some((section) => !section.hasGrid || section.chipCount < 4)) issues.push(`${label} popular chips weak`);
    if (!item.footerExists || item.footerColumns < 4) issues.push(`${label} footer layout weak`);
    if (item.footerSitemapCount !== 1) issues.push(`${label} footer sitemap count ${item.footerSitemapCount}`);
  }
  return issues;
}
function markdownReport(report) {
  const lines = [
    '# Top Money Pages Visual Polish Audit',
    '',
    `Checked: ${report.checkedAt}`,
    `Preview: ${baseUrl}/`,
    `Build marker expected: ${buildMarker}`,
    '',
    '## Screenshots',
    '',
    ...report.screenshots.map((shot) => `- ${shot}`),
    '',
    '## Page Audit Summary',
    '',
    '| Page | HTTP | Desktop | Mobile | Notes |',
    '|---|---:|---|---|---|'
  ];
  for (const row of report.pages) {
    const issues = pageResult(row);
    lines.push(`| ${row.path} | ${row.status.status} | ${row.desktop && !row.desktop.horizontalOverflow ? 'pass' : 'check'} | ${row.mobile && !row.mobile.horizontalOverflow ? 'pass' : 'check'} | ${issues.length ? issues.join('; ') : 'No blocking visual/functional issue found by automated audit'} |`);
  }
  lines.push('', '## Header And Dropdown', '');
  lines.push(`- Mobile menu opens: ${report.mobileMenu.check.navOpen && report.mobileMenu.check.navToggleExpanded === 'true' ? 'pass' : 'fail'}.`);
  lines.push(`- Product accordion opens on mobile: ${report.mobileMenu.check.productExpanded === 'true' && report.mobileMenu.check.firstFlyoutExpanded === 'true' ? 'pass' : 'fail'}.`);
  lines.push(`- Mobile menu horizontal overflow: ${report.mobileMenu.check.horizontalOverflow ? 'found' : 'none found'}.`);
  lines.push('', '## Image Reuse Notes', '');
  if (report.repeatedImages.length) {
    for (const item of report.repeatedImages.slice(0, 10)) {
      lines.push(`- ${item.src}: used on ${item.count} audited pages (${item.paths.slice(0, 6).join(', ')}${item.paths.length > 6 ? ', ...' : ''}).`);
    }
  } else {
    lines.push('- No excessive repeated non-logo image usage detected across the audited pages.');
  }
  lines.push('', '## Human Review Notes', '');
  lines.push('- Screenshots were captured for visual review; small polish fixes should only be applied if the screenshot inspection shows a clear spacing/crop/chip/card issue.');
  lines.push('- Exact requested page `/industries/hotel-commercial-kitchen-equipment/` returned 404. Existing equivalent is `/industries/commercial-kitchen-equipment/`; no alias page was created because this sprint forbids creating more pages.');
  return lines.join('\n') + '\n';
}
async function main() {
  if (!fs.existsSync(edgePath)) throw new Error(`Microsoft Edge not found at ${edgePath}`);
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  const statuses = await Promise.all(targetPages.map(fetchStatus));
  const port = await findPort();
  const profileDir = path.join(root, 'qa', `edge-profile-visual-${port}`);
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

    const screenshotRows = [];
    for (const item of screenshotPlan) {
      await navigate(cdp, item.path, item.width, item.height);
      screenshotRows.push(await screenshot(cdp, item.file));
    }
    const mobileMenu = await captureMobileMenu(cdp);
    screenshotRows.push(mobileMenu.screenshot);

    const rows = [];
    for (const status of statuses) {
      const row = { path: status.path, status };
      if (status.status === 200) {
        row.desktop = await metrics(cdp, status.path, 1440);
        row.mobile = await metrics(cdp, status.path, 390);
      }
      rows.push(row);
    }
    const report = { checkedAt: new Date().toISOString(), baseUrl, buildMarker, screenshots: screenshotRows, mobileMenu, pages: rows };
    report.repeatedImages = imageReuse(rows);
    fs.writeFileSync(path.join(reportsDir, 'top-money-pages-visual-polish-audit.json'), JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(path.join(reportsDir, 'top-money-pages-visual-polish-audit.md'), markdownReport(report));
    console.log(JSON.stringify({ screenshots: screenshotRows, pages: rows.map((row) => ({ path: row.path, status: row.status.status, issues: pageResult(row) })), mobileMenu: mobileMenu.check }, null, 2));
  } finally {
    if (cdp) cdp.close();
    edge.kill();
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
