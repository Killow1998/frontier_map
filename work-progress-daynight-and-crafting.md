# 昼夜修复与合成测试投放进度

## 本次任务目标
- 修复当前昼夜流程异常（昼夜切换、倒计时显示、阶段状态收敛）。
- 在传送锚点旁空地投放测试物资（30 个升级宝石 + 全部基础装备）。
- 将进度与问题记录到工程工作目录 markdown 中，便于持续追踪。

## 已完成改动
- `src/migration/combat/bladeAndWave.ts`
  - `big_wave (A086)` 从“马甲施放 A002”改为纯脚本模拟（无马甲伤害）：
    - 按原 `A002` 参数（每秒波数/伤害/半径/持续/延迟）生成水流批次；
    - 落点伤害统一由施法者本体 `UnitDamageTarget` 结算。

- `src/migration/items/helmetDraftMagicBook.ts`
  - `book_fire (A01N)` 从“马甲火山 A01O”改为目标区域火山喷发脚本模拟（无马甲伤害）；
  - 每轮喷发仅保留表现特效，伤害统一由施法者本体结算。

- `src/migration/core/helpers.ts`
  - 移除伤害代理注册/回滚机制（`registerDamageProxyUnit/unregisterDamageProxyUnit` 及受伤总线中的代理重定向分支）。
  - 任意单位受伤总线仅保留正常分发，不再做马甲伤害回滚重算。

- `src/migration/combat/spellBursts.ts`
  - `fire_blast` / `fire_arrow` 改为“马甲仅表现，伤害由施法者本体脚本结算”：
    - `YDWETimerPatternRushSlide` 传入伤害改为 `0`；
    - 新增 `startProjectileDamageSimulation()` 负责按弹道位置命中并由本体 `UnitDamageTarget`。
  - 移除了这两个技能中的 `registerDamageProxyUnit/unregisterDamageProxyUnit` 依赖。

- `src/migration/combat/showDa.ts`
  - 重炮近距离眩晕分支移除伤害代理注册（`A06M` 本身伤害为 0，仅保留眩晕表现）。

- `src/migration/combat/bladeAndWave.ts`
  - `Tempest` 终结踩踏分支移除伤害代理注册（`A0AC` 本身伤害为 0，仅保留表现）。

- `src/migration/core/camera.ts`（新增）
  - 抽离统一镜头辅助：所有本地玩家镜头平移统一使用 `1.0s`。
  - 提供统一入口：点位平移、矩形中心平移、回基地/锚点平移。

- `src/migration/flow/mapInit.ts`
  - 开局镜头改为使用统一镜头辅助（固定 `1.0s`）。
  - 开局自动为 1~4 号玩家选中引导“小动物”单位：
    - 优先匹配对应玩家预设小动物 `n00C/n00D/n00E/n00F`；
    - 优先营地区域内单位，找不到再回退营地附近最近单位。

- `src/migration/heroes/selectHeroes.ts`
  - 选雇佣兵后的镜头移动统一为 `1.0s`（建筑师等所有分支一致）。

- `src/migration/systems/playerRespawn.ts`
  - 复活后镜头移动统一为 `1.0s`。

- `src/migration/items/sinSystems.ts`
  - 修复“选择罪人不移动镜头”：罪人雇佣成功后也会执行同一套 `1.0s` 镜头切换。

- `src/migration/combat/shadowKnife.ts`
  - “投身原罪”选项顺序调整为：**力 / 敏 / 智**，然后 **Q / W / E / R**（懒惰 / 暴怒 / 嫉妒 / 傲慢）。

- `src/migration/heroes/selectHeroes.ts`
  - 雇佣兵选择后的镜头切换强化为本地玩家 `SetCameraPosition + PanCameraToTimed(0)`，优先对准传送锚点。

- `src/migration/flow/mapInit.ts`
  - 开局镜头切换同步改为本地玩家 `SetCameraPosition + PanCameraToTimed`。

- `src/migration/systems/playerRespawn.ts`
  - 复活镜头切换同步改为本地玩家 `SetCameraPosition + PanCameraToTimed(0)`。

- `src/migration/heroes/selectHeroes.ts`
  - 雇佣兵选择后的镜头切换改为优先对准传送锚点 `gg_unit_n001_0012`，回退基地中心。
  - 镜头移动改为本地玩家 `PanCameraToTimed`，不再依赖 `PanCameraToTimedLocForPlayer`。

- `src/migration/systems/playerRespawn.ts`
  - 复活后镜头切换同样改为本地玩家 `PanCameraToTimed`，避免兼容函数缺失导致镜头不动。

- `src/migration/items/equipmentCrafting.ts`
  - 概率坍缩成功文案分支调整：
    - 额外概率 `> 0`：显示 `额外概率已清空`
    - 额外概率 `= 0`：显示 `暴击!升级成功`

- `src/migration/items/helmetAndTech.ts`
  - 同步上述概率坍缩成功文案分支。

- `src/migration/flow/difficulty.ts`
  - 难度确认后新增首夜倒计时兜底：若计时窗口缺失则重建首夜并强制显示倒计时窗口。

- `src/migration/flow/nightCome.ts`
  - 夜晚启动增加异常自愈：若 `udg_Night_Phase_Active=true` 但计时窗口不存在，自动重建夜晚流程。

- `src/migration/flow/mapInit.ts`
  - 开局镜头平移改为本地玩家直接 `PanCameraToTimed`，不再依赖 `PanCameraToTimedLocForPlayer` 兼容分支，确保镜头进入雇佣兵营地。

- `src/config/Map.ts`
  - 修正视觉初始化：从“关闭迷雾/黑幕”改为“启用迷雾/黑幕”，恢复开局战争迷雾与黑色阴影。

- `src/main.ts`
  - 移除测试用 `PanCameraToTimed(200, 0, 0)` 固定镜头跳转，避免覆盖 init 触发器中“镜头移动到雇佣兵营地”的逻辑。

- `src/migration/core/helpers.ts`
  - 新增 `jass.globals` 读写映射，`getGlobal/setGlobal/disableLegacyTrigger/replaceGlobalTrigger` 不再只依赖 `_G`。
  - 修复点：确保 `gg_trg_*`、`udg_*`、`gg_unit_*` 等 JASS 全局在 TS 中可读可写，避免“遗留触发器未被关闭”的并发执行。

- `src/migration/core/takeover.ts`
  - 接管扫描逻辑兼容 `_G` 与 `jass.globals` 双来源，避免漏扫触发器句柄。

- `src/migration/flow/dayCome.ts`
  - 回归“冻结时间流 + 定时结束后跳时刻”的稳定模式。
  - 白天阶段开始时显式冻结时间流；结束时恢复并切到 `23.98`。
  - 去除白天倒计时面板依赖，避免与夜晚面板状态相互干扰。

- `src/migration/flow/nightCome.ts`
  - 进入夜晚时先禁用夜触发器，避免重入。
  - 夜晚计时面板标题改为 `距黎明来临还有`，并按原节奏创建夜晚计时与结束计时。
  - 夜晚结束后统一清理状态、恢复时间流并切到 `11.98`。

- `src/migration/flow/mapInit.ts`
  - 新增 `spawnCraftTestItemsNearAnchor()`。
  - 在 `gg_unit_n001_0012`（传送锚点）东侧空地环形投放：
    - 30 个升级宝石（`I00D`）
    - 9 个基础装备起始件（剑/甲/旗/戒/杖/弓/斧/盾/盔）。
  - 已接入 `init` 触发器初始化流程。

## 当前风险与待观察项
- 夜晚倒计时文字是否在所有分辨率/UI缩放下都可见，需实机再确认。
- 测试物资投放位置按锚点东侧偏移实现，若地形改动后被遮挡，需要再调偏移量。
- `big_wave` 与 `book_fire` 已改为脚本模拟，需再做实机伤害节奏校准（体感是否与旧图一致）。

## 装备流程平滑化（方案草案）
- 目标：降低“传送锚点两侧野区刷升级宝石直毕业”的单一路径，拉平中期成长节奏。
- 建议方案（优先级从高到低）：
  1. 分段解锁：基础链 `lv1~lv3` 保持现状；`lv4` 需额外消耗“波次材料”；`lv5` 需额外消耗“Boss 材料”。
  2. 区域递减：同一玩家在同一野区短时间重复刷宝石时，掉率递减并随时间恢复。
  3. 失败保底：沿用现有概率坍缩，并对 `lv4/lv5` 失败额外返还少量材料，减少纯负反馈。
- 当前状态：已记录，待你确认后按该方案落地到 TS 触发链。

