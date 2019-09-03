let walkers = [];
let numWalkers = 20;
let t = 0;
let root = 400;
let filtFreq1 = 1000;
let filtFreq2 = 1000;
let w = 700;
let h = 700;
var topLeft, topRight, bottomLeft, bottomRight;

let oscars = [];
let filts = [];
let freqs = [];
let click;

//easing functions via p5.func
var e;

function setup() {
  createCanvas(w, h);

  topLeft = createVector(w*(1/numWalkers), h*( 1/numWalkers));
  topRight = createVector(w*((numWalkers - 1)/numWalkers), h*( 1/numWalkers));
  bottomLeft = createVector(w*(1/numWalkers), h*((numWalkers - 1)/numWalkers));
  bottomRight = createVector(w*((numWalkers - 1)/numWalkers), h*((numWalkers - 1)/numWalkers));

  filt1 = new p5.LowPass();
  filt1.res(20);
  filt1.freq(filtFreq1);

  filt2 = new p5.LowPass();
  filt2.res(20);
  filt2.freq(filtFreq2);

  osc1 = new p5.Oscillator();
  osc1.setType('square');
  osc1.freq(root);
  osc1.amp(0.1);
  osc1.disconnect();
  osc1.connect(filt1);
  osc1.start();

  osc2 = new p5.Oscillator();
  osc2.setType('sawtooth');
  //a fifth is 3:2 to root
  osc2.freq(3*root/2);
  osc2.amp(0.1);
  osc2.disconnect();
  osc2.connect(filt2);
  osc2.start();

  freqs = [0, 62, 66, 69, 71, 73, 76, 79, 83,
            55, 59, 62, 66, 69, 71, 74, 76,
             68, 63, 66
          ];

  //easing functions
  e = new p5.Ease(); // easing function object
  // print(e.listAlgos());


  for(i = 0; i < numWalkers; i++){
    //the dots
    let x = width*0.1 * i;
    let y = height*0.1 + height*0.1 * i;
    let r = 20;
    walkers[i] = new Walker(x, y, r);

    //filter for each dot
    filts[i] = new p5.LowPass();
    filts[i].res(20);
    filts[i].freq(1000);

    //oscillator for each dot
    oscars[i] = new p5.Oscillator();
    oscars[i].setType('sawtooth');
    // oscars[i].freq(midiToFreq((freqs[i] + 1) % 75));
    oscars[i].freq(midiToFreq(freqs[i]));
    oscars[i].amp(0);
    oscars[i].disconnect();
    oscars[i].connect(filts[i]);
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

  t+=0.01;

  background(0);

  //for syncing audio video
  if (mouseIsPressed) {
    click.start();
    background(255);
  } else {
    click.stop();
  }

  for (i = 0; i < numWalkers; i++) {
    walkers[i].update();
    walkers[i].display();
    let amps = map(walkers[i].x, topLeft.x, topRight.x, freqs[i]*2, freqs[i]);
    oscars[i].freq(constrain(midiToFreq(amps), 20, 20000));
    // print(amps);
    let ampRamp = constrain(map(walkers[i].alpha, 0, 255, 0.0, 0.11), 0.0001, 1);
    // print(ampRamp);
    oscars[i].amp(ampRamp);
  }

  let incFreq1 = map(walkers[0].line1x, topLeft.x, topRight.x, root, 3*root/2) + sin(t)*10;
  let incFreq2 = map(walkers[0].line2x, topRight.x, topLeft.x, 3*root/2, root) + cos(t)*100;
  osc1.freq(incFreq1);
  osc2.freq(incFreq2);

  let incFilt1 = map(walkers[0].line2y, topLeft.y, bottomLeft.y, filtFreq1, filtFreq1/2 + cos(t*100)*100);
  let incFilt2 = map(walkers[0].line2y, topLeft.y, bottomLeft.y, filtFreq1/2, filtFreq1) + sin(t*100)*100;
  filt1.freq(incFilt1);
  filt2.freq(incFilt2);

  push();
  let centerAlpha = map(sin(t), 1, -1, 1200, -400);
  fill(100, 200, 200, centerAlpha);
    ellipse(w*0.25, h/2, w/3 + bounce1());
  fill(255, centerAlpha);
    ellipse(w*0.75, h/2, w/3 + bounce2());
    fill(255, centerAlpha);
  ellipse(w*0.25, h/2, w/12 + bounce2());
    fill(100, 200, 200, centerAlpha);
  ellipse(w*0.75, h/2, w/12 + bounce1());
  pop();

}

function bounce1() {
  if (walkers[0].alpha < 100) {
    return e.quadraticInOut(sin(t*100)*5)
    // return e.cubicInOut(sin(t*100)*3)
    // return e.bounceInOut(cos(t*100)*2);
  } else {
    return 0
  }
}

function bounce2() {
  if (walkers[0].alpha < 100) {
    return e.quadraticInOut(sin(t*100)*5)
    // return e.cubicInOut(sin(t*100)*3)
    // return e.bounceInOut(sin(t*100)*2);
  } else {
    return 0
  }
}
