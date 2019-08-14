var circles = [];
var filters = [];
// var sliders = [];
var freqs = [];
var amps = [];
var num = 50;


function setup() {
  // frameRate(24);
  let w = 600;
  let h = 400;
  createCanvas(w, h);
  setupOsc(12000, 3334);

  freqs = [5];
  amps = [5];

  for (i = 0; i < num; i++) {
    let a = (i * (60 + i/20000));
    let b = ((i + 1) * (60 + (i + 1)/20000));
    filters[i] = {"low":int(a), "hi":int(b)};
    // filters[i] = {"low":900, "hi":1100};
  }

  console.log(filters);

  for (i = 0; i < num; i++) {
    var x = i/num * w + i;
    // var x = w/2;
    var rw = 10;
    var rh = 10;
    var y = h;
    circles[i] = new Circle(x, y, rw, rh, 1, 2, filters[i]);
    // console.log(circles[i].filterFreq.low, circles[i].filterFreq.hi);
  }



}

function draw() {
  background(0, 20);
  // boundingRect();



  for(i = 0; i < num; i++) {
    let c = 0.01;
    // let friction = circles[i].velocity.copy();
    // friction.mult(-1);
    // friction.setMag(c);

    // Calculate drag force
      // Magnitude is coefficient * speed squared
    let speed = circles[i].velocity.mag();
    let dragMagnitude = this.c * speed * speed;

      // Direction is inverse of velocity
    let dragForce = circles[i].velocity.copy();      dragForce.mult(-1);

      // Scale according to magnitude
      // dragForce.setMag(dragMagnitude);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);

    // circles[i].applyForce(dragForce);

    let gravity = createVector(0, 0.2);
    circles[i].applyForce(gravity);

    circles[i].update();
    circles[i].display();
    circles[i].checkEdges();
  }
}

function receiveOsc(address, values) {
  // console.log("received OSC: " + address + " " + values);

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