## 验证记录
- 已执行：`npm run build --silent`
- 已执行：`npm test --silent`
- 结果：构建与测试启动流程通过（生成并启动最新地图包）。
- 追加验证：完成 `jass.globals` 映射修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“开局镜头与坍缩成功清空提示”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“首夜倒计时兜底 + 坍缩成功文案分支”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“雇佣兵选择后镜头切锚点 + 复活镜头一致化”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“镜头强制定位 + 原罪投身顺序调整”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“镜头平滑(>=0.2s) + 开局自动选中小动物引导”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“开局引导单位改为营地优先 + 玩家预设小动物优先”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“罪人镜头补齐 + 全局镜头统一1.0s”修复后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“马甲伤害归属重构（优先事件改伤+弹道脚本结算）”后再次执行 `npm run build --silent && npm test --silent`，通过。
- 追加验证：完成“big_wave/book_fire 无马甲伤害脚本化 + 代理系统移除”后再次执行 `npm run build --silent && npm test --silent`，通过。

## 最新进展（雇佣兵技能实现审计 + 伤害类型表）

- 审计范围：
  - 常规雇佣兵 7 名：`H001/H007/H009/H00A/H00E/E002/N00Q` 的 `heroAbilList` 全部技能。
  - 罪人分支：`H004` 通过触发动态授予的技能（`A054/A05B/A05G/A05H/A05I`）。
- 审计目标：
  - 确认每个技能在 TS 中的实现位置、是否直接结算伤害、伤害类型（物理/魔法/其他）。
  - 识别可简化点与潜在逻辑风险。

### 伤害类型归类（按当前 TS 实现）

