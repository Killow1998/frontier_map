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
export function worldToScreen1(
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


/**
 * 世界坐标转屏幕坐标（基于 Antares 的 FastWorld2ScreenTransform，支持任意宽高比）
 * 
 * 在 worldToScreen 的基础上添加宽高比校正，确保在不同屏幕比例下都能正确工作
 * 
 * @param x 世界坐标 X
 * @param y 世界坐标 Y
 * @param z 世界坐标 Z（垂直高度）
 * @param options 可选的偏移配置
 * @returns 屏幕坐标 { screenX, screenY, onScreen }
 */
export function worldToScreen(
  x: number,
  y: number,
  z: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number, onScreen: boolean } {
  // 获取相机参数
  const eyeX = GetCameraEyePositionX();
  const eyeY = GetCameraEyePositionY();
  const eyeZ = GetCameraEyePositionZ();
  const angleOfAttack = GetCameraField(ConvertCameraField(2)); // CAMERA_FIELD_ANGLE_OF_ATTACK
  const rotation = GetCameraField(ConvertCameraField(5));      // CAMERA_FIELD_ROTATION
  const fieldOfView = GetCameraField(ConvertCameraField(3));   // CAMERA_FIELD_FIELD_OF_VIEW

  // 预计算三角函数
  const cosAttack = Math.cos(angleOfAttack);
  const sinAttack = Math.sin(angleOfAttack);
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  // 经验公式（Antares 校准）
  const yCenterScreenShift = 0.1284 * cosAttack;
  const scaleFactor = 0.0524 * fieldOfView * fieldOfView * fieldOfView
    - 0.0283 * fieldOfView * fieldOfView
    + 1.061 * fieldOfView;

  // 矩阵元素预计算
  const cosAttackCosRot = cosAttack * cosRot;
  const cosAttackSinRot = cosAttack * sinRot;
  const sinAttackCosRot = sinAttack * cosRot;
  const sinAttackSinRot = sinAttack * sinRot;

  // 世界坐标到相机的向量
  const dx = x - eyeX;
  const dy = y - eyeY;
  const dz = z - eyeZ;

  // 核心变换公式
  const xPrime = scaleFactor * (-cosAttackCosRot * dx - cosAttackSinRot * dy - sinAttack * dz);

  // 获取屏幕宽高比并计算校正因子
  const clientWidth = DzGetClientWidth();
  const clientHeight = DzGetClientHeight();
  let aspectRatio = 4.0 / 3.0; // 默认 4:3
  if (clientHeight > 0) {
    aspectRatio = clientWidth / clientHeight;
  }

  // 宽高比校正因子（相对于 4:3 基准）
  // 当 aspectRatio = 4/3 时，correction = 1.0（无变化）
  // 当 aspectRatio > 4/3（更宽）时，correction < 1.0（X 轴缩小）
  // 当 aspectRatio < 4/3（更窄）时，correction > 1.0（X 轴放大）
  const baseAspectRatio = 4.0 / 3.0;
  const aspectRatioCorrection = baseAspectRatio / aspectRatio;

  // X 轴应用宽高比校正，Y 轴保持不变
  const screenX = 0.4 + ((cosRot * dy - sinRot * dx) / xPrime) * aspectRatioCorrection;
  const screenY = 0.42625 - yCenterScreenShift + (sinAttackCosRot * dx + sinAttackSinRot * dy - cosAttack * dz) / xPrime;

  // 屏幕可见性判断（边界可能需要根据宽高比调整，但先保持原样）
  const onScreen = xPrime < 0 && screenX > -0.1333 && screenX < 0.9333 && screenY > 0 && screenY < 0.6;

  // 应用偏移量
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY, onScreen };
}

/**
 * 世界坐标转屏幕坐标（基于标准透视投影，使用 Antares 的校正因子）
 * 
 * 使用标准透视投影的框架，但应用 Antares 的经验公式以确保与 WC3 引擎行为一致
 * 
 * @param worldX 世界坐标 X
 * @param worldY 世界坐标 Y
 * @param worldZ 世界坐标 Z（垂直高度）
 * @param options 可选的偏移配置
 * @returns 屏幕坐标 { screenX, screenY }
 */
