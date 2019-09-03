let x = 0;
let y = 0;
let ang = 90;
let col = 0;
let moveC = 1;
let b;

// magic value that makes the circles the right size
let manip;
//song to play
let timtimsong;
// make a new amplitude module
let amplitude;
let currentAmplitude;
let previousAmplitude;
//get the computer's mic input
let mic;

//get the level of that module
let level;
//map the level of that module
let levelMap = 0;

let bkgdSliderVal = 0.01;


function preload() {
  //load my background music
  timtimsong = loadSound("timtim.mp3");
}



function setup() {
  // play my background music
  timtimsong.loop();
  
  //do not display the mouse
  noCursor();
  
  // get the amplitude of the song
  // amplitude = new p5.Amplitude();
  
  // get the amplitude of the mic
  mic = new p5.AudioIn();

  createCanvas(600, 600);

  imageMode(CENTER);

  //way better than radians!!
  angleMode(DEGREES);

  //tyring HSB out
  colorMode(HSB);

  // domObjects();

  // change this number to move the circles farther apart
  manip = 400 / 72;
  //for instance...
  // manip = 2;
  
  //start off the values with the mouse at 0, height/2
  b = 0;
  manip = windowHeight/2;

  textSize(24);
  textAlign(LEFT);
  smooth();

}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }


function draw() {
  // size of DOTS
  // b = bValSlider.value();
  b = map(mouseX, 0, windowWidth, 0.05, 0.2);
  
  //size of donut
  // manip = manipSlider.value();
  //change to mouse adjustment
    manip = map(mouseY, 0, width, windowHeight/50, 0.001);
  
  
  // clears the screen if 'c' is pressedcc
  // keyTyped();

  // slider for FRAMERATE
  // let f = frameRateSlider.value();
  //**changing to mouseY**
  // let f = map(mouseY, 0, windowHeight, 60, 12);
  // frameRate(f);


  bkgdColor();
  donut(0, 0, 0);
  // instructions();

}

function donut(strokeH, strokeS, strokeB) {

  push();

  //moving the color value
  col += moveC;
  fill(col * 2, 75, 100);

  //if color gets greater than or equal to 100 OR color gets less than 0, 
  //change the value at which we move color to negative.  
  //this allows an oscillation.  You can use print(col); to test your values

  if (col >= 100 || col < 0) {
    moveC = moveC * -1;
  }
  ang += 5;

  //sets up the drawing to oscillate up and down around the center
  // let weight = dist(mouseX, mouseY, pmouseX, pmouseY) * 10;
  // let transX = windowWidth / 2 + sin(ang * 2);
  // let transY = windowHeight / 2 + cos(ang / 3) * 20;
  //for 600x600 window
  let transX = 600 / 2 + sin(ang * 2);
  let transY = 600 / 2 + cos(ang / 3) * 20;
  translate(transX, (transY));


  //increments the rotation so it moves - remember x = x++ down below
  rotate(x / ((b * sqrt(3) / levelMap)));

  // comment this out to stop the rotation
  x += 5;

  /* This FOR loop draws set of ellipses in the shape of a circle. 
  And 360 / 13 determines is how many I will get with the final numbers found by trial and error. */

  for (i = 0; i < 360; i += 13) {

    /* These ellipse values were found by trial and error.  The fact that cos and sin work opposite in the x / y planes is what makes the circles be drawn around the center. I used mouseX / mouseY to manipulate the shape of the ellipse. Try different numbers for manip...  */
    
    // let manip = PI;
    let ellipseX = windowWidth / 20 + cos(i++) * windowWidth / manip;
    let ellipseY = windowWidth / 20 + sin(i++) * windowWidth / manip;
    let ellipseSize = windowWidth / 20;
    
    //get the level of the mic
    level = mic.getLevel();
    
    // get the level of the looped song
    levelMap = map(level, 0, 1, 2, 100);
    
    // let SWSliderVal = map(strokeWeightSlider.value(), 0, 0.3, 0, 10);
    // SWSliderVal = map(mouseX, 0, width, 0, 1);
    stroke(strokeH, strokeS, strokeB);
    strokeWeight(0.3);
    // strokeWeight(0.1);
    ellipse(ellipseX, ellipseY, ellipseSize * b * levelMap);
  }
  
  pop();

}

function instructions() {
  push();
  fill(255, 30);
  textFont('Arial');
  textSize(14);
  text("sound on... start sliding", windowWidth / 20, (17 / 20) * windowHeight);
  pop();
}


function bkgdColor() {
  push();
  colorMode(RGB);
  background(random(100, 120), random(200, 50), random(100, 255), sqrt(3));
  pop();
}

// cclears the screen if 'c' is pressed
function keyTyped() {
  if (key === 'c') {
    redraw();
  }
}


function domObjects() {
  bValSlider = createSlider(0.01, 0.2, 0.01, 0.0001);
  bValSlider.position(windowWidth / 20, 16 * windowHeight / 20);
  let manipRep = (400 / 72);
  manipSlider = createSlider(windowWidth / 600, windowHeight / 40, windowHeight / 50, 0.001);
  // manipSlider = createSlider(2, 20, 8, 0.001);
  manipSlider.position(windowWidth / 20, 17 * windowHeight / 20);
  manip = manipSlider.value();
  manip = map(mouseY, 0, width, windowHeight/50, 0.001);
  frameRateSlider = createSlider(12, 60, 30, 1);
  frameRateSlider.position(windowWidth / 20, 18 * windowHeight / 20);
  strokeWeightSlider = createSlider(0.01, 0.1, 0.03, 0.01);
  strokeWeightSlider.position(windowWidth / 20, 19 * windowHeight / 20);
}