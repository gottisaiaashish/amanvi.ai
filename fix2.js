const fs = require('fs');

function fixFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8').trim();
    
    // If it starts with a quote, it must be a JSON string literal.
    // However, it might be double escaped. Let's just use JSON.parse.
    if (content.startsWith('"')) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error("JSON parse failed for " + filePath, e);
        // Fallback: manually strip quotes
        content = content.replace(/^"/, '').replace(/"$/, '');
        content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + filePath);
  }
}

const pagesDir = 'frontend/src/pages/';
fixFile(pagesDir + 'AmanviSecretary.tsx');
fixFile(pagesDir + 'DailySchedule.tsx');
fixFile(pagesDir + 'UnifiedInbox.tsx');

const layoutsDir = 'frontend/src/layouts/';
fixFile(layoutsDir + 'BrightLayout.tsx');
