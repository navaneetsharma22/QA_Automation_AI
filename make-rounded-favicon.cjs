const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'public', 'logo.png');
const svgPath = path.join(__dirname, 'public', 'logo.svg');

const imageBuffer = fs.readFileSync(logoPath);
const base64Data = imageBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64Data}`;

const svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circleMask">
      <circle cx="50" cy="50" r="50"/>
    </clipPath>
  </defs>
  <image href="${dataUri}" width="100" height="100" clip-path="url(#circleMask)"/>
</svg>`;

fs.writeFileSync(svgPath, svgContent);
console.log('Created logo.svg successfully!');
