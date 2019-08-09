// var x, y, rw, rh;
// var circle;
var circles = [];
var filters = [];
var sliders = [];
var num = 5;
var xMove = 0;
var yMove = 0;
var xSwitch = 1;
var ySwitch = 1;
var t = 0;


function setup() {

  createCanvas(600, 600);
  setupOsc(12000, 3334);

  filters = [

    {"low":1101, "hi":1400},
    {"low":1025, "hi":1100},
    {"low":500, "hi":990},
    {"low":300, "hi":500},
    {"low":100, "hi":270}

  ];

  for (i = 0; i < num; i++) {
    // circles[i] = new Circle((i + 1)/num * (width*0.8), (i + 1)/num * (height*0.8), 80, 80, 0.7, filters[i]);
    circles[i] = new Circle((i + 1)/num * (width*0.8), (i + 1)/num * (height*0.8), 80 + (i * 5), 80 + (i * 5), 2, filters[i]);
    // console.log(circles[i].filterFreq.low, circles[i].filterFreq.hi)
  }

}

function draw() {
  background(100 * circles[1].amp * 10, 100, 50 + (circles[2].amp * 1000));
  boundingRect();
  for(i = 0; i < num; i++) {
    circles[i].checkEdges();
    circles[i].display();
    circles[i].update();
  }
}

function boundingRect() {
  push();
  fill(255, 0);
  stroke(255, 100, 200);
  strokeWeight(10);
  rect(0, 0, width, height);
  pop();
}

function receiveOsc(address, values) {
  // console.log("received OSC: " + address + ", " + values);
  for (i = 0; i < num; i++) {
    if (address == '/freqs') {
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
  var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
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
