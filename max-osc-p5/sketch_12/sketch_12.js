// var circles = [];
var filters = [];
// var sliders = [];
var freqs = [];
var amps = [];
var num = 50;
var t = 0;


function setup() {
  // frameRate(24);
  let w = 600;
  let h = 600;
  createCanvas(w, h);
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

  // for (i = 0; i < num; i++) {
  //   // var x = i/num * w + i;
  //   var x = w/2;
  //   var rw = 10;
  //   var rh = 10;
  //   var y = h/2;
  //   circles[i] = new Circle(x, y, rw, rh, 1, 2, filters[i]);
  //   // console.log(circles[i].filterFreq.low, circles[i].filterFreq.hi);
  // }



}

function draw() {
  background(255, 255, 0, 5);
  t+=0.01;
  // for(var i = 0; i < 50; i++) {
  // var x = map(freqs[((i + 1) % 5)], 100, 2000, 0, width);
  var x = map(freqs[0], 100, 2000, 0, width);
  var y = map(freqs[1], 100, 2000, 0, height);
  var z = map(freqs[2], 100, 2000, 0, width);
  var a = map(freqs[3], 100, 2000, 0, height);
  // var newCirc = new Circle(x, y, 10, 10, 1, 2, filters[i]);
  stroke(0, ((t * 100 + 1) % 100), 255);
  strokeWeight(20);
  line(x + noise(t), y - noise(t + 5), z, a);
  // newCirc.update();
  // newCirc.display();
  // }
}

function receiveOsc(address, values) {
  console.log("received OSC: " + address + " " + values);

  for (i = 0; i < num; i++) {
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
