class Circle {

  constructor(_x, _y, _rw, _rh, _stro, _filterFreq) {
    this.x = _x;
    this.y = _y;
    this.rw = _rw;
    this.rh = _rh;
    this.stro = _stro;
    this.col = (255, 0, 255);
    this.freq = 0;
    this.filterFreq = _filterFreq;
    this.amp = 1;
    this.yMove = random(1);
    this.xMove = random(1);
    this.xSwitch = 1;
    this.ySwitch = 1;
    this.xChange = 1;
    this.yChange = 1;
    this.wid = 0;
    this.hi = 0;
    // this.offset = random(-20, 20);
  }

  display() {
    stroke(255);
    strokeWeight(this.stro);
    fill(0);
    ellipse(this.x, this.y, this.wid, this.hi);
    push();
    noStroke();
    fill(10, 255, 255);
    textSize(16);
    // text(int(this.freq) + "hz", this.x - 25, this.y + 10);
    pop();
  }

  checkEdges() {
    if (this.x < this.rw || this.x > (width - this.rw)) {
      this.xSwitch = this.xSwitch * -1;
    }
    if (this.y < this.rh || this.y > (height - this.rh)) {
      this.ySwitch = this.ySwitch * -1;
    }
  }

  update() {
    let ampSmooth = lerp(this.amp, 0, 0.1);
    this.x += this.xMove * this.xSwitch;
    this.y += this.yMove * this.ySwitch;
    if (this.freq > this.filterFreq.low && this.freq < this.filterFreq.hi) {
      this.xChange != this.xChange;
      fill(255, 0, 255);
      t+=0.01;
      // this.wid = this.rw * map(this.amp, 0, 0.05, 0.5, 1);
      // this.hi = this.rh * map(this.amp, 0, 0.05, 0.5, 1);
      this.wid = this.rw * map(ampSmooth, 0, 0.1, 0.9, 1);
      this.hi = this.rh * map(ampSmooth, 0, 0.1, 0.9, 1);
      this.yMove = noise(t) * this.amp * 50 * this.xChange;
      this.xMove = noise(t + 2) * this.amp * 50 * this.yChange;
      // console.log(this.filterFreq.low, this.filterFreq.hi);
    } else {
        fill(255);
        this.yMove = this.yMove * 0.999;
        this.xMove = this.xMove * 0.999;
        this.wid-=0.2;
        this.hi-=0.2;
        if (this.wid < this.rw) this.wid = this.rw;
        if (this.hi < this.rh) this.hi = this.rh;
    }
  }

}
