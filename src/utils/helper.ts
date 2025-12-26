// 基础的id转换 - 热更新测试
export function c2i(char: string) {
  return string.unpack(">I4", char)[0] as number
}

export function i2c(id: number) {
  return string.pack("I4", id)
}

export function FourCC(id: string) {
  return c2i(id)
}

/**
 * 将世界坐标转换为屏幕坐标 原生方法（不推荐使用，效率低下）
 * @param x 世界坐标 X
 * @param y 世界坐标 Y
 * @param z 世界坐标 Z
 * @param callback 转换完成后的回调函数
 */
export function worldToScreenNative(
  x: number,
  y: number,
  z: number,
  callback: (result: { screenX: number, screenY: number, screenZ: number }) => void
): void {
  DzConvertWorldPosition(x, y, z, () => {
    const screenX = DzGetConvertWorldPositionX();
    const screenY = DzGetConvertWorldPositionY();
    const screenZ = 0;
    callback({ screenX, screenY, screenZ });
  });
}


/**
 * 世界坐标转屏幕坐标的配置选项
 */
export interface WorldToScreenOptions {
  /** 屏幕 X 偏移量（0-1 范围） */
  offsetScreenX?: number;
  /** 屏幕 Y 偏移量（0-1 范围） */
  offsetScreenY?: number;
}

/**
 * 将世界坐标转换为屏幕坐标（带偏移量支持）
 * 
 * @param worldX 世界坐标 X（东西方向）
 * @param worldY 世界坐标 Y（南北方向，地面高度）
 * @param worldZ 世界坐标 Z（垂直高度，海拔）
 * @param options 可选的偏移配置
 * @returns 屏幕坐标 { screenX, screenY }，范围 0-1
 * 
 * @example
 * // 基本使用
 * const pos = worldToScreen(100, 200, 0);
 * 
 * // 带屏幕偏移
 * const pos = worldToScreen(100, 200, 0, { offsetScreenX: 0.1, offsetScreenY: 0.05 });
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  worldZ: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number } {
  // 获取相机位置（修正命名，使其符合直觉）
  const cameraEyeX = GetCameraEyePositionX();
  const cameraEyeY = GetCameraEyePositionY(); // Y 轴：南北方向
  const cameraEyeZ = GetCameraEyePositionZ(); // Z 轴：垂直高度
  
  const cameraTargetX = GetCameraTargetPositionX();
  const cameraTargetY = GetCameraTargetPositionY();
  const cameraTargetZ = GetCameraTargetPositionZ();

  // 计算相机朝向向量（从目标指向眼睛）
  let forwardX = cameraEyeX - cameraTargetX;
  let forwardY = cameraEyeY - cameraTargetY;
  let forwardZ = cameraEyeZ - cameraTargetZ;
  
  // 归一化朝向向量
  let forwardLength = Math.sqrt(forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ);
  if (forwardLength > 0) {
    forwardLength = 1.0 / forwardLength;
  } else {
    forwardLength = 1.0;
  }
  forwardX *= forwardLength;
  forwardY *= forwardLength;
  forwardZ *= forwardLength;

  // 计算右向量（相机上方向与朝向的叉积）
  const upX = 0;
  const upY = 1;
  const upZ = 0;
  
  let rightX = upY * forwardZ - upZ * forwardY;
  let rightY = upZ * forwardX - upX * forwardZ;
  let rightZ = upX * forwardY - upY * forwardX;
  
  // 归一化右向量
  let rightLength = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ);
  if (rightLength > 0) {
    rightLength = 1.0 / rightLength;
  } else {
    rightLength = 1.0;
  }
  rightX *= rightLength;
  rightY *= rightLength;
  rightZ *= rightLength;

  // 计算上向量（朝向与右向量的叉积）
  const upVecX = forwardY * rightZ - forwardZ * rightY;
  const upVecY = forwardZ * rightX - forwardX * rightZ;
  const upVecZ = forwardX * rightY - forwardY * rightX;

  // 计算视口宽高比
  const clientHeight = DzGetClientHeight();
  let aspectRatio = 1.0;
  if (clientHeight !== 0) {
    aspectRatio = DzGetClientWidth() / clientHeight * 600.0 / 800.0;
  }

  // 计算世界点到相机的向量
  const worldToEyeX = worldX - cameraEyeX;
  const worldToEyeY = worldY - cameraEyeY;
  const worldToEyeZ = worldZ - cameraEyeZ;

  // 计算深度（逆深度）
  let depth = -(forwardX * worldToEyeX + forwardY * worldToEyeY + forwardZ * worldToEyeZ);
  if (Math.abs(depth) !== 0) {
    depth = 1.0 / Math.abs(depth);
  } else {
    depth = 1.0;
  }

  if (aspectRatio === 0) {
    aspectRatio = 1.0;
  }

  // 计算屏幕坐标（NDC 坐标，范围 0-1）
  // 注意：反转X轴方向以匹配魔兽争霸3的坐标系统
  const screenX = 0.8 - ((2.00 / aspectRatio) * 
    (-rightX * worldToEyeX - rightY * worldToEyeY - rightZ * worldToEyeZ) * depth + 1.0) * 0.4;
  
  const screenY = (2.5613 * 
    (upVecX * worldToEyeX + upVecY * worldToEyeY + upVecZ * worldToEyeZ) * depth + 1.0) * 0.3;

  // 应用屏幕偏移
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY };
}
