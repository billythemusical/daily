var x, y, rw, rh;
var circles = [];
var amps = [];
var amp, freq, s;


function setup() {

  createCanvas(600, 600);
  setupOsc(12000, 3334);
  angleMode(DEGREES);

  //first row of circles
  for (i = 0; i < 4; i++) {
    var x = 0.2 * width + i * width * 0.2;
    var y = height * 0.5 + (5 * random(1)) - height * 0.25 * sin(36 + i * 36);
    circles[i] = new Circle(x, y, rw, rh, s);
    amps[i] = 1;
  }

  //second row of circles
  for (i = 4; i < 8; i++) {
    var x = 0.2 * width + ((i - 4) * width * 0.2);
    var y = height * 0.5 + (5 * random(1)) + height * 0.25 * sin(36 + (i-4) * 36);
    circles[i] = new Circle(x, y, rw, rh, s);
    amps[i] = 1;
  }

  console.log(circles.length, amps.length)

}

function draw() {
  background(174, 214, 241);
    // fill(255, 255, 0);
    // stroke(255, 255, 0);
    // let eX = map(freq, 546, 780, width*0.2, width*0.8);
    // ellipse(eX, height*0.9, 10, 10);
    // fill(0, 0);
    // stroke(255, 255, 0);
    // strokeWeight(10);
    // rect(0, 0, width, height);
    // // var amp = mic.getLevel();
    // stroke(255, 0, 255, 100);
    // strokeWeight(0.5);
    // inc+=0.0001;
    // s = 10 + sin(inc) * 10;
    // fill(0, 0);
    for (i = 0; i < circles.length; i++) {
      t = i;
      var r = map(i, 0, circles.length, 0, 255);
      fill(r, 100, 200, 80);
      var stro = map(amps[i], 0, 200, 1, 10);
      circles[i].stro = stro;
      // circles[i].x = random(width);
      // circles[i].y = 125 + sin(t * s) * 50;
      circles[i].rw = amps[i] + random(-2, 2);
      circles[i].rh = amps[i]; + random(-2, 2)
      circles[i].display();
    }
}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);

  if (address == '/amp') {
    for (var i = 0; i < circles.length; i++) {
      amps[i] = map(value[i], 0.1, 190., 30., 100.);
      // ampy = amps[i];
      // console.log(amps[i])
    }
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
