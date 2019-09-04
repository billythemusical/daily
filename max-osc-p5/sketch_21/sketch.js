let iNum = 20;
let jNum = 20;
let ang = 1;
let mX, mY;

/* Global variables to track the shape of the rectangles 
and pass those values to the oscillators. */
let rectX;
let rectY;
let rectW;
let rectH;
let rectCorners;

/* Arrays to hold the oscillators, filters for each osc,
and the frequencies which the oscillators will be set to. */

let num = 20;
let oscars = [num];
let filts = [];
let freqs = [];
let lfo1;

function setup() {
  createCanvas(800, 800);
//fun to mess with diff modes CENTER, CORNERS
  rectMode(CORNER);

//midi note values so we use midiToFreq() later
  freqs = [0, 62, 66, 69, 71, 73, 76, 79, 83,
            55, 59, 62, 66, 69, 71, 74, 76,
             68, 63, 66
          ];
  
//making the oscillator banks and tying each to a filter
  for (i = 0; i < 10; i++) {   
    filts[i] = new p5.LowPass();
    filts[i].res(20);
    
  /* Setting the freq 1.5 times above the root note of the osc 
  will allow some harmonics to come through. */ 
    filts[i].freq(midiToFreq(freqs[i + 1]*1.5));
    
    oscars[i] = new p5.Oscillator();
  //sawtooth for a rich sound
    oscars[i].setType('sawtooth');
  /* By using the modulo operator % you can get some symmetry 
  in the notes or keep them centered around a value. */
    oscars[i].freq(midiToFreq((freqs[i] + 1) % 75));
  // Keep the volume low because there will be many oscillators
    oscars[i].amp(0.05);
  // Disconnect them from the Master output and connect to each filter
    oscars[i].disconnect();
    oscars[i].connect(filts[i]);
  // Turn oscs on
    oscars[i].start();
  }
  
  //for syncing audio/video
  click = new p5.Oscillator();
  click.setType('sawtooth');
  //a fifth is 3:2 to root
  click.freq(1000);
  click.amp(0.1);
}

function draw() {
  
  background(100, 255, 255, 10);
  
  // for syncing audio and video
  if (mouseIsPressed) {
    click.start();
    background(255);
    for (i = 0; i < oscars.length; i++) {
    oscars[i].freq(0);
    }
  } else {
    click.stop();
  }
  
  noStroke();
  fill(255);
//this is our rect width
  mX = 20
  mY = 20
//the angle of rotation
  ang+=0.001;
//to center the canvas
  translate(width/2, height/2);
  
//making the rectangles
  for (let i = -20; i < iNum + 1; i++) {
    for (j = -20; j < jNum + 1; j++) {
      noStroke();
      fill(255, 0, 0);
    //setting the alternating colors
      if (i % 2 == 0 && j % 2 == 0) {
        noStroke();
        fill(255, 0, 255);
      } else if (i % 2 != 0 && j % 2 != 0){ 
        fill(100,255,100); 
      }
    //fun to comment either of these in/out
      rotate(ang/10);
      // rotate(ang/sin(ang));
      
      rectX = j * 20;
      rectY = j * 20;
    /* Some tom-foolery to get the funk going.  These values are 
    reached by a decent hypothesis and much trial and error. 
    Season to taste...*/
      rectW = abs(mX * sin(ang)) + sin(ang)*2;
      rectH = mY * abs(tan(ang));
      rectCorners = abs(sin((ang*10))*10);
    /* Drawing the rectangles and oscillating 
    their width, height, and corner shape. */
      rect(rectX, rectY, rectW, rectH, rectCorners);
    }
  }
  
  for (i = 0; i < oscars.length; i++) {
    // Oscillating the oscillator frequency...
    let freq1 = midiToFreq(freqs[i + 1]) + sin(rectW)*10;
    //... and the adjacent oscillator in the opposite direction
    let freq2 = midiToFreq(freqs[i + 1] + 7) + sin(-rectW)*10;
    
    oscars[i].freq(freq1);
    oscars[(i + 1) % oscars.length].freq(freq2);
  }
  
}