export function worldToScreen2(
  worldX: number,
  worldY: number,
  worldZ: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number } {

  // ============================================
  // 1. 获取相机参数（与 worldToScreen 一致）
  // ============================================
  const eyeX = GetCameraEyePositionX();
  const eyeY = GetCameraEyePositionY();
  const eyeZ = GetCameraEyePositionZ();
  const angleOfAttack = GetCameraField(ConvertCameraField(2)); // CAMERA_FIELD_ANGLE_OF_ATTACK
  const rotation = GetCameraField(ConvertCameraField(5));      // CAMERA_FIELD_ROTATION
  const fieldOfView = GetCameraField(ConvertCameraField(3));   // CAMERA_FIELD_FIELD_OF_VIEW

  // ============================================
  // 2. 预计算三角函数（与 worldToScreen 一致）
  // ============================================
  const cosAttack = Math.cos(angleOfAttack);
  const sinAttack = Math.sin(angleOfAttack);
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  // 矩阵元素预计算（与 worldToScreen 一致）
  const cosAttackCosRot = cosAttack * cosRot;
  const cosAttackSinRot = cosAttack * sinRot;
  const sinAttackCosRot = sinAttack * cosRot;
  const sinAttackSinRot = sinAttack * sinRot;

  // ============================================
  // 3. 计算世界点到相机的向量
  // ============================================
  const dx = worldX - eyeX;
  const dy = worldY - eyeY;
  const dz = worldZ - eyeZ;

  // ============================================
  // 4. 投影到相机坐标系（与 worldToScreen 完全一致）
  // ============================================
  // 使用与 worldToScreen 相同的投影方式
  // viewX = 右向量方向的投影（屏幕X方向）
  const viewX = cosRot * dy - sinRot * dx;

  // viewY = 上向量方向的投影（屏幕Y方向）
  const viewY = sinAttackCosRot * dx + sinAttackSinRot * dy - cosAttack * dz;

  // viewZ = 前向向量方向的投影（深度）
  const viewZ = -cosAttackCosRot * dx - cosAttackSinRot * dy - sinAttack * dz;

  // ============================================
  // 5. 透视投影（使用 Antares 的 scaleFactor）
  // ============================================

  // 如果点在相机后面，返回默认值
  if (viewZ <= 0) {
    return { screenX: 0, screenY: 0 };
  }

  // 使用 Antares 的经验公式（关键：替代标准的 tan(fov/2)）
  const yCenterScreenShift = 0.1284 * cosAttack;
  const scaleFactor = 0.0524 * fieldOfView * fieldOfView * fieldOfView
    - 0.0283 * fieldOfView * fieldOfView
    + 1.061 * fieldOfView;

  // 使用 scaleFactor 计算 xPrime（而不是 viewZ * tan(fov/2)）
  // 这是与标准透视投影的关键差异
  const xPrime = scaleFactor * viewZ;

  // ============================================
  // 6. 透视除法并映射到WC3屏幕坐标系
  // ============================================

  // 透视除法：直接除以 xPrime（与 worldToScreen 一致）
  const screenX = 0.4 + viewX / xPrime;
  const screenY = 0.42625 - yCenterScreenShift + viewY / xPrime;

  // 应用偏移量
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY };
}


/**
 * 世界坐标转屏幕坐标（基于 Antares 的 FastWorld2ScreenTransform）
 * 
 * @param x 世界坐标 X
 * @param y 世界坐标 Y
 * @param z 世界坐标 Z（垂直高度）
 * @param options 可选的偏移配置
 * @returns 屏幕坐标 { screenX, screenY, onScreen }
 */
export function worldToScreen3(
  x: number,
  y: number,
  z: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number, onScreen: boolean } {
  // 获取相机参数
  const eyeX = GetCameraEyePositionX();
  const eyeY = GetCameraEyePositionY();
  const eyeZ = GetCameraEyePositionZ();
  const angleOfAttack = GetCameraField(ConvertCameraField(2)); // CAMERA_FIELD_ANGLE_OF_ATTACK
  const rotation = GetCameraField(ConvertCameraField(5));      // CAMERA_FIELD_ROTATION
  const fieldOfView = GetCameraField(ConvertCameraField(3));   // CAMERA_FIELD_FIELD_OF_VIEW

  // 预计算三角函数
  const cosAttack = Math.cos(angleOfAttack);
  const sinAttack = Math.sin(angleOfAttack);
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  // 经验公式（Antares 校准）
  const yCenterScreenShift = 0.1284 * cosAttack;
  const scaleFactor = 0.0524 * fieldOfView * fieldOfView * fieldOfView
    - 0.0283 * fieldOfView * fieldOfView
    + 1.061 * fieldOfView;

  // 矩阵元素预计算
  const cosAttackCosRot = cosAttack * cosRot;
  const cosAttackSinRot = cosAttack * sinRot;
  const sinAttackCosRot = sinAttack * cosRot;
  const sinAttackSinRot = sinAttack * sinRot;

  // 世界坐标到相机的向量
  const dx = x - eyeX;
  const dy = y - eyeY;
  const dz = z - eyeZ;

  // 核心变换公式
  const xPrime = scaleFactor * (-cosAttackCosRot * dx - cosAttackSinRot * dy - sinAttack * dz);

  const screenX = 0.4 + (cosRot * dy - sinRot * dx) / xPrime;
  const screenY = 0.42625 - yCenterScreenShift + (sinAttackCosRot * dx + sinAttackSinRot * dy - cosAttack * dz) / xPrime;

  // 屏幕可见性判断
  const onScreen = xPrime < 0 && screenX > -0.1333 && screenX < 0.9333 && screenY > 0 && screenY < 0.6;

  // 应用偏移量
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY, onScreen };
}
