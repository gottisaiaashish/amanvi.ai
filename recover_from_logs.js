const fs = require('fs');
const transcriptPath = "C:\\Users\\gotti\\.gemini\\antigravity-ide\\brain\\73a9af11-f2d2-4e62-b98f-693b6dbdc0e6\\.system_generated\\logs\\transcript.jsonl";
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let filesToRecover = [
  'AmanviSecretary.tsx',
  'DailySchedule.tsx',
  'UnifiedInbox.tsx',
  'BrightLayout.tsx'
];

let recovered = {};

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    let entry = JSON.parse(line);
    if (entry.tool_calls) {
      for (let call of entry.tool_calls) {
        if (call.name === 'write_to_file' || call.name === 'default_api:write_to_file') {
          let targetFile = call.args.TargetFile;
          if (targetFile) {
            for (let fileName of filesToRecover) {
              if (targetFile.includes(fileName)) {
                recovered[fileName] = call.args.CodeContent;
              }
            }
          }
        }
      }
    }
  } catch(e) {}
}

for (let fileName in recovered) {
  let fullPath = '';
  if (fileName === 'BrightLayout.tsx') {
    fullPath = 'C:\\Users\\gotti\\Amanvi AI\\frontend\\src\\layouts\\' + fileName;
  } else {
    fullPath = 'C:\\Users\\gotti\\Amanvi AI\\frontend\\src\\pages\\' + fileName;
  }
  fs.writeFileSync(fullPath, recovered[fileName], 'utf8');
  console.log('Recovered from logs: ' + fullPath);
}
