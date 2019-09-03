let mic;
let particles = [];

function setup() {
  createCanvas(800, 800);
  mic = new p5.AudioIn();
  mic.start();
  // for(i = 0; i < 100; i++) {
  //   particles[i] = new Particle(random(0, width * 2), 0);
  // }
}

// class Particle {
//  constructor(x, y) {
//    this.position = createVector(x, y - 10)
//  } 
  
//   display() {
//   push();
//   fill(255, 255, 0);
//   point(this.position.x, this.position.y);
//   pop();
//   }
// }

function draw() {
  background(220);
  //partcles
  // for(i = 0; i < 100; i++) {
  //   particles[i].position.add(-1);
  //   particles[i].display();
  // }
  
  let level = mic.getLevel();
  let ampPlus = map(level, 0, 0.7, 200, 600);
  let ampMinus = map(level, 0, 0.7, 200, 20);

  fill(0, 255, 100);
  stroke(255, 0, 100);
  strokeWeight(ampMinus);
  ellipse(width*0.6, height*0.5, ampPlus);
  
  fill(0, 255, 100);
  stroke(255, 0, 100);
  strokeWeight(ampPlus/10);
  ellipse(width*0.3, height*0.5, ampMinus);
  // ellipse(width*0.66, height*0.5, ampMinus); 

}
