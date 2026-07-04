const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const reportsDir = path.join(root, 'reports');
const skip = new Set(['.git', 'assets', 'qa', 'reports', 'src', 'scripts', 'node_modules']);
const bannedPhrases = [
  'Open SS',
  'Open grade pages',
  'Open SS 304 grade-city pages where generated',
  'Direct city-product pages where generated',
  'otherwise location pages',
  'supply notes for buyers specifying',
  'Common buyer groups for',
  'Short answers for procurement teams',
  'Related city pages for buyers comparing dispatch options',
  'Use nearby location pages when a buyer is comparing product availability',
  'Products include',
  'Common products:',
  'These searches reflect how buyers usually describe',
  'Practical answers for buyers checking this specific requirement',
  'where generated'
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skip.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function pageFile(pagePath) {
  if (pagePath === '/') return path.join(root, 'index.html');
  return path.join(root, pagePath.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function readPage(pagePath) {
  return fs.readFileSync(pageFile(pagePath), 'utf8');
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function countPhrase(html, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (html.match(new RegExp(escaped, 'g')) || []).length;
}

function sectionByHeading(html, heading) {
  const re = new RegExp(`<section\\b[\\s\\S]*?<h[23][^>]*>${heading}[\\s\\S]*?<\\/section>`, 'i');
  return (html.match(re) || [''])[0];
}

function duplicateLinks(section) {
  const links = [...section.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => `${m[1]}|${strip(m[2]).toLowerCase()}`);
  const counts = new Map();
  links.forEach((key) => counts.set(key, (counts.get(key) || 0) + 1));
  return [...counts.entries()].filter(([, count]) => count > 1).map(([key, count]) => `${key} x${count}`);
}

function popularSearchAudit(files) {
  const rows = [];
  const failures = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const sections = [...html.matchAll(/<section\b[^>]*class="[^"]*popular-searches[^"]*"[\s\S]*?<\/section>/gi)].map((m) => m[0]);
    sections.forEach((section, index) => {
      const chipCount = (section.match(/class="[^"]*search-chip[^"]*"/g) || []).length;
      const bareSpan = /<div class="search-chip-grid"[^>]*>\s*<span(?! class="search-chip")/i.test(section);
      const longTextRun = strip(section).length > 500 && chipCount === 0;
      const ok = chipCount >= 4 && !bareSpan && !longTextRun;
      const row = { page: rel(file), section: index + 1, chipCount, bareSpan, longTextRun, ok };
      rows.push(row);
      if (!ok) failures.push(row);
    });
  }
  const lines = [
    '# Popular Search Chip Audit',
    '',
    `Pages with popular-search sections: ${new Set(rows.map((row) => row.page)).size}`,
    `Popular-search sections checked: ${rows.length}`,
    `Failures: ${failures.length}`,
    '',
    '| Page | Section | .search-chip count | Bare span run | Long plain run | Status |',
    '| --- | ---: | ---: | --- | --- | --- |',
    ...rows.map((row) => `| ${row.page} | ${row.section} | ${row.chipCount} | ${row.bareSpan ? 'yes' : 'no'} | ${row.longTextRun ? 'yes' : 'no'} | ${row.ok ? 'pass' : 'fail'} |`)
  ];
  fs.writeFileSync(path.join(reportsDir, 'popular-search-chip-audit.md'), `${lines.join('\n')}\n`);
  return failures.map((row) => `${row.page}: popular searches section ${row.section} has ${row.chipCount} chips`);
}

function genericPhraseReport(files) {
  const beforePath = path.join(reportsDir, 'generic-template-phrase-before.json');
  const before = fs.existsSync(beforePath) ? JSON.parse(fs.readFileSync(beforePath, 'utf8')).counts : {};
  const after = Object.fromEntries(bannedPhrases.map((phrase) => [phrase, 0]));
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    bannedPhrases.forEach((phrase) => { after[phrase] += countPhrase(html, phrase); });
  }
  const fixedFile = 'scripts/build-pages.js, src/data/site-data.js, index.html generator output';
  const lines = [
    '# Generic Template Phrase Removal',
    '',
    '| Phrase | Count before | Count after | Template/data file fixed | Status |',
    '| --- | ---: | ---: | --- | --- |',
    ...bannedPhrases.map((phrase) => `| ${phrase} | ${before[phrase] ?? 'n/a'} | ${after[phrase]} | ${fixedFile} | ${after[phrase] === 0 ? 'pass' : 'fail'} |`)
  ];
  fs.writeFileSync(path.join(reportsDir, 'generic-template-phrase-removal.md'), `${lines.join('\n')}\n`);
  return Object.entries(after).filter(([, count]) => count > 0).map(([phrase, count]) => `${phrase}: ${count}`);
}

function finishMatrixAudit() {
  const checks = [
    { page: '/stainless-steel-rods/', forbidden: ['2B Finish', 'No. 1 Finish', 'No. 8 Finish', 'Satin Finish', 'PVC Coated Sheets'], required: ['Bright / BA Finish where applicable', 'Polished Finish', 'Ground / peeled / machined finish if applicable'] },
    { page: '/stainless-steel-bars/', forbidden: ['2B Finish', 'No. 1 Finish', 'No. 8 Finish', 'Satin Finish', 'PVC Coated Sheets'], required: ['Bright / BA Finish where applicable', 'Polished Finish', 'Round / square / hex bar options'] },
    { page: '/stainless-steel-sheets/', forbidden: [], required: ['2B Finish', 'No. 1 Finish', 'BA Finish', 'Mirror Finish', 'No. 8 Finish', 'Matt Finish', 'Hairline Finish', 'Brush Finish', 'Satin Finish', 'PVC Coated Sheets'] },
    { page: '/stainless-steel-pipes/', forbidden: ['PVC Coated Sheets'], required: ['Mill Finish', 'Polished Finish', 'Matt Finish', 'Mirror Polished / Decorative where applicable', 'Welded / Seamless enquiry preference'] },
    { page: '/stainless-steel-tubes/', forbidden: ['PVC Coated Sheets'], required: ['Mill Finish', 'Polished Finish', 'Round / Square / Rectangular options'] },
    { page: '/stainless-steel-fasteners/', forbidden: ['2B Finish', 'PVC Coated Sheets'], required: ['Bright Finish', 'Passivated Finish where applicable', 'Thread/specification details'] },
    { page: '/stainless-steel-wire-mesh/', forbidden: ['PVC Coated Sheets'], required: ['Woven / welded mesh style', 'Aperture / wire diameter details'] },
    { page: '/stainless-steel-perforated-sheets/', forbidden: [], required: ['2B Finish', 'No. 1 Finish', 'Hole pattern / pitch / thickness', 'PVC coating where applicable'] }
  ];
  const rows = checks.map((check) => {
    const text = strip(readPage(check.page));
    const forbiddenFound = check.forbidden.filter((term) => text.includes(term));
    const missing = check.required.filter((term) => !text.includes(term));
    return { ...check, forbiddenFound, missing, ok: !forbiddenFound.length && !missing.length };
  });
  fs.writeFileSync(path.join(reportsDir, 'finish-matrix-audit.md'), `${[
    '# Finish Matrix Audit',
    '',
    '| Page | Required terms missing | Forbidden terms found | Status |',
    '| --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.page} | ${row.missing.join('; ') || 'none'} | ${row.forbiddenFound.join('; ') || 'none'} | ${row.ok ? 'pass' : 'fail'} |`)
  ].join('\n')}\n`);
  return rows.filter((row) => !row.ok).map((row) => `${row.page}: finish matrix failed`);
}

function cardClickabilityAudit(files) {
  const rows = [];
  const failures = [];
  const samples = ['/', '/stainless-steel-rods/', '/ss-304/', '/stainless-steel-suppliers-renigunta/', '/industries/automobile-auto-components/'];
  for (const page of samples) {
    const html = readPage(page);
    const titleOnly = (html.match(/<h3>\s*<a\b/gi) || []).length;
    const nestedAnchors = (html.match(/<a\b(?:(?!<\/a>).)*<a\b/gis) || []).length;
    const nonAnchorPageCards = (html.match(/<(?!a\b)[a-z0-9]+\b[^>]*class="[^"]*(?:^|\s)page-card(?:\s|")/gi) || []).length;
    const fullCardAnchors = (html.match(/<a\b[^>]*class="[^"]*(?:page-card|material-card|form-card|industry-card)[^"]*"/gi) || []).length;
    const chipAnchors = (html.match(/<a\b[^>]*href="[^"]+"[^>]*>/gi) || []).filter((anchor) => /link-chip-grid|chip-grid/.test(html.slice(Math.max(0, html.indexOf(anchor) - 120), html.indexOf(anchor)))).length;
    const ok = titleOnly === 0 && nestedAnchors === 0 && nonAnchorPageCards === 0 && (fullCardAnchors > 0 || chipAnchors > 0);
    const row = { page, titleOnly, nestedAnchors, nonAnchorPageCards, fullCardAnchors, chipAnchors, ok };
    rows.push(row);
    if (!ok) failures.push(row);
  }
  fs.writeFileSync(path.join(reportsDir, 'card-clickability-qa.md'), `${[
    '# Card Clickability QA',
    '',
    '| Page | Full-card anchors | Chip anchors | Title-only links | Nested anchors | Non-anchor page cards | Status |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- |',
    ...rows.map((row) => `| ${row.page} | ${row.fullCardAnchors} | ${row.chipAnchors} | ${row.titleOnly} | ${row.nestedAnchors} | ${row.nonAnchorPageCards} | ${row.ok ? 'pass' : 'fail'} |`),
    '',
    `Sitewide title-only card links: ${files.reduce((sum, file) => sum + ((fs.readFileSync(file, 'utf8').match(/<h3>\s*<a\b/gi) || []).length), 0)}`,
    `Sitewide invalid nested-card anchors: ${files.reduce((sum, file) => sum + ((fs.readFileSync(file, 'utf8').match(/<a\b(?:(?!<\/a>).)*<a\b/gis) || []).length), 0)}`
  ].join('\n')}\n`);
  return failures.map((row) => `${row.page}: card clickability failed`);
}

function samplePassReport() {
  const checks = [
    { page: '/ss-304/', required: ['SS 304 is one of the most commonly requested stainless steel grades', 'Pipe enquiries usually mention welded or seamless preference', 'SS 304 enquiries are commonly reviewed for Chennai', 'class="search-chip"'], forbidden: ['Open SS 304', 'where generated'] },
    { page: '/stainless-steel-rods/', required: ['Rods by Grade', 'SS 304 Rods', 'class="page-card anchor-card compact-card"', 'class="search-chip"'], forbidden: ['2B Finish', 'PVC Coated Sheets', 'supply notes for buyers specifying'] },
    { page: '/stainless-steel-bars/', required: ['Bars by Grade', 'SS 304 Bars', 'class="page-card anchor-card compact-card"', 'class="search-chip"'], forbidden: ['2B Finish', 'PVC Coated Sheets', 'supply notes for buyers specifying'] },
    { page: '/stainless-steel-suppliers-renigunta/', required: ['Renigunta is closely connected to Tirupati, Sricity, Tada', 'pharma and industrial users', 'seamless pipe enquiries', 'Nearby buyers often compare Renigunta', 'class="search-chip"'], forbidden: ['Use nearby location pages when a buyer is comparing', 'These phrases reflect', 'where generated'] },
    { page: '/industries/automobile-auto-components/', required: ['Chennai', 'Ambattur', 'Sriperumbudur', 'Oragadam', 'Irungattukottai', 'Hosur', 'rods', 'bars', 'sheets', 'plates', 'fasteners', 'fixtures', 'auto-component suppliers', 'class="search-chip"'], forbidden: ['where generated'] },
    { page: '/', required: ['popular-searches', 'class="search-chip"', 'Typical enquiries:', 'portfolio-menu'], forbidden: ['Common products:', 'Photo pending'] }
  ];
  const rows = checks.map((check) => {
    const html = readPage(check.page);
    const lower = html.toLowerCase();
    const missing = check.required.filter((term) => !lower.includes(term.toLowerCase()));
    const foundForbidden = check.forbidden.filter((term) => lower.includes(term.toLowerCase()));
    return { ...check, missing, foundForbidden, ok: !missing.length && !foundForbidden.length };
  });
  fs.writeFileSync(path.join(reportsDir, 'sample-page-pass-fail.md'), `${[
    '# Sample Page Pass/Fail',
    '',
    '| Page | Status | Missing required terms | Forbidden terms found |',
    '| --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.page} | ${row.ok ? 'pass' : 'fail'} | ${row.missing.join('; ') || 'none'} | ${row.foundForbidden.join('; ') || 'none'} |`)
  ].join('\n')}\n`);
  return rows.filter((row) => !row.ok).map((row) => `${row.page}: sample check failed`);
}

function duplicateRelatedLinkAudit(files) {
  const rows = [];
  const failures = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const sections = [...html.matchAll(/<section\b[\s\S]*?(?:Related products|Related product forms)[\s\S]*?<\/section>/gi)].map((m) => m[0]);
    sections.forEach((section, index) => {
      const duplicates = duplicateLinks(section);
      const row = { page: rel(file), section: index + 1, duplicates };
      rows.push(row);
      if (duplicates.length) failures.push(row);
    });
  }
  fs.writeFileSync(path.join(reportsDir, 'duplicate-related-link-audit.md'), `${[
    '# Duplicate Related Link Audit',
    '',
    `Sections checked: ${rows.length}`,
    `Failures: ${failures.length}`,
    '',
    '| Page | Section | Duplicate links | Status |',
    '| --- | ---: | --- | --- |',
    ...rows.map((row) => `| ${row.page} | ${row.section} | ${row.duplicates.join('; ') || 'none'} | ${row.duplicates.length ? 'fail' : 'pass'} |`)
  ].join('\n')}\n`);
  return failures.map((row) => `${row.page}: duplicate related links ${row.duplicates.join('; ')}`);
}

function finalAcceptanceChecks(files) {
  const errors = [];
  const allHtml = files.map((file) => `${rel(file)}\n${fs.readFileSync(file, 'utf8')}`).join('\n');
  if (readPage('/ss-304/').includes('Open SS 304')) errors.push('/ss-304/ contains Open SS 304');
  if (allHtml.includes('where generated')) errors.push('Some page contains where generated');
  if (allHtml.includes('supply notes for buyers specifying')) errors.push('Some page contains supply notes phrase');
  if (allHtml.includes('Direct city-product pages')) errors.push('Some page contains Direct city-product pages');
  ['2B Finish', 'PVC Coated Sheets'].forEach((term) => {
    if (readPage('/stainless-steel-rods/').includes(term)) errors.push(`/stainless-steel-rods/ contains ${term}`);
    if (readPage('/stainless-steel-bars/').includes(term)) errors.push(`/stainless-steel-bars/ contains ${term}`);
  });
  const reniguntaRelated = sectionByHeading(readPage('/stainless-steel-suppliers-renigunta/'), 'Popular stainless steel products for Renigunta');
  const pipeLinks = (reniguntaRelated.match(/href="\.\.\/stainless-steel-pipes\/"/g) || []).length;
  if (pipeLinks > 1) errors.push('/stainless-steel-suppliers-renigunta/ has duplicate Pipes links in related products');
  const homepageSearch = sectionByHeading(readPage('/'), 'Popular stainless steel enquiries we handle');
  if ((homepageSearch.match(/class="[^"]*search-chip[^"]*"/g) || []).length < 4) errors.push('Homepage popular searches are not chip elements');
  const footer = (readPage('/').match(/<footer[\s\S]*?<\/footer>/i) || [''])[0];
  const sitemapLinks = (footer.match(/href="site-map\/"/g) || []).length;
  if (sitemapLinks > 1) errors.push('Footer has duplicate Sitemap links');
  if (fs.existsSync(path.join(root, 'CNAME'))) errors.push('CNAME exists');
  if (!fs.existsSync(path.join(root, '.nojekyll'))) errors.push('.nojekyll missing');
  return errors;
}

function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const files = walk(root);
  const errors = [];
  errors.push(...popularSearchAudit(files));
  errors.push(...genericPhraseReport(files));
  errors.push(...finishMatrixAudit());
  errors.push(...cardClickabilityAudit(files));
  errors.push(...duplicateRelatedLinkAudit(files));
  errors.push(...samplePassReport());
  errors.push(...finalAcceptanceChecks(files));
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const summary = {
    htmlFiles: files.length,
    sitemapUrls: (sitemap.match(/<loc>/g) || []).length,
    siteMapPageExists: fs.existsSync(pageFile('/site-map/')),
    noJekyllPresent: fs.existsSync(path.join(root, '.nojekyll')),
    cnameAbsent: !fs.existsSync(path.join(root, 'CNAME')),
    errors
  };
  fs.writeFileSync(path.join(reportsDir, 'acceptance-qa-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  if (errors.length) process.exit(1);
}

main();
