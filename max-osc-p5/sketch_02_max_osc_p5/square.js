class Square {

  constructor(_x, _y, _w, _h, _s) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.s = _s;
  }

  display() {
    strokeWeight(this.s);
    rect(this.x, this.y, this.w, this.h);
  }

}
