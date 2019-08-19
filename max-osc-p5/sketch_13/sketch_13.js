// var circles = [];
var filters = [];
// var sliders = [];
var freqs = [];
var amps = [];
var num = 50;
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
  background(0, 200, 0);
  t+=0.01;
  // translate(-width/2, -height/2, 0)
  for(var i = 0; i < 10; i++) {
    var x = width*0.1;
    var y = height*0.1 + i*50 + sin(t)*10;
    var z = width*0.8;
    var a = 30;
    // var sinXMove = sin(t)*20;

    // if(t < 1) {scene = 0} else {scene+=1.01}
    var sinXMove = freqs[0]*30;
    // var cosXMove = cos(t)*10;
    var cosXMove = freqs[1]*13;
    var sinYMove = freqs[0]*10;

    noStroke();
    fill(0, 255, 255);
    strokeWeight(5);
    stroke(255, 255, 0);
    // translate(0, 0, zTrans*2);
    beginShape();
    vertex(x - sinXMove, y + sinYMove, 0);
    vertex(x + z + sinXMove, y - sinYMove, 0);
    vertex(x + z + cosXMove, y + a, 0);
    vertex(x - cosXMove, y + a, 0);
    vertex(x - sinXMove, y + sinYMove, 0);
    endShape();
    // translate(0, 0, -zTrans*2);
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
