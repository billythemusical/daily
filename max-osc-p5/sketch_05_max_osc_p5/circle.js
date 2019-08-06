class Circle {

  constructor(_x, _y, _rw, _rh, _stro) {
    this.x = _x;
    this.y = _y;
    this.rw = _rw;
    this.rh = _rh;
    this.stro = _stro;
    this.col = (255, 0, 255);
  }

  display() {
    stroke(255, 10);
    strokeWeight(this.stro);
    fill(this.col);
    ellipse(this.x, this.y, this.rw, this.rh);
  }

}
