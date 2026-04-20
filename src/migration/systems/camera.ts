import { bj_MAX_PLAYER_SLOTS, CAMERA_FIELD_TARGET_DISTANCE } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, replaceGlobalTrigger } from "../core/helpers"

const CAMERA_STEP = 100.0
const CAMERA_TRANSITION = 0.3

/**
 * 注册聊天缩放触发器：
 * ++ 拉近，-- 拉远（仅触发玩家本地相机生效）。
 */
function registerChatCameraTrigger(command: string, delta: number): trigger {
  const triggerHandle = CreateTrigger()
  for (let index = 0; index < bj_MAX_PLAYER_SLOTS; index++) {
    TriggerRegisterPlayerChatEvent(triggerHandle, Player(index), command, true)
  }
  TriggerAddAction(triggerHandle, () => {
    if (GetLocalPlayer() === GetTriggerPlayer()) {
      const cameraField = CAMERA_FIELD_TARGET_DISTANCE()
      const currentDistance = GetCameraField(cameraField)
      SetCameraField(cameraField, currentDistance + delta, CAMERA_TRANSITION)
    }
  })
  return triggerHandle
}

/**
 * 入口：迁移镜头距离调节触发器。
 */
export function migrateCameraChatTriggers(): void {
  disableLegacyTrigger("gg_trg_camera_sub")
  disableLegacyTrigger("gg_trg_camera_add")
  const subTrigger = registerChatCameraTrigger("++", CAMERA_STEP)
  const addTrigger = registerChatCameraTrigger("--", -CAMERA_STEP)
  replaceGlobalTrigger("gg_trg_camera_sub", subTrigger)
  replaceGlobalTrigger("gg_trg_camera_add", addTrigger)
}
