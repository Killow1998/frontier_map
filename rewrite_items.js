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
  'I037', 'I03S', 'I043', 'I034' // Materials / unique
];

function transformText(text) {
  if (!text) return text;
  
  // 1. Remove the title row e.g., |cffFFD36B刽剑（lv4）|r|n
  text = text.replace(/\|cffFFD36B[^|]*?（lv\d）\|r\|n/g, '');
  text = text.replace(/\|cffFFD36B小刀\|r\|n/g, '');
  text = text.replace(/\|cffFFD36B[^|]*?\|r\|n\|cffB8B8B8/g, '|cffB8B8B8');

  // 2. Convert flavor text from gray color to uncolored, and keep the |n|n
  text = text.replace(/\|cffB8B8B8(.*?)\|r/g, (match, p1) => {
    return p1;
  });

  // 3. Transform inline abilities to Firefly style
  // Old: |cff66CCFF[鬼步]|r |cff00FF80移动速度 +40|r
  // New: |n|cffFFCC00[鬼步]|r|n移动速度 +40
  // Wait, let's just do a regex replace for the inline abilities
  text = text.replace(/\|cff66CCFF(\[.*?\])\|r \s*\|cff00FF80(.*?)\|r/g, '|cffFFCC00$1|r|n$2');
  text = text.replace(/\|cffDDA0FF(\[.*?\])\|r \s*(.*?)(?=\|n|$)/g, '|cffFFCC00$1|r|n$2');

  // Also remove redundant |cff00FF80 from stats, let's keep them green but use Firefly's cff00FF00 if needed, or just leave as 00FF80
  // Firefly uses |cff00FF00 for stats.
  text = text.replace(/\|cff00FF80/g, '|cff00FF00');

  // 4. Mysterious Branch descriptions
  if (text.includes('进阶分支：')) {
    text = text.replace(/\|cffFFE680进阶分支：\|r/g, '|cffFFCC00[进阶线索]|r');
    
    // Replace right side of arrow with mysterious text
    // E.g., |cffFFE680→|r |cff66CCFF闪身剑（lv5）|r |cffB8B8B8→ 充能可蜕变穿梭之剑（lv6）|r
    // We want to capture everything after → until the end of the line, and replace it.
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?闪身剑.*?\|r.*?\|r/g, '|cffFFE680→|r |cffB8B8B8撕裂空间之刃|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?陨星重剑.*?\|r.*?\|r/g, '|cffFFE680→|r |cffB8B8B8引落群星之剑|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?城墙.*?\|r/g, '|cffFFE680→|r |cffB8B8B8无可撼动之壁|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?陨星盾.*?\|r/g, '|cffFFE680→|r |cffB8B8B8星辰偏斜之盾|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?狂战斧.*?\|r/g, '|cffFFE680→|r |cffB8B8B8血路横开之斧|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?分身斧.*?\|r/g, '|cffFFE680→|r |cffB8B8B8战意裂影之斧|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?雄狮之戒.*?\|r/g, '|cffFFE680→|r |cffB8B8B8狮心遗威之戒|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?羽弓.*?\|r/g, '|cffFFE680→|r |cffB8B8B8矢发必中之弓|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?精神凝聚.*?\|r/g, '|cffFFE680→|r |cffB8B8B8灵识凝聚的头骨|r');
    text = text.replace(/\|cffFFE680→\|r\s*\|cff66CCFF.*?坚定意志.*?\|r/g, '|cffFFE680→|r |cffB8B8B8狂意并存的头骨|r');
  }

  if (text.includes('→小刀（lv7）')) {
    text = text.replace(/→小刀（lv7）/g, '→ 罪孽化身之刃');
  }

  // Basic upgrades
  text = text.replace(/\|cffFFE680可用 \|r\|cff00E5FF升级宝石\|r\|cffFFE680 升级\|r/g, '|cffFFCC00[进阶线索]|r|n可用|cff00E5FF升级宝石|r唤醒更强力量');
  text = text.replace(/\|cffFFE680可用 \|r\|cff00E5FF升级宝石\|r\|cffFFE680 \+ \|r\|cff00E5FF魔法毛皮\|r\|cffFFE680 升级\|r/g, '|cffFFCC00[进阶线索]|r|n可用|cff00E5FF升级宝石|r与|cff00E5FF魔法毛皮|r唤醒更强力量');

  // Fix specific items manually
  if (text.includes('开启月弓终阶锻造')) {
    text = text.replace(/\|cffFFE680用于合成：月弓（lv4）\+ 升级宝石 \+ 月之钥匙 -> 羽弓（lv5）\|r/g, '|cffFFCC00[进阶线索]|r|n与特定的月之弓弦共鸣，将唤醒那张传说中的长弓。');
  }
  if (text.includes('可用于合成陨星装备')) {
    text = text.replace(/可用于合成陨星装备/g, '蕴含着引落群星的力量，是重铸神兵的绝佳材料。');
  }
  if (text.includes('可用于锻造雷弧之铠')) {
    text = text.replace(/可用于锻造雷弧之铠/g, '拥有让盔甲覆盖雷霆，反噬攻击者的力量。');
  }

  return text;
}

let report = '# 装备文本风格与神秘感修改报告\n\n';

const blockRegex = /\[I[0-9A-Z]{3}\][\s\S]*?(?=\n\[I[0-9A-Z]{3}\]|$)/g;
content = content.replace(blockRegex, (block) => {
  const idMatch = block.match(/\[(I[0-9A-Z]{3})\]/);
  if (!idMatch) return block;
  const id = idMatch[1];
  
  if (!itemsToUpdate.includes(id)) {
    return block;
  }

  const origDescMatch = block.match(/Description = "(.*?)"/);
  const origUbertipMatch = block.match(/Ubertip = "(.*?)"/);
  
  if (!origDescMatch) return block;

  const origDesc = origDescMatch[1];
  const origUbertip = origUbertipMatch ? origUbertipMatch[1] : '';

  const newDesc = transformText(origDesc);
  const newUbertip = origUbertip ? transformText(origUbertip) : '';

  let newBlock = block.replace(`Description = "${origDesc}"`, `Description = "${newDesc}"`);
  if (origUbertip) {
    newBlock = newBlock.replace(`Ubertip = "${origUbertip}"`, `Ubertip = "${newUbertip}"`);
  }

  report += `### ID: ${id}\n\n**修改前 (Ubertip/Description):**\n\`\`\`text\n${origUbertip || origDesc}\n\`\`\`\n\n**修改后:**\n\`\`\`text\n${newUbertip || newDesc}\n\`\`\`\n\n---\n`;

  return newBlock;
});

fs.writeFileSync(iniPath, content, 'utf8');
fs.writeFileSync(path.join(__dirname, 'item_update_report.md'), report, 'utf8');
console.log('Update complete.');
