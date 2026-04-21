# 任务规划：Jass to TS 迁移与地图更新代码审查

## 目标声明
根据 `work-progress-daynight-and-crafting.md` 的记录，对魔兽争霸3地图的 Jass to TS 迁移工作进行系统性代码审查，确保功能逻辑回正、代码质量可靠、无联机分车风险，并验证新增功能的实现。

## 阶段跟踪
| 阶段 | 任务 | 状态 | 预期结果 |
|------|------|------|----------|
| 1 | 核心架构与全局变量审查 | `complete` | 验证 `jass.globals` 映射、受伤总线、`takeover` 机制的正确性。 |
| 2 | 战斗系统与伤害归属审查 | `complete` | 审查马甲伤害脚本化、会心判定链、技能伤害类型统一等逻辑。 |
| 3 | 流程控制与昼夜系统审查 | `complete` | 验证昼夜切换、倒计时显示、难度确认、Boss AI 事件驱动等流程。 |
| 4 | 物品与合成系统审查 | `complete` | 审查装备描述美化、智力联动、人造太阳逻辑及关键道具功能。 |
| 5 | 系统稳定性与联机同步审查 | `complete` | 检查 `GetLocalPlayer` 使用、复活系统、防双刷锁等联机安全项。 |
| 6 | 验证与总结 | `complete` | 汇总审查发现，提出改进建议，完成审查报告。 |

## 关键文件 (审查重点)
- `src/migration/core/helpers.ts` (核心辅助与全局映射)
- `src/migration/core/takeover.ts` (触发器接管)
- `src/migration/combat/` (所有战斗逻辑)
- `src/migration/flow/` (昼夜、初始化、Boss流程)
- `src/migration/items/` (装备、合成、特殊道具)
- `src/migration/systems/playerRespawn.ts` (复活系统)

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 无 | 0 | - |
