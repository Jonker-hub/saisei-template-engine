const fs = require('fs');
const path = require('path');

// Load config / content
const contentPath = path.join(__dirname, '../content.json');
let content = {};
if (fs.existsSync(contentPath)) {
    content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
}

const bannerText = content.HIGHLIGHT_3 || "Precision In Every Design";
const words = bannerText.split(' ').filter(w => w.length > 0);

let part1 = '', part2 = '', part3 = '', part4 = '';

if (bannerText.match(/^Highlight\s+3[AB]?/i)) {
    const match = bannerText.match(/^Highlight\s+3[AB]?/i)[0];
    const rest = bannerText.substring(match.length).trim();
    const restWords = rest.split(' ').filter(w => w.length > 0);
    part1 = match;
    part2 = restWords[0] || 'In';
    part3 = restWords[1] || 'Every';
    part4 = restWords.slice(2).join(' ') || 'Design';
} else if (words.length <= 4) {
    part1 = words[0] || '';
    part2 = words[1] || '';
    part3 = words[2] || '';
    part4 = words[3] || '';
} else {
    part1 = words[0];
    part2 = words[1];
    part3 = words[2];
    part4 = words.slice(3).join(' ');
}

// Compute Kastenprinzip font scaling and no-wrap style for each part
function formatPart(text, targetLen, isAnimTitle = true) {
    if (!text || text.length === 0) return '';
    const scale = text.length <= targetLen ? 100 : Math.max(Math.floor((targetLen / text.length) * 100), 40);
    const style = `style="font-size: ${scale}%; white-space: nowrap;"`;
    if (isAnimTitle) {
        return `<div data-anim="title" ${style}>${text}</div>`;
    }
    return `<div ${style}>${text}</div>`;
}

const htmlPart1 = formatPart(part1, 9, true);
const htmlPart2 = formatPart(part2, 3, false);
const htmlPart3 = formatPart(part3, 5, true);
const htmlPart4 = formatPart(part4, 6, true);

// Load page.tsx
const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

// Replace the inner divs in page.tsx
html = html.replace('<div data-anim="title">Highlight 3</div>', htmlPart1);
html = html.replace('<div>In</div>', htmlPart2);
html = html.replace('<div data-anim="title">Every</div>', htmlPart3);
html = html.replace('<div data-anim="title">Design</div>', htmlPart4);

fs.writeFileSync(pagePath, html);
console.log(`Successfully split and injected Service Banner (${bannerText}) into 4 parts with auto-scaling: "${part1}" / "${part2}" [IMG] "${part3}" / "${part4}"`);
