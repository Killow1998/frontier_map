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
 * 世界坐标转屏幕坐标（基于 Antares 的 FastWorld2ScreenTransform）
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

  const screenX = 0.4 + (cosRot * dy - sinRot * dx) / xPrime;
  const screenY = 0.42625 - yCenterScreenShift + (sinAttackCosRot * dx + sinAttackSinRot * dy - cosAttack * dz) / xPrime;

  // 屏幕可见性判断
  const onScreen = xPrime < 0 && screenX > -0.1333 && screenX < 0.9333 && screenY > 0 && screenY < 0.6;

  // 应用偏移量
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY, onScreen };
}



export function worldToScreen2(
  worldX: number,
  worldY: number,
  worldZ: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number } {

  // ============================================
  // 1. 获取相机信息
  // ============================================
  const camEyeX = GetCameraEyePositionX();
  const camEyeY = GetCameraEyePositionY();
  const camEyeZ = GetCameraEyePositionZ();

  const camTargetX = GetCameraTargetPositionX();
  const camTargetY = GetCameraTargetPositionY();
  const camTargetZ = GetCameraTargetPositionZ();

  // ============================================
  // 2. 构建相机坐标系（View Matrix 的基础）
  // ============================================

  // 前向向量（从相机指向目标，即相机看的方向）
  let forwardX = camTargetX - camEyeX;
  let forwardY = camTargetY - camEyeY;
  let forwardZ = camTargetZ - camEyeZ;

  // 归一化前向向量
  const forwardLen = Math.sqrt(forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ);
  if (forwardLen < 0.0001) {
    return { screenX: 0, screenY: 0 }; // 相机位置和目标重合，无法计算
  }
  forwardX /= forwardLen;
  forwardY /= forwardLen;
  forwardZ /= forwardLen;

  // 世界上方向（WC3中Z轴是垂直方向）
  const worldUpX = 0;
  const worldUpY = 0;
  const worldUpZ = 1;

  // 右向量 = 前向 × 世界上（叉积）
  let rightX = forwardY * worldUpZ - forwardZ * worldUpY;
  let rightY = forwardZ * worldUpX - forwardX * worldUpZ;
  let rightZ = forwardX * worldUpY - forwardY * worldUpX;

  // 归一化右向量
  let rightLen = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ);
  if (rightLen < 0.0001) {
    // 前向与上方向平行（俯视/仰视），使用替代上方向
    rightX = 1;
    rightY = 0;
    rightZ = 0;
    rightLen = 1;
  }
  rightX /= rightLen;
  rightY /= rightLen;
  rightZ /= rightLen;

  // 相机上向量 = 右向 × 前向（叉积）
  const camUpX = rightY * forwardZ - rightZ * forwardY;
  const camUpY = rightZ * forwardX - rightX * forwardZ;
  const camUpZ = rightX * forwardY - rightY * forwardX;

  // ============================================
  // 3. 计算世界点在相机坐标系中的位置
  // ============================================

  // 世界点相对于相机的向量
  const relX = worldX - camEyeX;
  const relY = worldY - camEyeY;
  const relZ = worldZ - camEyeZ;

  // 投影到相机坐标系
  // viewX = 点在右向量方向的投影（屏幕X方向）
  // viewY = 点在上向量方向的投影（屏幕Y方向）
  // viewZ = 点在前向向量方向的投影（深度）
  const viewX = relX * rightX + relY * rightY + relZ * rightZ;
  const viewY = relX * camUpX + relY * camUpY + relZ * camUpZ;
  const viewZ = relX * forwardX + relY * forwardY + relZ * forwardZ;

  // ============================================
  // 4. 透视投影
  // ============================================

  // 如果点在相机后面，返回null
  if (viewZ <= 0) {
    return { screenX: 0, screenY: 0 };
  }

  // 获取屏幕宽高比
  const clientWidth = DzGetClientWidth();
  const clientHeight = DzGetClientHeight();
  let aspectRatio = 1.333; // 默认4:3
  if (clientHeight > 0) {
    aspectRatio = clientWidth / clientHeight;
  }

  // 使用 GetCameraField 动态获取视野角度（弧度）
  const fieldOfView = GetCameraField(ConvertCameraField(3)); // CAMERA_FIELD_FIELD_OF_VIEW
  const tanHalfFov = Math.tan(fieldOfView / 2);

  // 透视除法：将3D坐标投影到2D平面
  // NDC坐标范围 [-1, 1]
  const ndcX = viewX / (viewZ * tanHalfFov * aspectRatio);
  const ndcY = viewY / (viewZ * tanHalfFov);

  // ============================================
  // 5. 映射到WC3屏幕坐标系
  // ============================================

  // WC3屏幕坐标范围：X [0, 0.8]，Y [0, 0.6]
  // 屏幕中心：(0.4, 0.3)
  // NDC [-1, 1] 映射到 WC3 屏幕坐标
  const wc3ScreenX = 0.4 + ndcX * 0.4;
  const wc3ScreenY = 0.3 + ndcY * 0.3;

  // 应用偏移量
  const finalScreenX = wc3ScreenX + (options.offsetScreenX || 0);
  const finalScreenY = wc3ScreenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY };
}