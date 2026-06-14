const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/gotti/Amanvi AI/frontend';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.js') || file.endsWith('.json')) {
    const filePath = path.join(dir, file);
    if (!fs.statSync(filePath).isFile()) continue;
    
    let content = fs.readFileSync(filePath, 'utf8').trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      try {
        content = JSON.parse(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed ' + file);
      } catch (e) {
        console.error('Failed ' + file);
      }
    }
  }
}
