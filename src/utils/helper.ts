// 基础的id转换
export function c2i(char: string) {
  return string.unpack(">I4", char)[0] as number
}

export function i2c(id: number) {
  return string.pack("I4", id)
}

export function FourCC(id: string) {
  return c2i(id)
}

export function worldToScreen(x: number, y: number, z: number): { screenX: number, screenY: number, z: number } {
  const eyex = GetCameraEyePositionX();
  const eyey = GetCameraEyePositionZ(); // 修正为 Z 轴
  const eyez = GetCameraEyePositionY(); // 修正为 Y 轴
  const upx = 0;
  const upy = 1;
  const upz = 0;
  const centerx = GetCameraTargetPositionX();
  const centery = GetCameraTargetPositionZ(); // 修正为 Z 轴
  const centerz = GetCameraTargetPositionY(); // 修正为 Y 轴
  
  let z0 = eyex - centerx;
  let z1 = eyey - centery;
  let z2 = eyez - centerz;
  let length = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  let len = 1.0;
  let x0: number;
  let x1: number;
  let x2: number;
  let y0: number;
  let y1: number;
  let y2: number;
  let rhw = 1.0;
  let ratio = 1.0;
  const clientHeight = DzGetClientHeight();

  if (clientHeight !== 0) {
    ratio = DzGetClientWidth() / clientHeight * 600.0 / 800.0;
  }

  if (length > 0) {
    len = 1.0 / length;
  } else {
    len = 1.0; // 默认值以确保后续计算有效
  }

  z0 = z0 * len;
  z1 = z1 * len;
  z2 = z2 * len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

  if (len > 0) {
    len = 1.0 / len;
  } else {
    len = 1.0; // 默认值以确保后续计算有效
  }

  x0 = x0 * len;
  x1 = x1 * len;
  x2 = x2 * len;

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  rhw = -z0 * x - z1 * y - z2 * z + (z0 * eyex + z1 * eyey + z2 * eyez);

  if (Math.abs(rhw) !== 0) {
    rhw = 1.0 / Math.abs(rhw);
  } else {
    rhw = 1.0; // 默认值以确保后续计算有效
  }

  if (ratio === 0) {
    ratio = 1.0;
  }

  const UIx = 0.8 - ((2.00 / ratio) * (x0 * x + x1 * y + x2 * z - (x0 * eyex + x1 * eyey + x2 * eyez)) * rhw + 1.0) * 0.4;
  const UIy = (2.5613 * (y0 * x + y1 * y + y2 * z - (y0 * eyex + y1 * eyey + y2 * eyez)) * rhw + 1.0) * 0.3;
  const UIz = (1001.0 / -999.0 * (z0 * x + z1 * y + z2 * z + 2.0 - (z0 * eyex + z1 * eyey + z2 * eyez)) * rhw + 1.0) * 0.5;
  
  return { screenX: UIx, screenY: UIy, z: UIz };
}

