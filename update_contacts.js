const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const regex1 = /<div class="footer-contact-item" style="margin-top:10px;">[\s\S]*?Madhava: 9666250268<\/a>\s*<\/span>\s*<\/div>/g;
const regex2 = /<div class="footer-contact-item" style="display:flex; gap:var\(--space-sm\); align-items:flex-start;">\s*<i class="fa-solid fa-phone" style="color:var\(--gold\); margin-top:3px; flex-shrink:0;"><\/i>\s*<div style="font-size:0\.88rem;">\s*<a href="tel:6301042993" style="color:var\(--gold\); display:block; font-weight:600;">63010 42993<\/a>\s*<a href="tel:9666250268" style="color:var\(--text-secondary\);">96662 50268<\/a>\s*<\/div>\s*<\/div>/g;

const newHTML = `<div class="footer-contact-item" style="display:flex; gap:var(--space-sm); align-items:flex-start;">
            <i class="fa-solid fa-phone" style="color:var(--gold); margin-top:3px; flex-shrink:0;"></i>
            <div style="font-size:0.88rem;">
              <div style="color:var(--text-secondary); margin-bottom:4px; font-size: 0.8rem;">Managed by:</div>
              <a href="tel:6301042993" style="color:var(--gold); display:block; font-weight:600; margin-bottom:2px;">Jamakala Obulesh: 63010 42993</a>
              <a href="tel:9912281479" style="color:var(--text-secondary); display:block; margin-bottom:2px;">Varukute Hanumanthu: 99122 81479</a>
              <a href="tel:9666250268" style="color:var(--text-secondary); display:block;">Pula Madhava: 96662 50268</a>
            </div>
          </div>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(regex1, newHTML).replace(regex2, newHTML);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
}
