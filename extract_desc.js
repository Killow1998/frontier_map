const fs = require('fs');
const path = require('path');

const iniPath = path.join(__dirname, 'maps/table/item.ini');
const content = fs.readFileSync(iniPath, 'utf8');

const blocks = content.split(/\r?\n\r?\n/);
let output = '';
for (const block of blocks) {
  if (block.includes('Description =')) {
    const lines = block.split(/\r?\n/);
    let id = '';
    let desc = '';
    let name = '';
    for (const line of lines) {
      if (line.startsWith('[')) id = line;
      if (line.startsWith('Name =')) name = line.replace('Name =', '').trim();
      if (line.startsWith('Description =')) desc = line.replace('Description =', '').trim();
    }
    
    // Check if it's basic equipment or has branching/upgrade paths
    if (desc.includes('lv') || desc.includes('进阶分支') || desc.includes('蜕变') || desc.includes('可用') || desc.includes('升级宝石')) {
      output += `ID: ${id}\nName: ${name}\nDesc: ${desc}\n--------------------------------------------------\n`;
    }
  }
}
fs.writeFileSync('desc_output.txt', output, 'utf8');
