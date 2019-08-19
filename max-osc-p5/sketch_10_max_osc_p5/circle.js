class Circle {

  constructor(_x, _y, _rw, _rh, _mass, _stro, _filterFreq) {
    this.position = createVector(_x, _y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = _mass;
    this.rw = _rw;
    this.rh = _rh;
    // this.stro = _stro;
    this.col = color(255,255,0);
    this.freq = 0;
    this.filterFreq = _filterFreq;
    this.amp = 1;
  }


  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {

    // for (i = 0; i < freqs.length; i++) {
    let low = this.filterFreq.low;
    let hi = this.filterFreq.hi;
        if (freqs[0] > low && freqs[0] <= hi) {

          this.acceleration.add(0,-30);
          // let a = this.freq;
          // let b = this.filterFreq.low;
          // let c = this.filterFreq.hi;
          // console.log("move me " + a + " " + b + " " + c);
        // }
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.velocity.limit(0,2);
  }

  display() {
    stroke(255);
    strokeWeight(this.stro);
    // if (this.freq > this.filterFreq.low && this.freq < this.filterFreq.hi) {
      fill(255);
      ellipse(this.position.x, this.position.y, this.rw, this.rh);
    // }
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height - this.rh) {
      this.velocity.y *= -0.9;
      this.position.y = height - this.rh/2;
    } else if (this.position.y < this.rh/2){
      this.velocity.y *= -1;
      this.position.y = this.rh/2;
    }
  }

}
