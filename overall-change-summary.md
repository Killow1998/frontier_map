# 当前工程整体改动总结（截至 2026-04-14）

## 1. 迁移基线与工程现状

- 地图基线文件：`maps/map/war3map.j`。
- 触发器规模：`InitTrig_*` 总计 **229** 个（当前 war3map.j 实际计数）。
- TS 迁移代码：`src/migration/` 下已形成 **74** 个模块化脚本文件（按 flow/combat/items/objectives/systems 等拆分）。
- 启动接线：
  - `src/main.ts` 已接入 `runTriggerMigrations()`；
  - 同时调用 `takeOverRemainingLegacyTriggers()` 做遗留触发器接管兜底。

---

## 2. 核心系统改动（TS 迁移主线）

### 2.1 触发器接管与全局访问修复

- `src/migration/core/helpers.ts`
  - 增强 `getGlobal/setGlobal/disableLegacyTrigger/replaceGlobalTrigger`，支持 `_G` + `jass.globals` 双通道访问。
  - 修复 `gg_trg_* / udg_* / gg_unit_*` 在 TS 侧读写不稳定导致的接管遗漏问题。
- `src/migration/core/takeover.ts`
  - 接管扫描逻辑兼容双来源，减少漏接管触发器。

### 2.2 昼夜流程与难度联动

- `src/migration/flow/dayCome.ts`、`nightCome.ts`、`difficulty.ts`、`timeOfDayFlow.ts`
  - 修复首夜倒计时难度不生效问题（80/160/210 秒按难度重建）。
  - 重构白天/夜晚阶段状态收敛与面板恢复逻辑，降低“阶段已激活但计时窗口缺失”的异常。
- `src/migration/core/helpers.ts`
  - `isDayTimeFromHashtable()` 改为直接按游戏时间判断，不再依赖哈希自定义值。

### 2.3 镜头与引导一致化

- `src/migration/core/camera.ts` 新增统一镜头辅助。
- `src/migration/flow/mapInit.ts`、`heroes/selectHeroes.ts`、`systems/playerRespawn.ts`
  - 统一关键镜头平移表现（含本地玩家处理分支）。
  - 开局自动选中引导单位（小动物）逻辑补齐，提升选人流程可达性。

### 2.4 战斗伤害归属与脚本化

- `src/migration/combat/spellBursts.ts`、`bladeAndWave.ts`、`showDa.ts`、`waterWindReinforcements.ts` 等
  - 将多处“马甲承担伤害”改为“马甲仅表现、伤害由施法者本体脚本结算”。
  - 精简/移除伤害代理回滚链路，统一命中与伤害归属。
  - 会心飘字与部分技能判定链（如冰盾护体）做了可见性与一致性修正。

---

## 3. 装备体系与文案重构（重点）

主改动集中在 `maps/table/item.ini`，已按“分层 + 多色 + 分支可读”体系重写，并多轮压缩以适配 War3 tooltip 空间。

### 3.1 已系统化改造的装备链

- 剑系（含穿梭/陨星链）
- 盾系
- 甲系
- 斧系
- 战旗系
- 弓系
- 盔系
- 戒指系
- 魔法书系
- 法杖系
- 罪人系（小刀 lv1~lv7、罪孽护身符、罪孽之骨、秽影）

### 3.2 文案规则与显示处理

- 统一结构：风味句 → 属性块 → 词条块 → 分支/升级提示。
- 分支材料与产物统一高亮，四级分支写法规范化。
- 高风险长文本条目（尤其小刀高阶）改为紧凑句式，减少自动折行导致的截断。
- 最新一轮已回补：小刀全链“浅色风味句”与“属性块”之间的空行层次。

### 3.3 地图内查阅投放

- `src/migration/flow/mapInit.ts`
  - 新增并扩展 `POLISHED_EQUIPMENT_ROWS`；
  - 在传送锚点左侧按“每行一系”投放已优化装备，便于进图直查；
  - 同步保留升级宝石/基础装备测试投放。

---

## 4. 其他关键改动

- `src/config/index.ts`、`src/ydlua/index.ts`
  - 默认关闭运行时调试输出（仅在显式开启时输出）。
- `src/main.ts`
  - 默认关闭 FPS 显示（`DzToggleFPS(false)`）。
- `src/config/Map.ts`
  - 视觉初始化改回启用迷雾/黑幕，恢复地图开局预期表现。

---

## 5. 验证与构建状态

- 已多轮执行并通过：
  - `npm run build:dev --silent`
  - `npm test --silent`
- 目前主要剩余为既有 TSTL warning（Lua 真值语义提示），非本轮新增阻断错误。

---

## 6. 当前结论

- 工程已从“散落 Jass 触发”推进为“TS 模块化迁移 + 统一接线 + 遗留接管兜底”的可持续状态。
- 装备文案体系已完成大规模重构并具备地图内可视化核对路径。
- 仍需继续逐批把遗留触发彻底替换为纯 TS（最终可移除兜底接管链）。
