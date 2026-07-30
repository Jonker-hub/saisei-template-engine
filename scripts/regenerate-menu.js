const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../../saisei-sbj.webflow.io/index.html'), 'utf-8');

const menuStart = html.indexOf('<div class="menu">');
const menuEnd = html.indexOf('</div></div><main'); 

let menuHtml = '';
if (menuStart !== -1 && menuEnd !== -1) {
  // We add +12 to include the </div></div>
  menuHtml = html.substring(menuStart, menuEnd + 12);
  
  // Clean up links and assets
  menuHtml = menuHtml.replace(/(src|href)="(\.\.\/)*assets\//g, '$1="/assets/');
  menuHtml = menuHtml.replace(/href="(\.\.\/)*project\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/project/$2$3"');
  menuHtml = menuHtml.replace(/href="(\.\.\/)*post\/([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/post/$2$3"');
  menuHtml = menuHtml.replace(/href="(\.\.\/)*([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$2$3"');
  menuHtml = menuHtml.replace(/href="(\.\.\/)*index\.html(#[^"]*)?"/g, 'href="/"');

  const menuCode = `export default function Menu() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${menuHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}`;
  fs.writeFileSync(path.join(__dirname, '../src/components/Menu.tsx'), menuCode);
  console.log('Menu.tsx fixed with dangerouslySetInnerHTML');
} else {
  console.log('Could not find menu boundaries in index.html');
}
