const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, '../../saisei-sbj.webflow.io');
const destDir = path.join(__dirname, '../src/app');

function extractMainContent(html) {
  let mainContent = '';
  const mainStart = html.indexOf('<main');
  if (mainStart === -1) return '';
  const mainEnd = html.lastIndexOf('</main>');
  if (mainEnd !== -1) {
    mainContent = html.substring(mainStart, mainEnd + 7);
  } else {
    const footerStart = html.indexOf('<footer class="footer">', mainStart);
    if (footerStart !== -1) {
      mainContent = html.substring(mainStart, footerStart);
    } else {
      mainContent = html.substring(mainStart);
    }
  }
  mainContent = mainContent.replace(/<div id="awwwards"[\s\S]*?<\/div>/gi, '');
  mainContent = mainContent.replace(/<div id="awwwards-embed"[\s\S]*?<\/div>/gi, '');
  mainContent = mainContent.replace(/(src|href)="(\.\.\/)*assets\//g, '$1="/assets/');
  mainContent = mainContent.replace(/href="(\.\.\/)*project\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/project/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*post\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/post/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*index\.html(#[^"]*)?"/g, 'href="/"');
  return mainContent.trim();
}

const html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf-8');
const mainContent = extractMainContent(html);
const pageCode = `export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${mainContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}`;
fs.writeFileSync(path.join(destDir, 'page.tsx'), pageCode);
console.log('Regenerated page.tsx using dangerouslySetInnerHTML');
