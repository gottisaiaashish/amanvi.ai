const fs = require('fs');

function fixFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove leading and trailing quotes if present
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.substring(1, content.length - 1);
    }
    
    // Replace literal '\n' with actual newline
    content = content.replace(/\\n/g, '\n');
    
    // Replace literal '\"' with '"'
    content = content.replace(/\\"/g, '"');
    
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
