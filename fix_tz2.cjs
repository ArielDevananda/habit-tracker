const fs = require('fs');
let c = fs.readFileSync('resources/js/pages/dashboard.tsx', 'utf8');
c = c.replace(/\.toISOString\(\)\.split\('T'\)\[0\]/g, ".toLocaleDateString('en-CA')");
fs.writeFileSync('resources/js/pages/dashboard.tsx', c);
