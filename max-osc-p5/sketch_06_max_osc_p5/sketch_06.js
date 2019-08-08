// var x, y, rw, rh;
var circle;
var xMove = 0;
var yMove = 0;
var xSwitch = 1;
var ySwitch = 1;
var t = 0;


function setup() {

  createCanvas(600, 600);
  setupOsc(12000, 3334);

  circle = new Circle(width/2, height/2, 80, 80, 0.7);

}

function draw() {
  background(253, 208, 203);
  push();
  fill(255, 0);
  stroke(255, 255, 0);
  strokeWeight(10);
  rect(0, 0, width, height);
  pop();
  // t = t + 0.01;
  if (circle.x < (circle.rw *0.5 + 10) || circle.x > width - (circle.rw * 0.5 + 10)) {
    xSwitch = xSwitch * -1;
  }
  if (circle.y < (circle.rh *0.5 + 10) || circle.y > (height - circle.rh *0.5 + 10)) {
    ySwitch = ySwitch * -1;
  }
  circle.x += xMove * xSwitch;
  circle.y += yMove * ySwitch;
  circle.display();


}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);



  if (address == '/freqs') {
      if (value[0] < 1100 && value[0] > 1025) {
        fill(255, 0, 255);
        t+=0.01;
        yMove = noise(t * 2) * random(-5, 5);
        xMove = 1;
        circle.freq = int(value[0]);
      } else {
        fill(255);
          yMove = yMove * 0.995;
          xMove = xMove * 0.99;
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
