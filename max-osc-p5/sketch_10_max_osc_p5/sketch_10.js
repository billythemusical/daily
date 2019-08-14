let t = 0;
let col = [];
let x, y, rw, rh;
var socket, osc1;

function setup() {
  createCanvas(600, 600);
  setupOsc(12000, 3334);
  noiseSeed(50);

  col = [
          "mediumseagreen",
          "lightgreen",
          "darkseagreen",
          "yellow",
        ];
}

function draw() {
  t+=0.00007;
  background(220, 220, 0);
  boundingRect();

  for (i = 0; i < width * 2; i+=0.5) {
  let j = floor(map(i, 0, width * 2, 0, 3));
  fill(col[j]);
  noStroke();
  x = -width/2 + width * map(i, 0, width, 0, 1);
  y = height / 2 + (height * sin(noise(t) * i));
  rw = (50 + 20 * sin(t * 100))/2;
  rh = (20 + 30 * sin(t * 100))
  ellipse(x, y, constrain(rw, 8, 45), constrain(rh, 20, 45));
  }
  osc1 = sin(t * 100);
  sendOsc("/osc1", osc1);
  // print(osc1);
}

function boundingRect() {
  push();
  fill(255, 0, 200);
  stroke(255, 100, 200);
  strokeWeight(10);
  rect(0, 0, width, height);
  pop();
}



function receiveOsc(address, values) {

  for (i = 0; i < num; i++) {
    if (address == '/freqs') {
          // console.log("received OSC: " + address + ", " + values);
        circles[i].freq = values[i];
    }
    if (address == '/amps') {
        circles[i].amp = values[i];
    }
  }
}

function sendOsc(address, value) {
  socket.emit('message', [address].concat(value));
}

function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
  socket.on('connect', function() {
    socket.emit('config', {
      server: { port: oscPortIn,  host: '127.0.0.1'},
      client: { port: oscPortOut, host: '127.0.0.1'}
    });
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i=2; i<msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
}
