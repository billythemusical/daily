class Circle {

  constructor(_x, _y, _rw, _rh, _mass, _stro, _filterFreq) {
    // this.x = _x;
    // this.y = _y;
    this.position = createVector(_x, _y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = _mass;
    this.rw = _rw;
    this.rh = _rh;
    this.stro = _stro;
    this.col = (0);
    this.freq = 0;
    this.filterFreq = _filterFreq;
    this.amp = 1;
    // this.yMove = random(1);
    // this.xMove = random(1);
    this.move = createVector(random(1,3), random(2,4))
    // this.xSwitch = 1;
    // this.ySwitch = 1;
    this.switch = createVector(1, 1);
    // this.xChange = 1;
    // this.yChange = 1;
    this.change = createVector(1, 1);
    this.wid = 0;
    this.hi = 0;
    // this.offset = random(-20, 20);
  }

  display() {
    stroke(255);
    strokeWeight(this.stro);
    if (this.freq > this.filterFreq.low && this.freq < this.filterFreq.hi) {
    fill(this.col);
  } else {
    fill(0, 10);
  }
    ellipse(this.position.x, this.position.y, this.rw, this.rh);
    push();
    noStroke();
    fill(10, 255, 255);
    textSize(16);
    // text(int(this.freq) + "hz", this.x - 25, this.y + 10);
    pop();
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(force);
  }

  checkEdges() {

   // if (this.position.x > (width - this.rw*0.5)) {
   //   this.position.x = width - this.rw*0.5;
   //   this.velocity.x *= -1;
   // } else if (this.position.x < this.rw*0.5) {
   //   this.velocity.x *= -1;
   //   this.position.x = this.rw*0.5;
   // }
   // if (this.position.y > (height - this.rh)) {
   //   this.velocity.y *= -1;
   //   this.position.y = height - this.rh*0.5;
   // } else if (this.position.y < this.rh*0.5) {
   //   this.velocity.y *= -1;
   //   this.position.y = this.rh*0.5;
   // }
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    } else if (this.position.y < 0){
      this.velocity.y *= -1;
      this.position.y = 0;
    }

  }

  update() {
    this.velocity.limit(5, 5);
    let rand = createVector(random(0.1, 2) * random(choose));
    let ampSmooth = lerp(this.amp, 0, 0.1);
    // this.x += this.xMove * this.xSwitch;
    // this.y += this.yMove * this.ySwitch;

    if (this.freq > this.filterFreq.low && this.freq < this.filterFreq.hi) {
    //   this.xChange != this.xChange;
      // this.change.mult(-1);
      this.col = (255, 0, 255);
    //   t+=0.01;
      this.wid = this.rw * map(ampSmooth, 0, 0.1, 0.9, 1);
      this.hi = this.rh * map(ampSmooth, 0, 0.1, 0.9, 1);
    //   this.yMove = noise(t) * this.amp * 50 * this.xChange;
    //   this.xMove = noise(t + 2) * this.amp * 50 * this.yChange;
      this.move.mult(0.00001 * this.change.mult((noise(t) * this.amp)));
      // console.log(this.move)
      let rand = p5.Vector.random2D();
      this.acceleration.add(rand);

    } else {
    //     fill(255);
    //covered by friction force
    //     this.yMove = this.yMove * 0.999;
    //     this.xMove = this.xMove * 0.999;
        this.wid-=0.2;
        this.hi-=0.2;
        if (this.wid < this.rw) this.wid = this.rw;
        if (this.hi < this.rh) this.hi = this.rh;
    }
    // this.acceleration.add(this.amp, this.amp);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

}
