const fs = require('fs');
const path = require('path');

const iniPath = path.join(__dirname, 'maps/table/item.ini');
let content = fs.readFileSync(iniPath, 'utf8');

// Accurate mapping of internal logic names to real item names
const mysteryMap = {
    '撕裂空间的力量': '闪身剑',
    '引落群星的力量': '陨星重剑',
    '无可撼动之壁': '城墙',
    '星辰偏斜之盾': '陨星盾',
    '血路横开之斧': '狂战斧',
    '战意裂影之斧': '分身斧',
    '狮心遗威之戒': '雄狮之戒',
    '矢发必中之弓': '羽弓',
    '灵识凝聚的头骨': '精神凝聚之智慧头骨',
    '狂意并存的头骨': '坚定意志之狂暴头骨',
    '罪孽化身之刃': '小刀',
    '撕裂空间之刃': '闪身剑',
    '引落群星之剑': '陨星重剑'
};

// 1. Restore real names but remove levels
for (let mystery in mysteryMap) {
    const regex = new RegExp(mystery, 'g');
    content = content.replace(regex, mysteryMap[mystery]);
}

// 2. Further sweep to remove remaining (lvX) in formula lines
content = content.replace(/（lv\d）/g, '');

// 3. Fix the "Sword (lv1)" starting names in descriptions that were stripped too much
// We will only do this for the Ubertip/Description lines.
// We need to keep the flavor text but don't want the raw ID appearing.

fs.writeFileSync(iniPath, content, 'utf8');
console.log('Text names restored. Levels removed.');
