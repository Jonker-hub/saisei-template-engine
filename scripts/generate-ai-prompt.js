const fs = require('fs');
const path = require('path');

// Load the schema generated from the master template
const schemaPath = path.join(__dirname, '../template-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Exemplary Prompt Generation for the scrollText field
const scrollTextLimits = schema.scrollText.limits;

const systemPrompt = `
Du bist ein erstklassiger Copywriter für eine hochmoderne Website.
Deine Aufgabe ist es, kreative Texte für verschiedene Bereiche der Webseite zu generieren.

FELD: "scrollText" (Der große, animierte Text, der beim Scrollen über den Bildschirm fliegt)
Vorgaben für dieses Feld:
- Min. Zeichen: ${scrollTextLimits.minChars}
- Max. Zeichen: ${scrollTextLimits.maxChars}
- Min. Wörter: ${scrollTextLimits.minWords}
- Max. Wörter: ${scrollTextLimits.maxWords}

Bitte beachte diese Limits strengstens, da ansonsten das Design der Webseite brechen könnte.
Antworte ausschließlich in folgendem JSON-Format:

{
  "scrollText": "Dein generierter Text hier"
}
`;

console.log("=== GENERIERTER GEMINI SYSTEM PROMPT ===");
console.log(systemPrompt);
console.log("========================================");

// We could write this to a file or send it directly to the Gemini API here.
