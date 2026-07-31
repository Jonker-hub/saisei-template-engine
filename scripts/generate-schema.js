const fs = require('fs');
const path = require('path');

// These are the exact strings from the untouched master template
const masterTexts = {
    "HERO_PARAGRAPH": 'Meaning to "rebirth" or "regeneration," reflecting a commitment to sustainable and regenerative design practices, aiming to redefine urban environments.',
    "HERO_SCROLL_TEXT": 'scroll',
    
    "ABOUT_HEADING": 'Every Line Tells a story',
    "ABOUT_PARAGRAPH": 'In every project at Saisei, the essence of 伝統 (tradition) is evident. By integrating the disciplined aesthetics and thoughtful methodologies of our ancestors, we ensure that each structure is not only environmentally attuned but also rich in cultural significance. Our designs reflect a deep respect for the past, while embracing the innovations of the future.',
    "ABOUT_BUTTON_TEXT": 'About Us',
    
    "PROJECT_1_NAME": 'Shizuka Gardens',
    "PROJECT_2_NAME": 'Kawa Lofts',
    "PROJECT_3_NAME": 'Kinsei Pavilion',
    "PROJECT_LINK_TEXT": 'see project',
    
    "SERVICES_HEADING_1": 'Designs That Sustain Life',
    "SERVICES_PARAGRAPH_1": 'Saisei is committed to revolutionizing architecture through sustainability. Each of our projects embodies our dedication to environmental stewardship, leveraging innovative technologies and green practices that set new standards for the industry.',
    "SERVICES_BUTTON_1": 'Sustainability',
    "SERVICES_HEADING_2A": 'Precision',
    "SERVICES_HEADING_2B": 'DEsign',
    "SERVICES_PARAGRAPH_2": 'Each Saisei project blends custom solutions with sustainable innovation, ensuring our designs meet your exact needs while respecting the planet.',
    "SERVICES_BUTTON_2": 'our service',
    
    "PHILOSOPHY_PARAGRAPH": "We embrace the spirit of '一期一会' (Ichi-go ichi-e), recognizing that each project presents a unique opportunity to create something exceptional. This philosophy guides our practice, instilling a sense of meticulous care and attention to detail in every design and interaction.",
    "CONTACT_HEADING": 'Craft Your Vision',
    "CONTACT_PARAGRAPH": 'Saisei blends innovation and sustainability to craft spaces that stand out and stand for something. Let’s bring your vision to life with thoughtful, modern design.',
    "CONTACT_BUTTON": 'Get in touch'
};

const masterPagePath = path.join(__dirname, '../../saisei-nextjs/src/app/page.tsx');
const html = fs.readFileSync(masterPagePath, 'utf8');

// Also extract the scrollText
const matches = [...html.matchAll(/data-big-text="head">([^<]+)<\/div>/g)];
let originalScrollText = 'the art of innovation';
if (matches.length >= 2) {
    originalScrollText = matches[0][1] + ' ' + matches[1][1];
}

masterTexts["SCROLL_TEXT"] = originalScrollText;

const schema = {};

for (const [key, text] of Object.entries(masterTexts)) {
    const charCount = text.length;
    const wordCount = text.split(/\s+/).length;
    
    schema[key] = {
        originalText: text,
        originalCharCount: charCount,
        originalWordCount: wordCount,
        limits: {
            minChars: Math.max(1, Math.floor(charCount * 0.7)),
            maxChars: Math.ceil(charCount * 1.3),
            minWords: Math.max(1, Math.floor(wordCount * 0.7)),
            maxWords: Math.ceil(wordCount * 1.3)
        }
    };
}

const schemaPath = path.join(__dirname, '../template-schema.json');
fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
console.log('Successfully generated extensive template-schema.json with all fields mapped!');
