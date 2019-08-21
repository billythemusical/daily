var circles = [];
var filters = [];
// var sliders = [];
var freqs = [];
var amps = [];
var num = 4;
var t = 0;
var scene = 0;


function setup() {
  // frameRate(24);
  // createCanvas(600, 600, WEBGL);
  createCanvas(600, 600);
  setupOsc(12000, 3334);

  freqs = [0, 0, 0, 0, 0];
  amps = [5];

  for (i = 0; i < num; i++) {
    let a = (i * (60 + i/20000));
    let b = ((i + 1) * (60 + (i + 1)/20000));
    filters[i] = {"low":int(a), "hi":int(b)};
    // filters[i] = {"low":900, "hi":1100};
  }

  // console.log(filters);

  for (i = 0; i < num; i++) {
    // var x = i/num * w + i;
    var x = random(width);
    var rw = 10;
    var rh = 10;
    var y = random(height);
    circles[i] = new Circle(x, y, rw, rh, 1, 2, filters[i]);
    // console.log(circles[i].filterFreq.low, circles[i].filterFreq.hi);
  }



}

function draw() {
  background(160, 100, 0);
  t+=0.1;

    var sin1 = freqs[0]*20 + sin(t)*20;
    var rect1 = freqs[1]*20 + sin(t + 5)*20;
    var sin2 = freqs[2]*30 + sin(t + 3) * 20;
    var tri1 = freqs[3]*3000.;

    var x = width*0.25;
    var y = height*0.25;
    var z = width*0.5;
    var a = height*0.5;

    noStroke();
    fill(0, 100, 0);
    strokeWeight(5);
    stroke(200, 0, 200);

    beginShape();
    vertex(x + sin1, y + sin2, 0);
    vertex(x + z + sin1, y - sin2, 0);
    vertex(x + z + rect1, y + a, 0);
    vertex(x - tri1, y + a, 0);
    vertex(x + sin1, y + sin2, 0);
    endShape();

}

function receiveOsc(address, values) {
  // console.log("received OSC: " + address + " " + values);

  for (i = 0; i < freqs.length; i++) {
    if (address == '/freqs') {
        freqs[i] = values[i];
    }
    if (address == '/amps') {
        amps[i] = values[i];
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
