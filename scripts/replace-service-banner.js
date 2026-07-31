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

// Load page.tsx
const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

html = html.replace('{{SERVICE_BANNER_1}}', part1);
html = html.replace('{{SERVICE_BANNER_2}}', part2);
html = html.replace('{{SERVICE_BANNER_3}}', part3);
html = html.replace('{{SERVICE_BANNER_4}}', part4);

fs.writeFileSync(pagePath, html);
console.log(`Successfully split and injected Service Banner (${bannerText}) into 4 parts: "${part1}" / "${part2}" [IMG] "${part3}" / "${part4}"`);
