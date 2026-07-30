const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/page.tsx',
  'src/components/Footer.tsx',
  'src/components/Navbar.tsx',
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix unclosed void elements
  const voidElements = ['link', 'meta', 'img', 'input', 'hr', 'br'];
  
  voidElements.forEach(tag => {
    const regex = new RegExp(`<${tag}((?![^>]*?/>)[^>]*?)>`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  // some might have trailing spaces before the closing tag, we just fixed them.
  // Let's also make sure style="" was properly converted.
  // We already did this in extract.js, but let's double check there's no remaining style="..."
  
  // Check for Next.js image warnings by replacing src with valid next Image? No, standard img is fine.
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed JSX files.');
