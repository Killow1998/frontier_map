export class Actor {

  x: number = 0;
  y: number = 0;
  z: number = 0;





  get position() {
    return { x: this.x, y: this.y, z: this.z };
  }

  set position({ x, y, z }: { x: number; y: number; z: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }



}