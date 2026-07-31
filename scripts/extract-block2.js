const fs = require('fs');
let html = fs.readFileSync('../saisei-nextjs/src/app/page.tsx', 'utf8');
const parts = html.split('class="kanji_wrap');
const block = parts[2];
const svgEnd = block.indexOf('</svg>');
console.log(block.substring(svgEnd, svgEnd + 500));
