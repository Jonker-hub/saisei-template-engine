const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

const parts = html.split('class="kanji_wrap');

// First, handle the Hero Kanji separately since it doesn't use kanji_wrap
html = html.replace(/<svg[^>]*class="hero_svg_small"[^>]*>.*?<\/svg>/, 
  `<div class="kanji_svg_text" style="font-family: var(--font--secondary, serif); font-size: clamp(1.5rem, 3vw, 2.5rem); line-height: 1.1; font-weight: 300; text-transform: uppercase; color: var(--theme--text); opacity: 0.6; margin-bottom: 0.5rem; white-space: nowrap;">Microtext 0A</div>`
);

// Now re-split for the standard kanji blocks
const updatedParts = html.split('class="kanji_wrap');

for (let i = 1; i < updatedParts.length; i++) {
  // Replace the FIRST kanji_svg in this block with Microtext [X]A
  updatedParts[i] = updatedParts[i].replace(/<svg[^>]*class="kanji_svg"[^>]*>.*?<\/svg>/, 
    `<div class="kanji_svg_text" style="font-family: var(--font--secondary, serif); font-size: clamp(1.5rem, 3vw, 2.5rem); line-height: 1.1; font-weight: 300; text-transform: uppercase; color: var(--theme--text); opacity: 0.6; margin-bottom: 0.5rem; white-space: nowrap;">Microtext ${i}A</div>`
  );

  // Replace the FIRST kanji_title in this block with Microtext [X]B
  // Some elements use data-anim="title", others use data-big-text="text". We use [^>]* to catch both.
  updatedParts[i] = updatedParts[i].replace(/<div class="kanji_title"><div[^>]*>.*?<\/div><\/div>/, 
    `<div class="kanji_title"><div data-anim="title">Microtext ${i}B</div></div>`
  );

  // Replace the FIRST kanji_title_small in this block with Microtext [X]C
  updatedParts[i] = updatedParts[i].replace(/<div class="kanji_title_small"><div[^>]*>.*?<\/div><\/div>/, 
    `<div class="kanji_title_small"><div data-anim="title">Microtext ${i}C</div></div>`
  );
}

html = updatedParts.join('class="kanji_wrap');
fs.writeFileSync(pagePath, html);
console.log('Replaced kanji blocks synchronously with Template labels successfully!');
