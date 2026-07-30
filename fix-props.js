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
  
  // React camelCase props
  content = content.replace(/ srcset=/g, ' srcSet=');
  content = content.replace(/ tabindex=/g, ' tabIndex=');
  content = content.replace(/ autoplay=/g, ' autoPlay=');
  content = content.replace(/ playsinline=/g, ' playsInline=');
  content = content.replace(/ datetime=/g, ' dateTime=');
  content = content.replace(/ stroke-width=/g, ' strokeWidth=');
  content = content.replace(/ stroke-linecap=/g, ' strokeLinecap=');
  content = content.replace(/ stroke-linejoin=/g, ' strokeLinejoin=');
  content = content.replace(/ fill-rule=/g, ' fillRule=');
  content = content.replace(/ clip-rule=/g, ' clipRule=');
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed props.');
