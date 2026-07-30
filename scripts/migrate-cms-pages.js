const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../saisei-sbj.webflow.io');
const destDir = path.join(__dirname, '../src/app');

function extractMainContent(html, subDir) {
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
  
  // Fix asset paths securely anywhere they occur (src, href, srcset)
  mainContent = mainContent.replace(/\.\.\/assets\//g, '/assets/');
  mainContent = mainContent.replace(/(["',\s])assets\//g, '$1/assets/');
  
  // Fix links
  // If we are in 'project' or 'post' and we see a relative link to another project/post (e.g. "yama-house.html"),
  // it should point to `/${subDir}/yama-house`.
  mainContent = mainContent.replace(/href="(\.\.\/)*project\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/project/$2$3"');
  mainContent = mainContent.replace(/href="(\.\.\/)*post\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/post/$2$3"');
  
  // Fix relative sibling links (e.g. from /project/a to /project/b)
  const regexSibling = new RegExp(`href="([a-zA-Z0-9-]+)\\.html(#\\S*)?"`, 'g');
  mainContent = mainContent.replace(regexSibling, `href="/${subDir}/$1$2"`);

  // Fix root links (e.g. ../about-us.html)
  mainContent = mainContent.replace(/href="\.\.\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$1$2"');
  
  // Fix index.html
  mainContent = mainContent.replace(/href="(\.\.\/)*index\.html(#[^"]*)?"/g, 'href="/"');
  // Fix any leftover absolute-like references
  mainContent = mainContent.replace(/href="([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$1$2"');

  return mainContent.trim();
}

function migrateCmsPages() {
  const folders = ['project', 'post'];
  for (const folder of folders) {
    const folderPath = path.join(srcDir, folder);
    if (!fs.existsSync(folderPath)) continue;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (!file.endsWith('.html')) continue;

      const html = fs.readFileSync(path.join(folderPath, file), 'utf-8');
      const mainContent = extractMainContent(html, folder);
      
      if (!mainContent) {
        console.log('No <main> found in', folder, file);
        continue;
      }

      const routeName = file.replace('.html', '');
      const routeDir = path.join(destDir, folder, routeName);
      fs.mkdirSync(routeDir, { recursive: true });

      const pageCode = `export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${mainContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}`;
      fs.writeFileSync(path.join(routeDir, 'page.tsx'), pageCode);
      console.log(`Migrated CMS page: ${folder}/${file} -> /${folder}/${routeName}`);
    }
  }
}

migrateCmsPages();
