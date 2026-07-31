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

// Compute Kastenprinzip font scaling and no-wrap style attributes
function getStyleAttr(text, targetLen) {
    if (!text || text.length === 0) return '';
    const scale = text.length <= targetLen ? 100 : Math.max(Math.floor((targetLen / text.length) * 100), 40);
    return `style="font-size: ${scale}%; white-space: nowrap;"`;
}

const style1 = getStyleAttr(part1, 9);
const style2 = getStyleAttr(part2, 3);
const style3 = getStyleAttr(part3, 5);
const style4 = getStyleAttr(part4, 6);

// Load page.tsx
const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

// Replace inner text or placeholders cleanly without double wrapping
html = html.replace(/<div data-anim="title">\s*\{\{SERVICE_BANNER_1\}\}\s*<\/div>/g, `<div data-anim="title" ${style1}>${part1}</div>`);
html = html.replace(/\{\{SERVICE_BANNER_1\}\}/g, `<div data-anim="title" ${style1}>${part1}</div>`);

html = html.replace(/<div>\s*\{\{SERVICE_BANNER_2\}\}\s*<\/div>/g, `<div ${style2}>${part2}</div>`);
html = html.replace(/\{\{SERVICE_BANNER_2\}\}/g, part2);

html = html.replace(/<div data-anim="title">\s*\{\{SERVICE_BANNER_3\}\}\s*<\/div>/g, `<div data-anim="title" ${style3}>${part3}</div>`);
html = html.replace(/\{\{SERVICE_BANNER_3\}\}/g, `<div data-anim="title" ${style3}>${part3}</div>`);

html = html.replace(/<div data-anim="title">\s*\{\{SERVICE_BANNER_4\}\}\s*<\/div>/g, `<div data-anim="title" ${style4}>${part4}</div>`);
html = html.replace(/\{\{SERVICE_BANNER_4\}\}/g, `<div data-anim="title" ${style4}>${part4}</div>`);

// Remove any double nested <div data-anim="title">
html = html.replace(/<div data-anim="title">\s*<div data-anim="title"([^>]*)>(.*?)<\/div>\s*<\/div>/g, `<div data-anim="title"$1>$2</div>`);

fs.writeFileSync(pagePath, html);
console.log(`Successfully split and injected Service Banner (${bannerText}) into 4 parts with auto-scaling: "${part1}" / "${part2}" [IMG] "${part3}" / "${part4}"`);
