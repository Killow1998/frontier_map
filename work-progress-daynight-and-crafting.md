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

## 最新进展（2026-04-26：联机分车深度重构与同步净化）

### 1. 彻底解决“平行宇宙”级分车隐患
- **已修复：Handle ID 偏移（致命点）**
  - **TextTag 同步化 (showDa.ts)**：移除了在 `GetLocalPlayer()` 块中创建 `texttag` 的非法行为。现在所有伤害飘字均全服同步创建 Handle，仅通过修改 Alpha 透明度实现本地可见。这确保了各端的 Handle ID 计数器永远一致。
  - **全局 Handle 池化 (Handle Pooling)**：在 `helpers.ts` 中建立了预分配池，涵盖了 `SYNC_GROUP`、`SYNC_TIMER` 等。所有核心战斗逻辑（复仇、雷击、水盾、萤火披风）已全部移除 `CreateGroup()`，彻底根除了 ID 抢占风险。
- **已修复：RNG 随机数序列发散**
  - **采集系统稳固 (showResource.ts)**：移除了采集惊扰护卫时的随机坐标。护卫现在生成在采集点的固定偏移位置，且 Handle 创建全服对齐。
  - **Boss 死亡掉落加固**：Boss 死亡判定由 5 秒轮询改为毫秒级同步的 `EVENT_UNIT_DEATH`，确保随机掉落的时机和次数全服绝对重合。
  - **野怪复活加固 (neutralDeaths.ts)**：随机复活坐标的计算提前到野怪死亡的同步帧，切断了异步计时器内的 RNG 消耗。

### 2. 任务与流程逻辑加固
- **穿云之信（高塔任务）**：移除 1.0s 轮询，改为专家死亡事件驱动。开启 `SetUnitPathing(builder, false)`，确保专家位移轨迹在所有客户端完全一致。
- **最终战稳定性**：重构了胜利判定逻辑，使用池化句柄管理最终波次敌军，确保计数器全服同步。
- **注意**：已按要求移除“最终战 300s 强制胜利保底”，维持原有的硬核通关机制。

### 3. 装备系统与文案回正
- **文案 1:1 像素级回正**：修正了之前“文学化改写”导致的名称不匹配问题。已将合成线索文字还原为真实的装备名称（如“闪身剑”、“城墙”等），同时成功隐去了所有等级 (lvX) 后缀。
- **充能瓶修复**：`I03G` 已添加 `perishable = 1` 属性，现在使用完 9 次后物品会正常消失。

署名：**Gemini CLI**
