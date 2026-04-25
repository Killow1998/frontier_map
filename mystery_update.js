const fs = require('fs');
const path = require('path');

const iniPath = path.join(__dirname, 'maps/table/item.ini');
let content = fs.readFileSync(iniPath, 'utf8');

const itemsToUpdate = [
  'I005', 'I006', 'I007', 'I008', 'I009', 'I00A', 'I03T', 'I03U', // Sword
  'I00H', 'I00F', 'I00J', 'I00I', 'I00E', 'I03Q', // Shield
  'I00U', 'I00S', 'I00R', 'I00V', 'I00T', 'I042', // Armor
  'I010', 'I00Z', 'I00X', 'I011', 'I012', 'I00Y', // Axe
  'I01L', 'I01M', 'I01N', 'I01O', 'I01P', 'I01Q', // Banner
  'I01J', 'I01H', 'I01K', 'I01G', 'I01I', // Ring
  'I00L', 'I00M', 'I00N', 'I00O', 'I00K', // Book
  'I01S', 'I01T', 'I01U', 'I01V', 'I01W', // Staff
  'I01Z', 'I01X', 'I01Y', 'I021', 'I020', // Bow
  'I018', 'I015', 'I016', 'I017', 'I019', 'I01A', // Helmet
  'I023', 'I024', 'I025', 'I026', 'I027', 'I028', 'I022', // Knife
];

function transformText(text) {
  if (!text) return text;
  
  // 1. Remove any item names with levels e.g. |cffFFD36B闪身剑（lv5）|r
  // Also remove the starting name if it exists
  text = text.replace(/\|cffFFD36B[^|]*?（lv\d）\|r\|n/g, '');
  text = text.replace(/\|cffFFD36B[^|]*?\|r\|n/g, ''); // Remove general leading names
  
  // 2. Remove names and levels from branch indicators
  // Matches things like "→ |cff66CCFF闪身剑（lv5）|r"
  text = text.replace(/→\s*\|cff66CCFF[^|]*?（lv\d）\|r/g, '→ |cffB8B8B8未知的新力量|r');
  text = text.replace(/→\s*\|cff66CCFF[^|]*?\|r/g, '→ |cffB8B8B8未知的形变|r');
  
  // 3. Remove "→ 充能可蜕变穿梭之剑（lv6）" etc
  text = text.replace(/→\s*[^|]*?蜕变[^|]*?（lv\d）/g, '');
  text = text.replace(/→\s*[^|]*?蜕变[^|]*?(\n|$)/g, '\n');

  // 4. Firefly style stats and abilities
  text = text.replace(/\|cff00FF80/g, '|cff00FF00'); // Green
  
  // Abilities transformation
  // Old: |cff66CCFF[Ability]|r |cff00FF00Effect|r
  // New: |n|cffFFCC00[Ability]|r|nEffect
  text = text.replace(/\|cff66CCFF(\[.*?\])\|r\s*(.*?)(?=\|n|$)/g, '|n|cffFFCC00$1|r|n$2');
  
  // 5. Clean up any trailing/double newlines or artifacts
  text = text.trim();
  text = text.replace(/\|n\|n\|n/g, '|n|n');

  // Specific branch text for common weapons
  if (text.includes('空间宝石')) {
      text = text.replace(/撕裂空间之刃/g, '撕裂空间的力量');
  }
  if (text.includes('星石')) {
      text = text.replace(/引落群星之剑/g, '引落群星的力量');
  }
  
  return text;
}

const blocks = content.split(/\r?\n\r?\n/);
let result = '';
let reportData = [];

for (let block of blocks) {
    const idMatch = block.match(/\[(I[0-9A-Z]{3})\]/);
    if (idMatch && itemsToUpdate.includes(idMatch[1])) {
        const id = idMatch[1];
        const lines = block.split(/\r?\n/);
        let name = '';
        let oldUbertip = '';
        let newLines = [];
        
        for (let line of lines) {
            if (line.startsWith('Name =')) name = line.replace('Name =', '').trim();
            if (line.startsWith('Ubertip =')) {
                oldUbertip = line.replace('Ubertip = "', '').replace(/"$/, '');
                const newUbertip = transformText(oldUbertip);
                newLines.push(`Ubertip = "${newUbertip}"`);
                
                reportData.push({ id, name, old: oldUbertip, modified: newUbertip });
            } else if (line.startsWith('Description =')) {
                const oldDesc = line.replace('Description = "', '').replace(/"$/, '');
                const newDesc = transformText(oldDesc);
                newLines.push(`Description = "${newDesc}"`);
            } else {
                newLines.push(line);
            }
        }
        result += newLines.join('\n') + '\n\n';
    } else {
        result += block + '\n\n';
    }
}

fs.writeFileSync(iniPath, result.trim(), 'utf8');

let finalReport = '# 装备文本神秘感重构报告\n\n';
for (let item of reportData) {
    finalReport += `### ID: ${item.id} (${item.name})\n\n**修改前:**\n\`\`\`text\n${item.old}\n\`\`\`\n\n**修改后:**\n\`\`\`text\n${item.modified}\n\`\`\`\n\n---\n`;
}
fs.writeFileSync('item_mystery_report.md', finalReport, 'utf8');
console.log('Update complete.');
