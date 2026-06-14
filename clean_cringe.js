const fs = require('fs');
const file = 'c:/Users/gotti/Amanvi AI/frontend/src/utils/AmanviBrain.ts';
let data = fs.readFileSync(file, 'utf8');

// Replace all lines that contain specific cringe words with a simple generic string
const cringeRegex = /.*(?:love|hero|prema|kadupu|muddulu|😘|🥰|❤️|thinnanu).*/gi;

let lines = data.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('patterns:')) continue; // don't touch patterns
    
    if (line.toLowerCase().includes('love') || 
        line.toLowerCase().includes('hero') || 
        line.toLowerCase().includes('prema') || 
        line.toLowerCase().includes('kadupu') || 
        line.toLowerCase().includes('muddul') || 
        line.includes('😘') || 
        line.includes('🥰') || 
        line.includes('❤️')) {
        
        // If it's a string inside an array
        if (line.trim().startsWith('"') && line.trim().endsWith('",') || line.trim().endsWith('", ')){
            lines[i] = line.replace(/"[^"]+"/, '"Sare Ashish."');
        } else if (line.trim().startsWith('"') && line.trim().endsWith('"')) {
            lines[i] = line.replace(/"[^"]+"/, '"Sare Ashish."');
        }
    }
}

fs.writeFileSync(file, lines.join('\n'));
