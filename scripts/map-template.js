const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../../saisei-original/src/app/page.tsx');
let html = fs.readFileSync(pagePath, 'utf8');

// Define exact string replacements to convert the static template into a fully dynamic Engine
const replacements = {
    // Hero Section
    'Meaning to "rebirth" or "regeneration," reflecting a commitment to sustainable and regenerative design practices, aiming to redefine urban environments.': '{{INFOTEXT_1}}',
    '<div data-loader="scroll-txt">scroll</div>': '<div data-loader="scroll-txt">{{MICROTEXT_1}}</div>',
    
    // About Section
    'Every Line Tells a story': '{{HIGHLIGHT_1}}',
    'In every project at Saisei, the essence of 伝統 (tradition) is evident. By integrating the disciplined aesthetics and thoughtful methodologies of our ancestors, we ensure that each structure is not only environmentally attuned but also rich in cultural significance. Our designs reflect a deep respect for the past, while embracing the innovations of the future.': '{{INFOTEXT_2}}',
    'About Us': '{{BUTTON_1}}',
    
    // Projects Section
    'Shizuka Gardens': '{{PROJECT_1_NAME}}',
    'Kawa Lofts': '{{PROJECT_2_NAME}}',
    'Kinsei Pavilion': '{{PROJECT_3_NAME}}',
    'see project': '{{BUTTON_5}}',
    
    // Services Section
    'Designs That Sustain Life': '{{HIGHLIGHT_2}}',
    'Saisei is committed to revolutionizing architecture through sustainability. Each of our projects embodies our dedication to environmental stewardship, leveraging innovative technologies and green practices that set new standards for the industry.': '{{INFOTEXT_3}}',
    'Sustainability': '{{BUTTON_2}}',
    'Precision': '{{SERVICE_BANNER_1}}',
    '<div>In</div>': '<div>{{SERVICE_BANNER_2}}</div>',
    '<div>Every</div>': '<div>{{SERVICE_BANNER_3}}</div>',
    'DEsign': '{{SERVICE_BANNER_4}}',
    'Each Saisei project blends custom solutions with sustainable innovation, ensuring our designs meet your exact needs while respecting the planet.': '{{INFOTEXT_4}}',
    'our service': '{{BUTTON_3}}',
    
    // Philosophy / Contact Section
    "We embrace the spirit of '一期一会' (Ichi-go ichi-e), recognizing that each project presents a unique opportunity to create something exceptional. This philosophy guides our practice, instilling a sense of meticulous care and attention to detail in every design and interaction.": '{{INFOTEXT_5}}',
    'Craft Your Vision': '{{HIGHLIGHT_4}}',
    'Saisei blends innovation and sustainability to craft spaces that stand out and stand for something. Let’s bring your vision to life with thoughtful, modern design.': '{{INFOTEXT_6}}',
    'Get in touch': '{{BUTTON_4}}'
};

// Apply replacements
for (const [original, variable] of Object.entries(replacements)) {
    // Escape special regex characters in the original string
    const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Global replace
    const regex = new RegExp(escapedOriginal, 'g');
    html = html.replace(regex, variable);
}

const templatePath = path.join(__dirname, '../src/app/master-skeleton.tsx');
fs.writeFileSync(templatePath, html);
console.log('Successfully mapped the template! Saved skeleton to master-skeleton.tsx.');
