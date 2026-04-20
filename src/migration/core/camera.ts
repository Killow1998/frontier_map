import { getGlobal } from "./helpers"

export const CAMERA_PAN_DURATION_SECONDS = 1.0

/**
 * 仅对本地玩家执行镜头平移，避免网络同步风险。
 */
export function panCameraToPointForPlayer(whichPlayer: player, targetX: number, targetY: number): void {
  if (GetLocalPlayer() !== whichPlayer) {
    return
  }
  PanCameraToTimed(targetX, targetY, CAMERA_PAN_DURATION_SECONDS)
}

/**
 * 将镜头平移到矩形中心。
 */
export function panCameraToRectCenterForPlayer(whichPlayer: player, whereRect: rect): void {
  panCameraToPointForPlayer(whichPlayer, GetRectCenterX(whereRect), GetRectCenterY(whereRect))
}

/**
 * 将镜头平移到传送锚点（找不到锚点时回退基地中心）。
 */
export function panCameraToBaseForPlayer(whichPlayer: player): void {
  const anchorUnit = getGlobal<unit>("gg_unit_n001_0012")
  if (anchorUnit) {
    panCameraToPointForPlayer(whichPlayer, GetUnitX(anchorUnit), GetUnitY(anchorUnit))
    return
  }

  const baseArea = getGlobal<rect>("gg_rct_base_area")
  if (!baseArea) {
    return
  }
  panCameraToRectCenterForPlayer(whichPlayer, baseArea)
}
