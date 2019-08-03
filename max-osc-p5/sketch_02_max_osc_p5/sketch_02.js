var x, y, w, h;
var t = 0;
var xCount = 0;
var yCount = 0;
var wCount = 0;
var hCount = 0;
var squares = [];
var slider, sCount, s;
var inc = 0;
var amp, freq;

function setup() {
  createCanvas(400, 400);
  setupOsc(12000, 3334);
  // createCanvas(400, 400);
  for (i = 0; i < 55; i++) {
    squares[i] = new Square(x, y, w, h, s);
  }
  // mic = new p5.AudioIn();
  // mic.start();
}

function draw() {
  background(50, 125, 90);
    fill(255, 255, 0);
    stroke(255, 255, 0);
    let eX = map(freq, 546, 780, width*0.2, width*0.8);
    ellipse(eX, height*0.9, 10, 10);
    fill(0, 0);
    stroke(255, 255, 0);
    strokeWeight(10);
    rect(0, 0, width, height);
    // var amp = mic.getLevel();
    stroke(255, 0, 255, 100);
    strokeWeight(0.5);
    inc+=0.0001;
    s = 10 + sin(inc) * 10;
    fill(0, 0);
    for (i = 0; i < squares.length; i++) {
      t = i;
      var r = map(i, 0, squares.length, 0, 255);
      fill(r, 100, 200, 80);
      // squares[i].s = random(2) + map(amp, 0, 1, 1, 50);
      squares[i].s = map(amp, 0, 0.5, 2, 70);
      squares[i].x = width/2 + sin(t) * width/8;
      squares[i].y = 125 + sin(t * s) * 50;
      squares[i].w = sin(t) * 100;
      squares[i].h = 100 + sin(t * s) * 50;
      squares[i].display();
    }
}

function receiveOsc(address, value) {
  console.log("received OSC: " + address + ", " + value);

  if (address == '/amp') {
    amp = value[0];
  }

  if (address == '/freq') {
    freq = value[0];
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
