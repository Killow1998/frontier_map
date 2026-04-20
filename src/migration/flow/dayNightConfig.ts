/**
 * 昼夜系统统一配置：
 * - 游戏内一整天（白天+黑夜）固定为 240 秒；
 * - 难度越高，夜晚越长；
 * - 通过固定真实计时器控制昼夜阶段，阶段结束后跳到 11.98 / 23.98 交给原生时间事件衔接。
 */

// 需求：固定 240 秒为一整天。
const TARGET_FULL_DAY_NIGHT_SECONDS = 240.0

function normalizeDifficulty(difficulty: number): number {
  if (difficulty === 2 || difficulty === 3) {
    return difficulty
  }
  return 1
}

/**
 * 按难度返回黑夜时长（秒），并保持“难度越高夜晚越长”。
 * 1=80，2=160，3=210。
 */
export function getNightDurationByDifficulty(difficulty: number): number {
  const level = normalizeDifficulty(difficulty)
  if (level === 2) {
    return 160.0
  }
  if (level === 3) {
    return 210.0
  }
  return 80.0
}

/**
 * 按难度返回白昼时长（秒）。
 * 与黑夜互补，保证白天+黑夜恒为 240 秒。
 */
export function getDayDurationByDifficulty(difficulty: number): number {
  return TARGET_FULL_DAY_NIGHT_SECONDS - getNightDurationByDifficulty(difficulty)
}

