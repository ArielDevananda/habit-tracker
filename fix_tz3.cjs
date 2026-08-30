const fs = require('fs');
let files = ['resources/js/pages/analytics.tsx', 'resources/js/pages/dashboard.tsx'];

files.forEach(file => {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/c\.completed_on\?\.split\('T'\)\[0\]/g, "(c.completed_on ? new Date(c.completed_on).toLocaleDateString('en-CA') : '')");
    c = c.replace(/habit\.start_date \? habit\.start_date\.split\('T'\)\[0\] : ''/g, "habit.start_date ? new Date(habit.start_date).toLocaleDateString('en-CA') : ''");
    fs.writeFileSync(file, c);
});
