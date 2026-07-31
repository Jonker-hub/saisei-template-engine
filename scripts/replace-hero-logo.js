const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

// Load config
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const heroLogoText = config.heroLogoText || "LX1";
const footerLogoText = config.footerLogoText || "FooterLogo";

// Load font
const fontPath = path.join(__dirname, 'PPFragment-SerifLight.ttf');
const font = opentype.parse(fs.readFileSync(fontPath));

// Generate Hero SVG Paths (viewBox 0 0 1443 390)
const heroFontSize = 280;
const heroTextWidth = font.getAdvanceWidth(heroLogoText, heroFontSize);
const heroX = (1443 - heroTextWidth) / 2;
const heroY = 300;

const heroGlyphPaths = font.getPaths(heroLogoText, heroX, heroY, heroFontSize);
let heroPathsHtml = '';
heroGlyphPaths.forEach(p => {
    const d = p.toPathData(2);
    if (d && d.length > 5) {
        heroPathsHtml += `  <path d="${d}" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>\n`;
    }
});

// Generate Footer SVG Paths (viewBox 0 0 1443 390)
// The footer logo is usually a bit smaller or just scales to the container
const footerFontSize = 280;
const footerTextWidth = font.getAdvanceWidth(footerLogoText, footerFontSize);
const footerX = (1443 - footerTextWidth) / 2;
const footerY = 300;

const footerGlyphPaths = font.getPaths(footerLogoText, footerX, footerY, footerFontSize);
let footerPathsHtml = '';
footerGlyphPaths.forEach(p => {
    const d = p.toPathData(2);
    if (d && d.length > 5) {
        footerPathsHtml += `  <path d="${d}" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>\n`;
    }
});


const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

// 1. Replace Hero SVG
html = html.replace(/(<svg[^>]*class="hero_svg"[^>]*>)([\s\S]*?)(<\/svg>)/, 
  `$1\n${heroPathsHtml}$3`
);

// We must remove the Lx1Sync component and CSS animation we previously injected
html = html.replace(/<Lx1Sync \/>/g, '');
html = html.replace(/import Lx1Sync from "@\/components\/Lx1Sync";\n/g, '');

fs.writeFileSync(pagePath, html);

// 2. Replace Footer Logo text block with animated SVG in Footer.tsx
const footerPath = path.join(__dirname, '../src/components/Footer.tsx');
let footerHtml = fs.readFileSync(footerPath, 'utf8');

const footerSvgReplacement = `
<svg viewBox="0 0 1443 390" fill="none" data-loader="svg" className="footer_svg" style={{width: "100%", height: "auto", marginBottom: "2rem"}}>
${footerPathsHtml}
</svg>
`;

// In the master template, the footer logo is an <svg> with className="footer_info_svg"
footerHtml = footerHtml.replace(/(<svg[^>]*className="footer_info_svg"[^>]*>)([\s\S]*?)(<\/svg>)/, footerSvgReplacement);

fs.writeFileSync(footerPath, footerHtml);
console.log(`Successfully generated vector paths for Hero: "${heroLogoText}" and Footer: "${footerLogoText}"!`);
