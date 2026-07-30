const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../saisei-sbj.webflow.io');
const destDir = path.join(__dirname, '../src/app');

function extractMainContent(html) {
  let mainContent = '';
  const mainStart = html.indexOf('<main');
  if (mainStart === -1) return ''; // Should not happen, all have <main
  
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
  
  // Fix asset paths if necessary
  mainContent = mainContent.replace(/(src|href)="(\.\.\/)*assets\//g, '$1="/assets/');
  
  // Fix links
  mainContent = mainContent.replace(/href="(\.\.\/)*project\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/project/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*post\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/post/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*index\.html(#[^"]*)?"/g, 'href="/"');

  return mainContent.trim();
}

function migrateRootPages() {
  const files = fs.readdirSync(srcDir);
  const skipFiles = ['index.html', 'project.html']; // project.html is just /project
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    if (file === 'index.html') continue; // homepage is already handled in page.tsx

    const html = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    const mainContent = extractMainContent(html);
    if (!mainContent) {
      console.log('No <main> found in', file);
      continue;
    }
    
    let routeName = file.replace('.html', '');
    // Handle project.html -> project
    let routeDir = path.join(destDir, routeName);
    fs.mkdirSync(routeDir, { recursive: true });
    
    const pageCode = `export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${mainContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}`;
    fs.writeFileSync(path.join(routeDir, 'page.tsx'), pageCode);
    console.log('Migrated root page: ' + file + ' -> /' + routeName);
  }
}

migrateRootPages();
