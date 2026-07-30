const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../../saisei-sbj.webflow.io/index.html'), 'utf-8');

const menuStart = html.indexOf('<div class="menu">');
const navStart = html.indexOf('<nav class="nav">');

if (menuStart !== -1 && navStart !== -1) {
  let menuHtml = html.substring(menuStart, navStart);
  
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
  console.log('Menu successfully extracted to Menu.tsx!');
} else {
  console.log('Could not find menu boundaries!');
}
