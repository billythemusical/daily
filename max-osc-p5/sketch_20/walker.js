class Walker {
  
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alpha = 0;
    this.incPointX = 0;
    this.incPointY = 0;
    this.incLineX = 0;
    this.incLineY = -1;
    // this.line1x = width*(1/numWalkers);
    // this.line1y = height*((numWalkers - 1)/numWalkers);
    // this.line2x = width*((numWalkers - 1)/numWalkers);
    // this.line2y = height*(1/numWalkers);
    
    this.line1x = topLeft.x;
    this.line1y = bottomLeft.y;
    this.line2x = topRight.x;
    this.line2y = topLeft.y;
  }
  
  update() {
    
    if (this.x > width*((numWalkers-1)/numWalkers)) {
      this.x = width*(1/numWalkers);
    }
    if (this.y > height*((numWalkers-1)/numWalkers)) {
      this.y = height*(1/numWalkers);
    }
    
    if (this.line1x <= width*(1/numWalkers) && this.line1y >= height*( 1/numWalkers)) {
      this.incLineX = 0;
      this.incLineY = -1;
    } else if (this.line1x <= width*(1/numWalkers) && this.line1y <= height*(1/numWalkers)) {
      this.incLineX = 1;
      this.incLineY = 0;
    } else if (this.line1x >= width*((numWalkers - 1)/numWalkers) && this.line1y <= height*(1/numWalkers)) {
      this.incLineX = 0;
      this.incLineY = 1;
    } else if (this.line1x >= width*((numWalkers - 1)/numWalkers) && this.line1y >= height*((numWalkers - 1)/numWalkers)) {
      this.incLineX = -1;
      this.incLineY = 0;
    } 
 
    
    this.line1x += this.incLineX;
    this.line1y += this.incLineY;
    this.line2x += this.incLineX * -1;
    this.line2y += this.incLineY * -1;
    this.incPointX = noise(t + this.x) * 10;
    this.incPointY = noise(t + this.y) * 5;
    this.x = this.x + this.incPointX;
    this.x = this.x + this.incPointY;

     
  }
  
  display() {
    // stroke(200, 100, 100, map(sin(t*2), -1, 1, 0, 100));
    stroke(200, 100, 100);
    strokeWeight(4);
    
    line(this.line1x, this.line1y, this.x, this.y);
    line(this.line2x, this.line2y, this.x, this.y);
    
    noStroke();
    this.alpha = map(sin(t), -1, 1, 255, -400);
    fill(200, 200, 100, this.alpha);
    ellipse(this.x, this.y, this.r);
  }
}