| 英雄 | 技能 | 归类 | 依据 |
| --- | --- | --- | --- |
| 大棒波比 | 水盾护体（A04T） | 物理 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL)` |
| 大棒波比 | 扇巴掌（A04O） | 魔法 | `UnitDamageTarget(... ATTACK_TYPE_MAGIC, DAMAGE_TYPE_COLD)` |
| 大棒波比 | 会心一击（A006） | 物理 | 仅增幅普攻伤害（受伤总线中改写普攻伤害值） |
| 大棒波比 | 大水波（A086） | 物理 | 脚本波次命中 `ATTACK_TYPE_NORMAL + DAMAGE_TYPE_NORMAL` |
| 建筑师 | 快速建造（A05O） | 非直接伤害 | 技能切换/建造链，无直接 `UnitDamageTarget` |
| 建筑师 | 傀儡军团（A05R） | 非直接伤害 | 技能切换/召唤链，无直接 `UnitDamageTarget` |
| 建筑师 | 精进技艺（A05Q） | 非直接伤害 | 召唤强化与属性增益，无直接 `UnitDamageTarget` |
| 建筑师 | 燃魔（A05M） | 非直接伤害 | 技能栏切换，无直接 `UnitDamageTarget` |
| 焉影 | 鲜血之影（A062） | 其他 | 仅存在自伤（`CHAOS + DIVINE`），不直接对敌结算 |
| 焉影 | 影袭（A05V） | 其他 | 对敌为 `CHAOS + DIVINE`（非标准物理/魔法） |
| 焉影 | 暗影狂缚（A05Y） | 其他 | 主体为控制链；脚本直接伤害仅自伤（`CHAOS + DIVINE`） |
| 焉影 | 影馈（A05Z） | 非直接伤害 | 吸收来伤并转恢复，无直接对敌伤害 |
| 刀客 | 一斩千击（A063） | 物理 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL)` |
| 刀客 | 斩魄血祭（A065） | 非直接伤害 | 持续回血与属性变化，无直接对敌伤害 |
| 刀客 | 锋芒渐盛（A067） | 物理 | 受伤总线里追加 `ATTACK_TYPE_HERO + DAMAGE_TYPE_NORMAL` |
| 刀客 | 乱舞终焉（A069） | 其他 | `UnitDamageTarget(... ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEMOLITION)` |
| 研法者 | 能量涌刺（A06V） | 魔法 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC)` |
| 研法者 | 星陨（A06S） | 魔法 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC)` |
| 研法者 | 虚饰光环（A06N） | 非直接伤害 | 光环分发与“魔法命中后成长”逻辑，无直接对敌伤害 |
| 研法者 | 虚饰空间（A06U） | 非直接伤害 | 控制/重置冷却，无直接 `UnitDamageTarget` |
| 重炮 | Q（A06G） | 非直接伤害 | 学习触发与形态缓存，不直接结算伤害 |
| 重炮 | 侦察无人机（A06D） | 非直接伤害（TS侧） | 当前无独立 TS 伤害逻辑，主要依赖对象技能/子技能链 |
| 重炮 | 转移阵地（A06K） | 非直接伤害 | 学习触发增加敏捷，不直接结算伤害 |
| 重炮 | 让子弹飞（A06L） | 物理 | 仅改写普攻伤害倍率/近距控制，不直接写魔法伤害 |
| 炼药师 | 毒雾（A06W） | 物理 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL)` |
| 炼药师 | 不稳定化合物（A071） | 非直接伤害 | 自身状态转化与持续耗蓝回血，无直接对敌伤害 |
| 炼药师 | 生命炼成（A072） | 非直接伤害 | 击杀奖励/成长逻辑，无直接对敌伤害 |
| 炼药师 | 极限剂量（A073） | 非直接伤害 | 自身增益与耗蓝回血，无直接对敌伤害 |
| 罪人（动态） | knife（A054） | 非直接伤害 | 仅弹窗选择原罪分支 |
| 罪人（动态） | 懒惰（A05B） | 物理 | `UnitDamageTarget(... ATTACK_TYPE_NORMAL, DAMAGE_TYPE_DEMOLITION)` |
| 罪人（动态） | 暴怒（A05G） | 非直接伤害 | 赋予范围普攻与护盾，无直接 `UnitDamageTarget` |
| 罪人（动态） | 嫉妒（A05H） | 其他 | 脚本直接伤害仅自伤（`ATTACK_TYPE_CHAOS`） |
| 罪人（动态） | 傲慢（A05I） | 物理 | 冲刺命中 `ATTACK_TYPE_NORMAL + DAMAGE_TYPE_NORMAL` |

### 审计发现（可简化点 / 风险）

1. 状态存储键存在“按单位类型共享”写法（如 `SHADOW_HERO_ID`、`SHARPENING_ABILITY_ID` 作为 hashtable 主键），在“同职业多单位并存”时会互相覆盖状态。
2. 部分被动触发为避免递归采用 `DisableTrigger/EnableTrigger`（全触发器级别），在多人同英雄场景会形成共享冷却窗。
3. 重复工具函数（`destroyEffectLater/removeUnitLater/isUnitAlive/polarProjection`）在多个战斗文件重复定义，可抽到公共 combat utils 统一维护。
4. `A06D（侦察无人机）` 当前无独立 TS 脚本入口，若后续要做平衡迭代或精确伤害归因，建议显式迁移其子技能链并收口到同一模块。

## 最新进展（技能伤害类型统一 + 会心一击学习面板修复）

- 已完成：将迁移代码中的技能伤害统一到三类口径：
  1. 物理攻击伤害（`attack=true` 且 `ATTACK_TYPE_NORMAL + DAMAGE_TYPE_NORMAL`）
  2. 非攻击物理伤害（`attack=false` 且 `ATTACK_TYPE_NORMAL + DAMAGE_TYPE_NORMAL`）
  3. 魔法伤害（`attack=false` 且 `ATTACK_TYPE_MAGIC + DAMAGE_TYPE_MAGIC`）
- 已完成：清理迁移代码中的非目标类型常量（`CHAOS/HERO` 与 `COLD/DEMOLITION/DIVINE/LIGHTNING/ENHANCED/UNIVERSAL`），并统一为上述三类。
- 已完成：补齐大棒波比 `A006 会心一击` 的学习面板字段（学习图标、学习提示、学习描述）：
  - `ResearchArt`
  - `Researchbuttonpos_1`
  - `Researchhotkey`
  - `Researchtip`
  - `Researchubertip`

### 本轮涉及文件

- `src/migration/combat/arcaneMagic.ts`
- `src/migration/combat/neutralDeaths.ts`
- `src/migration/combat/bladeAndWave.ts`
- `src/migration/combat/shadowKnife.ts`
- `src/migration/combat/ashArrow.ts`
- `src/migration/combat/crocodile.ts`
- `src/migration/combat/lightingEvents.ts`
- `src/migration/combat/sunAndOrb.ts`
- `src/migration/combat/supportSpells.ts`
- `src/migration/combat/swimming.ts`
- `src/migration/items/fireflyCloakEquip.ts`
- `src/examples/HeroUnitSkill.ts`
- `maps/table/ability.ini`

## 最新进展（关闭调试输出与FPS显示）

- 已完成：关闭运行时默认调试输出，避免 KKWE 控制台出现启动日志刷屏：
  - `src/config/index.ts`：默认配置改为 `debug=false`、`console=false`。
  - `src/ydlua/index.ts`：统一接管全局 `print`，默认静默；仅在显式开启 debug+console 时才写控制台。
- 已完成：关闭游戏界面 FPS 文本显示：
  - `src/main.ts`：`DzToggleFPS(true)` 改为 `DzToggleFPS(false)`。
- 结果：启动时不再默认输出 `print enabled / Global APIs registered / CameraControl / UnitBlood / MouseEventManager` 等调试信息，War3 界面的 `FPS:xx.x` 也已关闭。

## 最新进展（会心提示改为伤害飘字表现）

- 已完成：会心触发时的伤害飘字改为“数字+感叹号”样式（例如 `1234!`），不再使用“会心 xxx”文本样式。
  - 文件：`src/migration/combat/showDa.ts`
- 已完成：在消息节流层拦截遗留会心刷屏文本（`会心一击触发...`），避免高频战斗时屏幕文本刷屏。
  - 文件：`src/migration/core/helpers.ts`
- 结果：会心效果仅在伤害浮动文字上体现，不再出现高频文本刷屏。

## 最新进展（冰盾护体接入会心判定链）

- 问题：`A04T 冰盾护体` 伤害虽然走了 `attack=true`，但受伤总线中的“近期攻击追踪”仅来自 `EVENT_PLAYER_UNIT_ATTACKED`，导致会心判定只对普攻稳定生效。
- 已完成：
  1. `src/migration/core/helpers.ts` 新增 `markRecentAttackInfo()`，允许脚本技能手动写入“近期攻击”窗口。
  2. `src/migration/combat/waterWindReinforcements.ts` 在 `A04T` 每次命中前手动标记近期攻击，再结算伤害。
- 结果：大棒波比的 `冰盾护体` 命中现在会进入和普攻同一套会心判定与飘字表现链。

## 最新进展（会心飘字颜色保持玩家伤害色）

- 已完成：会心触发时不再切换为特殊金色，继续沿用原本“按玩家区分”的伤害颜色。
- 已完成：会心触发样式改为在数字前添加 `会心` 字样（示例：`会心 1234`），仅增强语义，不改变颜色归属。
- 文件：`src/migration/combat/showDa.ts`

## 最新进展（昼夜判断去哈希依赖）

- 已完成：`isDayTimeFromHashtable()` 改为直接读取游戏时间判断白昼/黑夜，不再依赖 `YDHT` 自定义值。
  - 判定规则：`GetFloatGameState(GAME_STATE_TIME_OF_DAY()) >= 12.0` 视为白昼。
  - 文件：`src/migration/core/helpers.ts`
- 结果：昼夜相关逻辑不再受哈希状态同步影响，调用点继续保持原接口不变。

## 最新进展（首夜倒计时按难度重建）

- 问题：难度确认后首夜倒计时在部分局仍固定为 `80s`，未随“晨曦/暮色/极夜”变化。
- 根因：夜晚流程在难度确认前可能已按默认难度启动；后续 `beginNightPhaseNow` 走“夜晚已激活”分支，仅显示旧面板，不重建时长。
- 已完成：`src/migration/flow/nightCome.ts` 的 `beginNightPhaseNow()` 改为先强制清除 `udg_Night_Phase_Active`，再重建夜晚阶段。
- 结果：难度确认后首夜倒计时会按难度正确刷新（80 / 160 / 210）。

## 最新进展（装备描述美化：剑系 + 盾系）

- 已完成：按“类型分批”方式先处理剑系与盾系物品描述，目标是分层、多色、分行、分支高亮。
- 已完成：在 `maps/table/item.ini` 中统一重写以下物品的 `Description/Ubertip`（并修正少数 `Tip` 为简洁标题）：
  - 剑系：短剑、铁剑、青钢长剑、刽剑、闪身剑、陨星重剑
  - 盾系：小圆盾、大圆盾、精铁盾、黑铁坚盾、城墙、陨星盾
- 风格收口：
  - 标题、风味句、属性、特性名、负面效果、进阶分支分别使用不同颜色；
  - `lv4` 分支材料与产物全部高亮（不再只高亮“升级宝石”）。
- 结果：装备提示不再是一整段同色文本，阅读层次与分支可读性显著提升。

## 最新进展（装备描述美化：戒指 + 魔法书 + 法杖）

- 已完成：继续按类型分批，重写三系物品提示文本（分层、多色、分行、特效命名、分支高亮）。
- 已完成：更新 `maps/table/item.ini`：
  - 戒指系：初心之戒、坚韧之戒、迅敏之戒、獠牙之戒、雄狮之戒
  - 魔法书系：水之复苏、土之唤醒、金之炼化、木之繁生、火之歌颂
  - 法杖系：学徒杖、风杖、雷杖、蛇杖、地狱之杖
- 已完成：将过长基础提示收敛为简洁标题（如火之歌颂、木之繁生、獠牙之戒、雄狮之戒、蛇杖、地狱之杖），详细信息统一放扩展提示。

## 最新进展（传送锚点左侧五系陈列）

- 已完成：在 `src/migration/flow/mapInit.ts` 新增 `POLISHED_EQUIPMENT_ROWS`，定义五系已优化装备清单：
  1. 剑系（含分支）
  2. 盾系（含分支）
  3. 戒指系
  4. 魔法书系
  5. 法杖系
- 已完成：在 `spawnCraftTestItemsNearAnchor()` 中新增“锚点左侧、每系一行”的地面投放逻辑，用于实机对照文案与分支显示。

## 最新进展（穿梭/陨星剑修正 + 长文案回补）

- 已完成：修正“陨星重剑”的蜕变说明为真实触发逻辑：击杀单位时按目标最大生命相关概率蜕变为“陨星剑”。
- 已完成：补齐关键升级提示：
  - “闪身剑”补充“主动使用可充能，概率蜕变穿梭之剑”。
  - “刽剑”分支行补充两条后续蜕变关键（穿梭剑充能、陨星剑击杀高生命目标）。
- 已完成：按“原本有较长介绍则保留”规则复查并回补原长句：
  - 穿梭之剑、陨星剑、陨星重剑、雄狮之戒等已保留/回补原有长介绍语义。
- 已完成：地面查阅投放补齐“穿梭之剑”与“陨星剑”，剑系展示行现包含分支与后续蜕变全链。

## 最新进展（剑链再修正 + 甲/斧/战旗三系迁移）

- 已完成：按最新要求二次修正剑链文案：
  - 陨星重剑已移除整段显式“可蜕变”说明，仅保留底部隐喻提示句。
  - 闪身剑恢复“隐喻 + 机制”风格的后续升级提示（施展折跃会积蓄涟漪，涟漪愈盛愈易蜕变）。
- 已完成：迁移甲系、斧系、战旗系提示文本为统一分层多色风格（标题/风味/属性/词条/分支提示）。
  - 甲系：破旧皮甲、链甲、精铁板甲、龙鳞胸甲、魔法皮甲、月之守护、雷弧之铠
  - 斧系：伐木斧、铁斧、精锐战斧、斩首斧、狂战斧、分身斧
  - 战旗系：魔法战旗、振奋战旗、守护战旗、棘刺战旗、嗜血战旗、染血之旗
- 已完成：锚点左侧地面查阅从原“五系”扩展到“八系”（新增甲/斧/战旗三行）。

## 最新进展（词条语义与显示稳定性修正）

- 已完成：雷弧之铠去掉独立“冷却”词条，冷却信息回并到“弧光护体”词条描述中。
- 已完成：陨星重剑恢复紫色升级线索词条“嗜血蜕变”，并保持隐喻表达，不写死显式升级结果。
- 已完成：闪身剑升级线索改为“仅提示会产生不同形态/力量”，不再出现后续装备名与等级。
- 已完成：嗜血战旗末行合成提示改写为紫色隐喻词条“鲜血祭旗”，缩短文本并移除可能导致截断的长彩色尾串，避免出现残缺色码显示。

## 最新进展（陨星剑词条归并 + 斧系分支格式统一）

- 已完成：陨星剑将“速度加快”并回“星辰祝福”词条，不再拆成两个独立词条。
- 已完成：斩首斧的进阶说明改成与四级盾一致的“进阶分支”结构：
  - 分支一：升级宝石 → 狂战斧（lv5）
  - 分支二：精锐战斧（lv3）+ 斩首斧（lv4）+（***）→ 分身斧（lv7）

## 最新进展（剩余装备收口：弓系 + 罪人系）

- 已完成：按新要求把斩首斧分支改为仅显示“（***）”。
- 已完成：弓系全链重写为统一分层多色风格：
  - 木弓、松木弓、桦木弓、月弓、羽弓
  - 月弓补齐“进阶分支”结构（升级宝石 + 钥匙（***）→ 羽弓）。
- 已完成：罪人相关装备重写为统一分层多色风格：
  - 小刀 lv1~lv7 全链
  - 罪孽护身符、罪孽之骨、秽影
- 已完成：锚点左侧地面展示补充弓系与罪人相关装备行，便于实机并排查阅。

## 最新进展（盔系收口）

- 已完成：盔系全链重写为统一分层多色风格：
  - 绒布头巾、英勇面甲、护卫战盔、秘银战盔
  - 精神凝聚之智慧头骨、坚定意志之狂暴头骨
- 已完成：秘银战盔补齐“进阶分支”结构（升级宝石 + 魔法毛皮 / 升级宝石 + 狂暴之心）。
- 已完成：锚点左侧地面展示补充盔系行；当前主要装备链均已纳入统一风格与地面查阅。

## 最新进展（词条位置与小刀文本压缩）

- 已完成：精神凝聚之智慧头骨将词条移动到属性行之后，显示顺序改为“属性在前，词条在后”。
- 已完成：小刀 lv4~lv7 文本压缩：
  - 合并多项属性到同一行（攻击/全属性、攻速/移速、魔法/生命等）。
  - 增加“以下属性仅对罪人生效”提示，去除每行重复后缀，减少占行。
  - 保留核心词条与升级提示，避免 tooltip 底部被截断。

## 最新进展（小刀全链统一紧凑版）

- 已完成：小刀 lv1~lv3 也同步改成与 lv4~lv7 相同的紧凑排版风格。
- 已完成：当前小刀 lv1~lv7 全链文本格式统一（属性合并行 + 罪人作用域提示 + 词条后置）。

## 最新进展（小刀文本进一步精简）

- 已完成：小刀全链移除“`小刀（lvx）`”描述行，避免重复占位。
- 已完成：小刀全链移除“以下属性仅对罪人生效”提示行，进一步释放 tooltip 空间。
- 已完成：继续压缩词条与属性文案长度，确保后续关键文本更容易完整显示。

## 最新进展（小刀紧凑版二次压缩）

- 已完成：在保留分行结构的前提下继续缩短小刀全链每行文本长度（lv1~lv7）。
- 已完成：统一改为“短句属性行 + 精简词条行 + 短升级行”，减少自动换行概率，优先保证底部关键行完整显示。

## 最新进展（小刀风味句与属性块留白）

- 已完成：小刀 lv1~lv7 在“浅色风味句”与“属性块”之间统一补回一个空行，保持视觉分层。
- 已完成：其余紧凑策略保持不变（短句行、短词条、短升级行）。

## 最新进展（材料/消耗品四项修正）

- 已完成：`升级宝石` 文案补充强化概率说明：
  - `Lv3 -> Lv4：55%`
  - `Lv4 -> Lv5：35%`
  - 同时补齐 `Lv1 -> Lv2`、`Lv2 -> Lv3` 的 100% 说明，统一展示在 Description/Ubertip。
- 已完成：`小型魔法药水` 更名为 `原始魔能之药`，并将价格从 `24` 调整为 `48`（翻倍）。
- 已完成：`原始魔能之药` 效果改为“恢复 150 点法力值 与 最大法力值 10% 取较高值”：
  - 在 `src/migration/items/manaAndItems.ts` 新增 `I02Z` 使用事件补偿逻辑；
  - 以原生 150 回复为基准，仅补足差值，确保最终达到目标回复量。
- 已完成：`月之钥匙` 与 `红龙之卵` 重写 Description/Ubertip，补齐用途与语义层次。
- 已完成：对应能力名称同步更新（`A09O`、`A09U`）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（Boss 技能读条指示与日成将军召唤回正）

- 已完成：`src/migration/combat/spellBursts.ts`
  - `slime_hit`：补上 `YDWEJumpTimer` 不可用时的脚本位移回退，确保史莱姆在读条后会实际跳向落点，不再“原地结算伤害”；
  - `fire_blast`：读条阶段补强路径指示（保留三向闪电并增加轨迹预警点），雇佣兵可提前判断冲击波扇区；
  - `fire_arrow`：按原触发器回正为“从施法者朝向发射”，读条阶段恢复路径指示（BrakeLights），并修正原先错误的“依赖目标单位定位发射”逻辑。
- 已完成：`src/migration/combat/supportSpells.ts`
  - `enemy_group` 回正为原图编组：`3 x n011`、`2 x u00F`、`1 x o002`；
  - 同步补回召唤落点特效、42 秒时限与随机攻击奖励（`attr=3`）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（充能瓶改为 9 次限制）

- 已完成：`充能瓶`（`I03G`）由“无限使用”改为“共 9 次使用”：
  - 物编字段新增 `uses = 9`；
  - Description/Ubertip 同步改为“共9次使用，每次冷却<A09Z,Cool1>s”。
- 已完成：`兑换充能瓶`（`I03H`）Description/Ubertip 同步改为“兑换后获得1个充能瓶（共9次使用）”。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（红龙条目纠正 + 药价与坍缩说明修正）

- 已完成：修正“龙契约 / 红龙之卵”混淆，恢复为两个独立条目：
  - `I03C` 还原为 `龙契约`（Name/Tip/Description/Ubertip）。
  - `A09U` 名称同步还原为 `龙契约`。
  - 牧师身上的 `I00B` 补齐为 `红龙之卵` 的独立描述（Name/Tip/Description/Ubertip）。
- 已完成：`原始魔能之药`（`I02Z`）价格改为 `97`。
- 已完成：`升级宝石`（`I00D`）文案追加“概率坍缩”机制说明（不写具体额外概率数值）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（扇巴掌对齐 + 杖系强化落地）

- 已完成：新增 `src/migration/items/staffEmpowerment.ts` 并接入 `src/migration/index.ts`：
  - 法杖全链新增“魔能汲取”被动（按最高杖阶回复伤害值的 1%~5% 法力）。
  - 雷杖新增智力联动（雷锤额外伤害受智力加成，眩晕时长随智力延长）。
  - 蛇杖新增智力联动（智力动态提升攻击速度与攻击范围）。
  - 地狱之杖新增智力联动（每 15 点智力叠层，攻击与护甲按指数增强，含倍率缓存表）。
- 已完成：`src/migration/combat/neutralDeaths.ts` 修正“扇巴掌”为敌方单体重击链，移除范围误伤，效果与描述一致。
- 已完成：`maps/table/ability.ini` 更新 `A04O` 文案为“重击+眩晕”语义，不再描述“让目标飞起来”。
- 已完成：`maps/table/item.ini` 更新学徒杖/风杖/雷杖/蛇杖/地狱之杖文本，补充“魔能汲取”和对应智力联动词条（不写具体数值）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（魔能汲取回蓝特效）

- 已完成：`src/migration/items/staffEmpowerment.ts` 为“魔能汲取”增加回蓝特效：
  - 特效模型：`Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl`
  - 挂点：`origin`
  - 使用定时器延迟销毁，避免特效句柄残留。
- 已完成：仅在实际回蓝量 `> 0` 时才播放特效（满蓝不触发）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（雷杖文案压缩 + 炼药师W修复）

- 已完成：雷杖（`I01U`）Description/Ubertip 再次压缩（属性合并、词条短句化、减少空行），避免 tooltip 底部被截断。
- 已完成：修复炼药师 `W`（`A071 不稳定化合物`）迁移逻辑偏差：
  - 移除错误的“施法后生命直接降至 1 点”与“按蓝量持续抽吸”的错误分支；
  - 恢复为“短时强化 + 倒计时 + 结束范围爆发”的原图行为；
  - 倒计时以单位头顶数字标签显示，结束时对周围有机单位结算伤害并清理强化状态。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（雇佣兵/Boss 技能核查 + 建筑师燃魔修正）

- 已完成：按 `unit.ini` 与 `war3map.j` 对全部雇佣兵技能、Boss 技能进行逐项核查，并对照当前 `src/migration` 实现确认行为一致性。
- 发现并修复 1 处功能偏差（会影响原图手感）：
  - 文件：`src/migration/combat/bladeAndWave.ts`
  - 触发器：`fire_mana (A05M)`
  - 问题：`快速建造` 与 `傀儡军团` 的强化技能映射在迁移代码中被对调。
  - 修正后：与原图一致，`A05O -> A05S`、`A05R -> A05T`。
- 已完成：本轮 `npm run build:dev --silent` 通过。

## 最新进展（传送锚点技能总测布置）

- 已完成：`src/migration/flow/mapInit.ts` 新增“测试单位投放”逻辑：
  - 在传送锚点附近刷出全部雇佣兵（含罪人）与全部主线 Boss。
  - 统一将测试单位等级拉满到 49 级并冻结经验，便于集中测试技能。
- 已完成：该逻辑已接入 `init` 触发器，开局自动部署。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（吸收飘字样式修正）

- 已完成：`src/migration/combat/shadowKnife.ts` 中“吸收”漂字样式修正：
  - 颜色改为淡紫色（`RGB: 205,160,255`）。
  - 增加与伤害数字一致的漂移动画速度（优先 `SetTextTagVelocityBJ(80, 70~110°)`，回退 `SetTextTagVelocity(0, 0.04)`）。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（逐触发器回正：刀客/重炮/研法者/首领）

- 已完成：`src/migration/combat/bladeAndWave.ts`
  - `Soul_Severing_Blood_Rite` 按原触发器恢复为“每秒回血+每秒叠加攻击加成，结束后延时回滚”，回血飘字改为绿色；
  - `Sharpening_Edge_attack` 修复“能力字段回退导致附伤为 0”的问题，改为按原图系数表结算层数附伤，层数飘字改为红色；
  - `blademan_die`/学习升级时同步修正满层增益回滚；
  - `big_wave` 回退为原图“马甲 stampede 冲锋波”实现，恢复移动中的水波表现。
- 已完成：`src/migration/combat/neutralDeaths.ts`
  - `slap` 恢复原图语义：目标点 100 范围敌方受击、带击飞，并保留落点眩晕马甲。
- 已完成：`src/migration/combat/arcaneMagic.ts`
  - `Arcane_Impale_New_stomp` 改为原图范围/伤害口径并补回命中击飞与中心轨迹特效；
  - `Starstrike` 伤害口径回正为 `ATTACK_TYPE_NORMAL + DAMAGE_TYPE_MAGIC`；
  - `Illusory_Void` 视觉改为“固定半径环绕”而非从中心慢慢外扩。
- 已完成：`src/migration/combat/spellBursts.ts` 与 `supportSpells.ts`
  - 倒计时飘字改回大号红字；
  - `fire_blast` / `fire_arrow` 在缺失 `YDWETimerPatternRushSlide` 时启用脚本位移回退，冲击波不再原地不动。
- 已完成：`src/migration/combat/showDa.ts`
  - `让子弹飞` 概率改为固定等级表（25/35/50），近距离眩晕马甲等级随技能等级同步。
- 已完成：`src/migration/combat/skillMorphs.ts`
  - 修复重炮 `A06E/A06F` 形态切换字段读取回退为 0 的问题，恢复“切换形态后属性真实变化”。
- 已完成：`src/migration/combat/shadowKnife.ts`
  - `shadow_return` 吸收分支补回吸收特效，恢复分支保留回蓝特效链。
- 已完成：`src/migration/flow/mapInit.ts`
  - 测试 Boss 列表移除已删除的 `小小/死骑士/巫妖`；
  - 保留可控测试 Boss，并补充满蓝/高智力施法环境；
  - 额外投放敌对靶场单位，解决“周围全友军导致技能看起来无效”的联调盲区。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（Codex Review 回归项修复）

- 已完成：`src/migration/flow/mapInit.ts`
  - 开局测试内容改为“默认关闭”，仅在显式开关 `udg_enable_migration_test_content=true` 时才投放测试道具/测试单位，避免正式开局被测试内容污染。
- 已完成：`src/migration/core/helpers.ts`
  - `getAbilityDataRealValue` 改为优先读取真实能力对象（`YDWEGetUnitAbilityDataReal / EXGetAbilityDataReal`），不再直接退回 fallback；
  - `setAbilityDataRealValue` / `setAbilityDataStringValue` 改为同步写回真实能力对象（`YDWESet* / EXSet*`），不再只写本地缓存；
  - `getAbilityStateValue` 改为读取真实能力状态（`YDWEGetUnitAbilityState / EXGetAbilityState`），修复冷却判定偏差；
  - `applyUnitBonus` 接回 `YDWEGeneralBounsSystemUnitSetBonus`（含 attr=3 攻击奖励），无 YDWE 时才走本地降级；
  - 新增 `overrideCurrentEventDamage`，优先用 `EXSetEventDamage/BlzSetEventDamage` 在同事件内改写伤害。
- 已完成：`src/migration/combat/showDa.ts`、`src/migration/combat/shadowKnife.ts`、`src/migration/objectives/showResource.ts`
  - 受伤改写优先改为同事件改伤害（`EXSetEventDamage`），仅在不可用时回退生命修正近似方案。
- 已完成：`src/migration/items/artificialSun.ts`
  - 人造太阳期间同步暂停/恢复 `udg_Night_Timer_End`，避免夜晚结束计时器提前跑完导致昼夜状态冲突。
- 已完成：`src/migration/flow/bossBranches.ts`
  - Boss AI 改回事件驱动（等价 `YDWEAddAIOrder`）：支持目标型/点目标/无目标/自目标施法；
  - 修复目标技能（如 `thunderbolt`、`entanglingroots`）被当作无目标施法导致不释放的问题。
- 已完成：`src/migration/systems/playerRespawn.ts`
  - 复活时间缩放改为优先读取全局开局计时器 `YDWEGetGameTime___t`（或 `YDWEGetGameTime`），不再仅依赖“首次死亡后才创建”的 fallback timer。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（night_come 强制白昼边界修复）

- 已完成：`src/migration/flow/nightCome.ts`
  - 修复 `gg_trg_night_come` 在 `udg_force_day=true` 时的边界控制流问题：
    - 移除午夜 action 中的提前 `DisableTrigger(triggerHandle)`；
    - 保留 `startNightPhase()` 内部“真正进入夜晚时才禁用触发器”的逻辑。
  - 结果：当强制白昼状态下命中午夜事件时，不会再把夜晚触发器永久关死；后续昼夜循环可继续正常推进。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（Boss AI 改为原生定时器轮询 + A08T 可读对照）

- 已完成：`src/migration/combat/soulCollector.ts`
  - 修复 `Soul_Collector` 开场“立即三连下命令”的错误行为；
  - 改为 **原生定时器 AI 轮询**（`1.0s` 一次），每轮按概率桶选择技能并尝试施放：
    - `cripple`（目标型，60）
    - `frostnova`（目标型，60）
    - `howlofterror`（无目标，45）
  - 目标型技能改为先搜索 Boss 周围最近敌方有效目标，再下令施放；
  - Boss 死亡时同步销毁 AI 定时器，避免遗留句柄。

- 已完成：`src/migration/flow/bossBranches.ts`
  - 通用 Boss AI 从“事件驱动（目标进范围/被攻击）”改为 **原生定时器轮询**；
  - 每个 Boss 出场后都会维护自己的 AI 定时器（`1.0s`）；
  - 每轮按概率抽取技能，并在需要目标时自动选取最近敌方单位。

- 已补充：`A08T` 召唤编组可读名称（避免只看 rawcode）
  - `3 x n011` = `3 x 若弩手`
  - `2 x u00F` = `2 x 肉虫`
  - `1 x o002` = `1 x 弱奇兵`
  - 以上名称来自 `maps/table/unit.ini` 的单位条目。

署名：**codex**

## 最新进展（2026-04-16：补齐测试场 Boss 投放）

- 已完成：测试场 Boss 列表补齐以下单位，便于一次性联调技能：
  - 爱洗澡的小鳄鱼（`O005`）
  - 元蜃（`U00K`）
  - 亡心林夕之王（`n00Z`）
- 已完成：开局测试开关开启时，上述单位会和其他 Boss 一并刷在传送锚点测试区。

署名：**copilot**

## 最新进展（2026-04-16：攻加成浮字与倒计时字号统一）

- 已完成：刀客二技能（`Soul_Severing_Blood_Rite`）移除“+攻”浮动文字，仅保留吸血数值反馈。
- 已完成：炼药师四技能（`Extreme_Dosage`）攻击力增减浮字放大，并与普通反馈字号统一。
- 已完成：倒计时字体统一放大（`alchemySpells` / `spellBursts` / `supportSpells` / `crocodile`）；非倒计时反馈统一为“比倒计时小一号”。

署名：**copilot**

## 最新进展（2026-04-16：绿字攻击力加成修复）

- 已完成：`applyUnitBonus(attr=3)` 在缺少 `YDWEGeneralBounsSystemUnitSetBonus` 时，改为使用 `YDb0..YDbm` 二进制能力写入攻击加成，确保显示为面板绿字攻击。
- 已完成：`showDa` 的 `getFallbackAttackBonus` 与上述能力回退去重，避免重复叠加造成双倍伤害。
- 已完成：重炮 Q 形态切换（`walk/stay/Q_learn/sweet_soup`）中的攻击加成从 `SetUnitState(0x13)` 改为统一 `applyUnitBonus(attr=3)`，与刀客二技能、炼药师四技能保持同一绿字加成通道。

署名：**copilot**

## 最新进展（2026-04-16：测试靶场改为无攻击靶子）

- 已完成：`mapInit.ts` 的测试投放由“敌对靶场单位（会反击）”调整为“敌对无攻击靶子”。
- 已调整：不再投放 `n000/n003/n005/n006/n007/n009`，改为投放 `e004/e00B` 靶子，避免 Boss 在测试场被围攻击杀。
- 已调整：测试提示文本同步更新为“已额外布置敌对无攻击靶子”。

署名：**copilot**

## 最新进展（难度确认后卡死修复）

- 已完成：定位“选完难度后卡死”的根因为 `src/migration/flow/nightCome.ts` 中 `syncNightAura()` 的循环控制问题：
  - 对同一个 `affectedGroup` 执行“取首个 -> 移除 -> 再加回同组”，在命中单位持续存在时会形成无法结束的循环。
- 已完成：将逻辑改为“两段式处理”：
  - 先把 `affectedGroup` 全量转移到临时组；
  - 再从临时组按条件回写到 `affectedGroup` 或移除夜晚加成；
  - 最后销毁临时组句柄。
- 已完成：本轮 `npm run build:dev --silent && npm test --silent` 通过。

## 最新进展（2026-04-16：雇佣兵/Boss 新一轮实测问题修复）

- 已完成：`src/migration/combat/showDa.ts`
  - 移除会心飘字节流，改为**每次会心都显示“会心”**，修复“伤害变高但偶发无会心字样”。
  - 接入 `getFallbackAttackBonus`，当缺少 YDWE bonus 系统时，普攻伤害仍能吃到 attr=3 攻击加成。

- 已完成：`src/migration/core/helpers.ts`
  - `applyUnitBonus` 增加 attr=3 本地 fallback（按单位记录攻击加成）。
  - 新增 `getFallbackAttackBonus()` 供伤害结算层读取。

- 已完成：`src/migration/combat/bladeAndWave.ts`
  - 修复 `A063`（一斩千击）扇形判定角度计算方向错误，恢复前方扇区命中。
  - `A067`（锋芒渐盛）普攻判定改为优先读取 `EXGetEventDamageData(IS_ATTACK)`，降低“平A不叠层/不锁定”的误判。
  - `A065` 期间补充攻击加成浮字（`+X攻`）以便观察叠加。

- 已完成：`src/migration/combat/arcaneMagic.ts`
  - `A06N` 被动改为仅在**魔法伤害类型**触发（`DAMAGE_TYPE_MAGIC` 或 `ATTACK_TYPE_MAGIC`），移除普攻误触发路径。
  - `A06S` 补充 `StarfallCaster` 视觉，增强“星落”可见性。

- 已完成：`src/migration/combat/alchemySpells.ts`
  - `A071` 倒计时改为大号红字（可读性修复）。
  - `A073` 开启/结束时增加攻击加成变化提示（`+X攻/-X攻`）用于校验。

- 已完成：`src/migration/combat/shadowKnife.ts`
  - `shadow_return` 吸收特效对齐原触发器：移除额外 `SpellShieldCaster`，保留吸收文本与回蓝分支 `SpiritLinkTarget`。

- 已完成：`src/migration/combat/spellBursts.ts`
  - `A07R` 改为原生抛物线脚本跳跃（含飞高变化），不再依赖 `YDWEJumpTimer`，修复“像走过去”的观感。

- 已完成：`src/migration/items/sinSystems.ts`
  - 罪人出生后增加 0.25s 兜底校验：若 `A053` 或 `I023/I02T` 丢失则自动补发，解决“无技能/无小刀”的初始化丢失问题。

- 构建验证：
  - `npm run build:dev`：**TS->Lua 编译通过**。
  - 后续 `w3x2lni` 打包阶段在当前沙箱环境触发 `EPERM (spawnSync C:\WINDOWS\system32\cmd.exe)`，属于环境权限限制，不是脚本编译错误。

署名：**codex**

## 最新进展（2026-04-16：Boss 技能文本描述全面校正）

- 已完成：`maps/table/ability.ini` 中 Boss 技能文本统一校正（`Tip/Ubertip`），并将描述与当前触发器实现保持一致。
- 已覆盖技能（主线阶段 Boss）：
  - 灵魂收集者：`A074`、`A076`、`A078`
  - 千年狮王：`A07E`、`A07F`、`A07G`、`A07I`
  - 燃烬射手：`A07J`、`A07K`、`A07L`
  - 巨型史莱姆：`A07P`、`A07Q`、`A07R`
  - 海神：`A07S`、`A07T`、`A07U`、`A07V`
- 日成将军：`A08T`、`A08U`
  - 魔法破坏机：`A08X`、`A08Y`、`A08Z`、`A091`
  - 野外鳄鱼：`A09M`、`A09Q`、`A09R`、`A09S`、`A09T`
- 已覆盖技能（最终战相关 Boss 自定义技能）：
  - `A016`、`A017`、`A018`、`A04L`、`A04M`、`A04N`
- 额外修正：
  - 部分 Boss 技能对象的 `EditorSuffix` 补全为 `（boss）`，避免编辑器侧显示残缺。

署名：**codex**

## 最新进展（2026-04-16：Boss 原生技能文本主体改为名称显示）

- 已完成：补齐 Boss 使用的原生技能文本覆盖，统一改为“Boss 名称 + 技能名”，不再显示默认原生标题。
- 已更新技能主体（按 Boss 名称）：
  - 千年狮王：狮王会心
  - 爱洗澡的小鳄鱼：游鳞闪避
  - 小小：山岳体魄、首领威压
  - 死骑士：亡者统御
  - 死亡凋零：首领被动 I、首领被动 II
- 已完成：上述技能 `Name/Tip/Ubertip/EditorSuffix` 全部写入 `maps/table/ability.ini`。

署名：**codex**

## 最新进展（2026-04-16：鳄鱼撞击冲刺回归）

- 已完成：`src/migration/combat/crocodile.ts` 的 `Crocodile_skill1` 回正为“3 秒读条 → 冲刺 → 0.4 秒后判定伤害”。
- 已完成：优先使用 `YDWEJumpTimer` 执行 `0.30s` 冲刺；当运行环境缺失该接口时，自动回退为脚本线性冲刺，保证位移表现存在。
- 已完成：伤害结算改为仅在冲刺后与目标距离 `<= 150` 时触发，不再读条结束瞬间命中。
- 已完成：恢复撞击命中血效，并保留读条阶段目标标记特效的尺寸变化。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-17：野外Boss掉落集中投放 + 仅编译打包）

- 已完成：`src/migration/flow/mapInit.ts`
  - 在测试沙箱开关开启时，将野外 Boss 关键掉落装备集中投放到传送锚点附近，便于直接回归：
    - 毁坏鳄铠（鳄鱼）
    - 伪物（元蜃）
    - 时间腐蚀之盾（亡心林夕之王）
  - 投放采用锚点周围小环形分布，避免物品重叠。
- 已确认：测试模式默认开启（`setGlobal("udg_enable_migration_test_content", 1)`），进图即可看到测试投放。
- 已完成：执行 `npm run build --silent` 重新生成地图包（仅编译打包，不启动 War3）。

## 最新进展（2026-04-16：测试场改为仅装备+材料）

- 已完成：`src/migration/flow/mapInit.ts` 移除开局测试单位投放（不再刷 Boss、雇佣兵、靶子）。
- 已完成：保留原有地面装备投放（升级宝石、九大基础装备、左侧全链装备陈列）。
- 已完成：新增“关键合成材料”地面投放环，覆盖宝石/分支材料/代币等常用材料，便于纯合成测试。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-16：测试沙箱改为显式开关）

- 已完成：`src/migration/flow/mapInit.ts` 的 `isInitTestSandboxEnabled()` 改为仅读取 `udg_enable_migration_test_content`。
- 已完成：移除代码级默认开启常量，避免未开开关时仍投放测试资源导致正式局污染。
- 已完成：兼容开关值为 `boolean true` 或 `1` 两种显式开启形式。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-16：迁移总览审计与双刷防护）

- 已完成：复核迁移入口顺序。`war3map.j` 先初始化 YDWE/JASS 库，再执行 Lua bootstrap，随后才运行原初始化触发器，因此 TS 迁移有机会在原初始化触发器执行前替换同名触发器。
- 已完成：静态检查 `src/migration` 中显式接管的触发器，结果为 `disableLegacyTrigger=174`、`replaceGlobalTrigger=174`，没有发现“替换了但未禁用”的同名触发器遗漏。
- 已完成：确认测试沙箱仍为显式开关模式，正式局不会默认投放测试装备、材料、单位或 Boss。
- 已完成：`src/migration/flow/nobodyInit.ts` 增加动态野怪初始化幂等标记 `udg_migration_nobody_init_done`，防止初始化触发器异常重复执行时野怪双刷。
- 已完成：`src/migration/flow/waveBossControl.ts` 增加进攻波次执行锁 `udg_migration_enemy_wave_active`，并在新建进攻倒计时前销毁旧倒计时面板，避免同一波敌军或倒计时窗口重复出现。
- 已完成：`src/migration/systems/debugCommands.ts` 与 `src/migration/systems/debugBoss.ts` 将会改动流程/刷怪/改时间的测试命令统一挂到 `udg_enable_migration_test_content` 开关后；只保留昼夜状态查询类命令默认可用。
- 已完成：`src/migration/items/artificialSun.ts` 的使用/结束提示改回原触发器口径，只提示道具拥有者，不再广播给所有玩家。
- 已完成：`src/migration/systems/playerRespawn.ts` 移除自建游戏时间计时器兜底，复活时间只读取原图 `YDWEGetGameTime___t` / `YDWEGetGameTime`，避免中后期复活时间被低估。
- 已完成：`src/migration/combat/showDa.ts` 移除“补血/二次伤害”近似改写伤害兜底，核心伤害修正只走 `EXSetEventDamage` / `BlzSetEventDamage` 的同事件写回，避免死亡、吸血、on-damage 链路被触发两次。
- 已完成：`src/migration/flow/dayNightConfig.ts` 移除未使用的旧昼夜流速换算函数，保留当前固定真实计时器跳变流程：一整天 240 秒，晨曦夜晚 80 秒、暮色夜晚 160 秒、极夜夜晚 210 秒。
- 构建验证：本轮尝试 `yarn build:dev` 失败，因为当前 shell 找不到 `yarn`；尝试 `corepack yarn build:dev` 在沙箱下因 `C:\Users\42432` 访问权限报 `EPERM`，申请提权后审批超时，未继续绕过验证。

署名：**codex**

## 最新进展（2026-04-16：人造太阳提示改为全员可见）

- 已完成：`src/migration/items/artificialSun.ts` 的人造太阳生效提示改为广播给所有玩家。
- 已完成：提示文本加入使用者信息，格式为“雇佣兵【单位名】使用了【人造太阳】”，不再显示玩家名称。
- 已完成：人造太阳结束提示同样广播给所有玩家，文本简化为“【人造太阳】的光芒消散了。”。
- 已完成：新增人造太阳全员可见倒计时窗口，标题为“人造太阳光芒消散还有”，用于确认光芒何时结束。
- 保留：无法使用时的失败提示仍只发给尝试使用者，避免无效操作打扰其他玩家。

署名：**codex**

## 待确认问题点（留给 Copilot 后续处理）

- Boss AI：当前灵魂收集者与主线分支 Boss 使用“出场后原生计时器轮询概率施法”，不是原触发器的 `YDWEAddAIOrder` 事件驱动施法。该方案是为了减少 YDWE 依赖，但施法频率、目标选择和被攻击/进范围触发时机可能与原图不完全一致。
- 伤害写回：`show_da` 已改为只走同事件伤害写回，但资源采集点与罪人部分技能仍保留“无事件伤害写回接口时用生命修正近似”的兜底。若目标是严格等价原图，应继续改成只使用同事件伤害写回。
- 调试命令：会改流程、刷怪、改时间、直接通关的测试命令当前被 `udg_enable_migration_test_content` 开关拦住。这比原测试触发器更安全，但如果后续测试流程要求随时可用，需要重新确认。
- 防双刷锁：动态野怪初始化和敌军进攻波次加入了幂等/执行锁。这是迁移稳定性保护，不是原触发器行为；如后续发现热重载或特殊测试流程需要重复执行，需要额外提供显式重置入口。

署名：**codex**

## 最新进展（2026-04-19：联机复活修复与防分车）

- 已完成：`src/migration/systems/playerRespawn.ts` 复活流程改为“每个槽位复用同一个计时器”，避免同一玩家多次死亡时出现多个复活计时器并发导致复活逻辑不触发或乱序。
- 已完成：复活回调优先使用迁移层本地保存的“待复活单位句柄”，避免 `udg_diedhero[x]` 被其他逻辑覆盖后导致倒计时结束却找不到要复活的单位。
- 已完成：移除复活计时依赖的 `throw Error`，缺少 `YDWEGetGameTime___t` 时回退到本地计时器并仅打印一次警告，避免联机时某端脚本中断触发“分车/世界线分叉”。
- 已完成：清理迁移层剩余 `throw new Error`（灵魂收集者与 debug 触发器），统一改为 `print + return`，降低联机脚本中断导致的分车风险。

署名：**codex**

## 最新进展（2026-04-19：-ms/-as/-at 雇佣兵数据兜底）

- 已完成：`src/migration/items/helmetAndTech.ts` 的 `-ms/-as/-at` 查询不再只依赖 `udg_diedhero[playerId+1]`。
- 已完成：查询口径回归原图，不再强制要求单位必须带 `UNIT_TYPE_HERO`（原图允许 `udg_diedhero` 绑定到非 Hero 类型的雇佣兵单位）。
- 已完成：当 `udg_diedhero` 缺失/未赋值时，改为从 `udg_hero_select` 组里按归属查找；并用 `ForGroup` 安全遍历，避免极端情况下因“旋转组遍历”导致死循环。
- 已完成：若仍缺失，则枚举该玩家存活单位兜底绑定，避免指令直接报“未找到当前玩家雇佣兵数据”。

署名：**codex**

## 最新进展（2026-04-19：-ms/-as/-at 缺少数据时输出调试信息）

- 已完成：当 `-ms/-as/-at` 仍无法定位到雇佣兵时，额外输出一条调试信息，包含：
  - 触发玩家 pid；
  - `udg_diedhero[pid+1]` 当前绑定到的单位名与 ownerPid；
  - `udg_hero_select` 中归属于该玩家的单位数量；
  - 该玩家当前存活单位数量（用于判断是否真的无单位/走错玩家槽位）。
- 用途：快速判断是“地图未更新/仍在跑旧包”，还是“选择触发器没有写入 diedhero/hero_select”，还是“玩家槽位不在 1~4 导致其他系统未初始化”。

署名：**codex**

## 最新进展（2026-04-20：移除模板 UnitBlood 血条 UI，降低分车风险）

- 已完成：移除 `UnitBlood` 血条 UI 系统（该功能非原图迁移内容）。
  - 删除：`src/system/ui/component/UnitBlood.ts`
  - 清理引用：`src/main.ts`、`src/system/actor.ts`、`src/utils/CameraControl.ts`、`src/test/HeroUnitSkillTestExample.ts`
- 原因：UI 创建/回调异常在不同客户端触发时机可能不一致，Lua 错误会导致某端脚本中断，进而出现“选英雄后分车/队友看不到物品”。

署名：**codex**

## 最新进展（2026-04-20：默认关闭开局测试投放）

- 已完成：`src/migration/flow/mapInit.ts` 在 `init` 内显式将 `udg_enable_migration_test_content` 设为 `0`（确保默认关闭）。
- 结果：默认不会在开局锚点旁投放测试装备/材料；只有你显式把 `udg_enable_migration_test_content` 设为 `true/1` 才会执行测试投放与任务资源预置。

署名：**codex**

## 最新进展（2026-04-16：Boss AI 事件驱动回归 + 伤害改写收口）

- 已完成：`src/migration/flow/bossBranches.ts`
  - 将 Boss AI 从“每秒轮询概率施法”改回“事件驱动概率施法”语义；
  - AI 事件源改为 `EVENT_UNIT_TARGET_IN_RANGE`（与原图 `YDWEAddAIOrder` 首次注册 `N=1` 一致）；
  - 保留原概率桶与 `orderType(1/2/3/4)` 下发逻辑，仅移除轮询目标选取路径；
  - Boss 死亡时销毁 AI 事件触发器，避免重复挂载。
- 已完成：`src/migration/combat/soulCollector.ts`
  - 灵魂收集者 AI 同步改回事件驱动施法，不再使用 1 秒轮询定时器；
  - 维持原 5 秒主循环（进攻命令/抽蓝/死亡结算）不变。
- 已完成：`src/migration/objectives/showResource.ts`
  - 移除“无 JAPI 时用回补生命近似伤害改写”兜底；
  - 资源点伤害仅允许事件内 `EXSetEventDamage/BlzSetEventDamage` 写回，缺失时仅告警并跳过。
- 已完成：`src/migration/combat/shadowKnife.ts`
  - `shadow_return` 受伤改写同样移除生命修正兜底；
  - 统一为“只做事件内伤害写回，缺失则一次性告警”。
- 保留不变：
  - 测试命令开关门控（`udg_enable_migration_test_content`）；
  - 野怪初始化/波次执行防重复锁。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-17：刀客攻速泄漏与属性查询指令修复）

- 已完成：`src/migration/combat/bladeAndWave.ts`
  - 修复刀客 `A067`（锋芒渐盛）在目标被秒杀场景下的攻速泄漏：
  - 原逻辑会在“目标死亡”分支无条件扣除满层攻速奖励，导致未激活满层时也持续减速；
  - 现改为仅当 `SHARPENING_ACTIVE_KEY=true`（确实处于满层加速态）时才回收该攻速加成。
- 已完成：`src/migration/items/helmetAndTech.ts`
  - 修复 `-ms/-as/-at` 查询英雄时偶发“无数据/无输出”问题；
  - 读取顺序改为：`udg_diedhero[玩家+1]` -> `udg_diedhero[玩家]` -> `udg_hero_select` 中按玩家归属兜底查找英雄。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-17：任务流程测试资源预置）

- 已完成：`src/migration/flow/mapInit.ts`
  - 在测试沙箱开关开启时，额外投放任务链关键道具：`完整绿宝石`、`孟婆汤`。
  - 新增任务资源预置：直接将 `udg_tree_num` 设为 `30`、`udg_stone_num` 设为 `20`，满足“穿云之信”建塔提交门槛。
  - 保持开关门控不变：仅当 `udg_enable_migration_test_content=true/1` 时生效，不污染正式局。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-17：实测回归批量修复）

- 已完成：`src/migration/objectives/taskQuestChains.ts`
  - 任务面板创建改为原生 Quest API（不再依赖 `bj_QUESTTYPE_*` 全局名映射），修复“任务页仅有标题无条目”问题。
  - 使用高塔建造指令时新增全员广播，并对建造点做小地图 ping + 感叹号特效标记，提示全队守护建造进程。
  - `not_forget_me` 在临界层数时补回原触发器语义：调用 `EXSetItemDataString('I03E',4,'愿忘')` 动态改名。
- 已完成：`src/migration/items/helmetAndTech.ts`、`src/migration/heroes/selectHeroes.ts`、`src/migration/items/sinSystems.ts`、`src/migration/systems/playerRespawn.ts`
  - `udg_diedhero` / `udg_diedhero_cnt_window` 访问改为原生 1-based 映射（`Record<number,...>`），修复不同雇佣兵在 `-ms/-as/-at` 下偶发“未找到雇佣兵数据”。
- 已完成：`src/migration/combat/soulCollector.ts`、`src/migration/flow/bossBranches.ts`
  - Boss 出场后生命值强制回满，修复“灵魂收集者出场半血”。
  - Boss 击败后推进 `udg_enemywaveCount`，修复“Boss 前后波次标题重复”。
- 已完成：`maps/table/item.ini`
  - 修复 `I03E（勿忘我）` 描述被截断（末尾 `|cf`）与文案异常。
  - 将 `I03D（伪物）`、`I034（毁坏鳄铠）` 的“主动使用摧毁”提示改为红色高可见。
  - 重写 `I034` 词条式描述，统一与伪物同档文案风格。
- 已完成：`maps/table/ability.ini`
  - `A09B（时间光环）` 图标改为 `BTNIceShard.blp`，与“时间腐蚀之盾”图标一致。
- 已完成：`src/migration/objectives/mission.ts`
  - 胜利结算改为对 1~4 号玩家逐一触发 `CustomVictoryBJ`，提高最终通关页触发稳定性。
- 已完成：`src/migration/combat/skillMorphs.ts`
  - `concealed_weapon` 触发对象收紧为 `gg_unit_U00D_0259`（海神本体）且需携带 `I02L`，排除同类型非目标首领误触发“暗器精灵”。
- 已完成：本轮 `npm test --silent` 通过并已拉起测试地图。

## 最新进展（2026-04-18：英雄不复活修复）

- 已完成：`src/migration/systems/playerRespawn.ts`
  - 复活链路改为“死亡触发器内直接启动定时器回调复活”，不再依赖 `TriggerRegisterTimerExpireEvent` 路径。
  - 统一按槽位管理复活倒计时面板，避免倒计时界面残留或句柄错位。
  - 保持 `udg_diedhero` 的 1-based 写入口径，确保聊天查询与复活目标一致。
  - 旧 `p1~p4` 复活遗留触发器仍被接管（占位替换），避免双执行。
- 已完成：执行 `npm run build:dev --silent` 重新构建并打包成功。

## 最新进展（2026-04-18：联机死亡状态分歧修复 + 体积精简）

- 已完成：`src/migration/systems/playerRespawn.ts`
  - 死亡判定从“是否在 `udg_hero_select` 组内”收紧为“是否等于 `udg_diedhero[槽位]`”，避免组状态漂移导致个别客户端误判。
  - 每次死亡改为创建独立的一次性复活计时器，计时结束直接按槽位执行复活；不再依赖共享 `udg_p1~p4_timer` 触发路径。
  - 继续占位接管 `p1~p4` 遗留复活触发器，避免遗留与 TS 双链路并发。

- 已完成：资源精简（不影响当前功能路径）
  - 删除测试残留：`maps/resource/test1_spritesheet.tga`（16MB）、`maps/resource/test1.mdl`。
  - 删除重复字体副本：`maps/resource/Texture/ui/hpbar/ZiTi.TTf`（保留 `maps/map/resource/...` 运行时副本）。

- 已完成：重新生产打包 `npm run build --silent`
  - `dist/map.w3x` 体积从 **14.43MB** 降至 **11.31MB**。

## 最新进展（2026-04-18：联机同步 root-cause 收口）

- 已完成：去除迁移层“非 UI 逻辑”里的 `GetLocalPlayer()` 分支，统一改为确定性广播（1~4 号玩家）：
  - `src/migration/objectives/mission.ts`
  - `src/migration/flow/bossBranches.ts`
  - `src/migration/combat/soulCollector.ts`
  - `src/migration/flow/finalBattleAndRebirth.ts`
  - `src/migration/flow/difficulty.ts`
  - `src/migration/flow/mapInit.ts`
  - `src/migration/combat/lightingEvents.ts`
  - `src/migration/combat/neutralDeaths.ts`
  - `src/migration/combat/waterWindReinforcements.ts`
  - `src/migration/combat/tombsDestroy.ts`
  - `src/migration/objectives/taskQuestChains.ts`

- 已完成：`mission_fail` 失败结算改为对 1~4 号玩家逐一调用 `CustomDefeatBJ`，不再向 `GetLocalPlayer()` 单点失败，避免联机分叉。

- 已完成：新增公共广播辅助（`src/migration/core/helpers.ts`）：
  - `displayTextToMercenaryPlayers`
  - `displayTimedTextToMercenaryPlayers`

- 已完成：本轮再次执行 `npm run build:dev --silent` 与 `npm test --silent`，构建与测试流程通过。

## 最新进展（2026-04-18：雇佣兵死亡不复活回归修复）

- 已完成：`src/migration/systems/playerRespawn.ts`
  - `p1~p4` 死亡条件恢复为原图语义：`IsUnitInGroup(GetTriggerUnit(), udg_hero_select)`。
  - 移除“必须等于 `udg_diedhero[槽位]` 才触发”的过窄判定，修复死亡后不进入复活链路的问题。
  - 保留“每次死亡独立一次性复活 timer + 槽位倒计时面板”的当前 TS 执行链。

- 已完成：本轮再次执行 `npm run build:dev --silent && npm test --silent`，构建与测试流程通过。

## 最新进展（2026-04-18：复活倒计时结束无效果修复）

- 已完成：`src/migration/systems/playerRespawn.ts`
  - `reviveHeroBySlot` 去掉“生命值阈值提前 return”判断，复活回调按原图语义直接执行 `ReviveHeroLoc`。
  - 复活关键全局改为显式检查并输出错误（`udg_diedhero` / `gg_rct_____________u`），避免回调静默失败。
  - 保留并复用现有倒计时面板清理、镜头回拉与复活提示文本链路。

- 已完成：本轮再次执行 `npm run build:dev --silent && npm test --silent`，构建与测试流程通过。
