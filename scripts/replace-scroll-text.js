const fs = require('fs');
const path = require('path');

// Load schema to get the original text length
const schemaPath = path.join(__dirname, '../template-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const originalCharCount = schema.MICROTEXT_6.originalCharCount; // 21
const originalLimits = schema.MICROTEXT_6.limits;

// Load config
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const scrollText = config.scrollText || "the art of innovation";

// Calculate Scaling Factor to ensure the text physically fits the original bounding box
const newCharCount = scrollText.length;
let scaleFactor = 100;
if (newCharCount > originalCharCount) {
    // If the text is longer than original, scale it down proportionally
    scaleFactor = Math.floor((originalCharCount / newCharCount) * 100);
}

// Split the string into two roughly equal halves for the two rows
const words = scrollText.split(' ');
let part1 = '';
let part2 = '';

if (words.length === 1) {
    part1 = words[0];
    part2 = '';
} else {
    const midIndex = Math.ceil(words.length / 2);
    part1 = words.slice(0, midIndex).join(' ');
    part2 = words.slice(midIndex).join(' ');
}

// Load page.tsx
const pagePath = path.join(__dirname, '../src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

// Replace the two rows and inject the dynamically calculated font-size scale
let replaceCount = 0;
html = html.replace(/<div data-big-text="head">[\s\S]*?<\/div>/g, (match) => {
    if (replaceCount === 0) {
        replaceCount++;
        const row1Scale = Math.floor((10 / Math.max(1, part1.length)) * 100);
        return `<div data-big-text="head" style="font-size: ${row1Scale}%; white-space: nowrap;">${part1}</div>`;
    } else if (replaceCount === 1) {
        replaceCount++;
        const row2Scale = Math.floor((10 / Math.max(1, part2.length)) * 100);
        return `<div data-big-text="head" style="font-size: ${row2Scale}%; white-space: nowrap;">${part2}</div>`;
    }
    return match;
});

fs.writeFileSync(pagePath, html);
console.log(`Successfully split and injected scroll text: "${part1}" / "${part2}"`);
