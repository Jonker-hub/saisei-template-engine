const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../saisei-sbj.webflow.io');
const destDir = path.join(__dirname, '../src/app');

const filesToMigrate = [
  { file: 'about-us.html', route: 'about-us' },
  { file: 'contact-us.html', route: 'contact-us' },
  { file: 'journal.html', route: 'journal' },
  { file: 'project.html', route: 'project' },
  { file: 'service.html', route: 'service' },
  { file: 'sustainability.html', route: 'sustainability' },
  { file: 'privacy-policy.html', route: 'privacy-policy' },
  { file: 'terms-of-service.html', route: 'terms-of-service' },
];

function getClosingBracketIndex(str, startIndex) {
  let depth = 0;
  let i = startIndex;
  
  // Find the first <
  while (i < str.length && str[i] !== '<') {
    i++;
  }

  while (i < str.length) {
    if (str.substring(i, i + 2) === '</') {
      depth--;
      i = str.indexOf('>', i) + 1;
      if (depth === 0) return i;
    } else if (str[i] === '<' && str.substring(i, i + 2) !== '<!' && str.substring(i, i + 2) !== '<?') {
      // Check if it's a self closing tag like <img /> or <br> or <hr> or <input> or <path> etc
      const closeBracket = str.indexOf('>', i);
      const tagContent = str.substring(i + 1, closeBracket);
      const tagName = tagContent.split(/\s+/)[0].toLowerCase();
      const selfClosingTags = ['img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'path', 'circle'];
      const isSelfClosing = tagContent.endsWith('/') || selfClosingTags.includes(tagName);
      
      if (!isSelfClosing) {
        depth++;
      }
      i = closeBracket + 1;
    } else {
      i++;
    }
  }
  return -1;
}

// Ensure the tag matcher is perfectly accurate for the menu
function extractMainContent(html) {
  const menuStart = html.indexOf('<div class="menu">');
  if (menuStart === -1) {
    console.warn("Could not find <div class=\"menu\">");
    return "";
  }
  
  let menuEnd = getClosingBracketIndex(html, menuStart);
  if (menuEnd === -1) {
    console.warn("Could not find closing tag for menu");
    return "";
  }
  
  let mainContent = '';
  
  const footerStart = html.indexOf('<footer class="footer">', menuEnd);
  if (footerStart === -1) {
    console.warn("Could not find <footer class=\"footer\">, grabbing everything until end of page_wrap");
    // Just take everything up to the end of the string
    mainContent = html.substring(menuEnd);
  } else {
    mainContent = html.substring(menuEnd, footerStart);
  }
  
  // Clean up any potential Awwwards badge
  mainContent = mainContent.replace(/<div id="awwwards"[\s\S]*?<\/div>/gi, '');
  mainContent = mainContent.replace(/<div id="awwwards-embed"[\s\S]*?<\/div>/gi, '');
  
  // Fix internal links
  mainContent = mainContent.replace(/href="([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$1$2"');
  mainContent = mainContent.replace(/href="index\.html(#[^"]*)?"/g, 'href="/$1"');
  
  // Webflow specific fixes for React dangerouslySetInnerHTML
  // We don't need to fix class to className because dangerouslySetInnerHTML accepts standard HTML string!
  // But wait, it's HTML, so it doesn't matter! It will be parsed as HTML natively by the browser!
  
  return mainContent.trim();
}

for (const item of filesToMigrate) {
  const filePath = path.join(srcDir, item.file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${item.file}, not found.`);
    continue;
  }
  
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Extract body inner HTML
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    console.log(`Skipping ${item.file}, no body found.`);
    continue;
  }
  
  const mainContent = extractMainContent(bodyMatch[1]);
  if (!mainContent) {
    console.log(`Skipping ${item.file}, could not extract main content.`);
    continue;
  }
  
  const routeDir = path.join(destDir, item.route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  const pagePath = path.join(routeDir, 'page.tsx');
  
  const pageCode = `export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${mainContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}
`;
  
  fs.writeFileSync(pagePath, pageCode);
  console.log(`Migrated ${item.file} -> src/app/${item.route}/page.tsx`);
}
