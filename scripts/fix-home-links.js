const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/href="([a-zA-Z0-9-]+)\.html(#[^"]*)?"/g, 'href="/$1$2"');
content = content.replace(/href="index\.html(#[^"]*)?"/g, 'href="/"');
fs.writeFileSync(file, content);
console.log('Links updated in page.tsx');
