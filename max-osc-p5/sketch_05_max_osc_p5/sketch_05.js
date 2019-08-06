// var x, y, rw, rh;
var circle;
var xMove = 0;
var yMove = 0;
var inc;


function setup() {

  createCanvas(600, 600);
  setupOsc(12000, 3334);

  circle = new Circle(width * 0.25, height/2, 60, 60, 0.7);

}

function draw() {
  background(150, 150, 75);
  circle.x+= xMove;
  circle.y+= yMove;
  circle.display();
  // if (inc > 50) circle.col = (255, 0, 255);
}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);



  if (address == '/up') {
      yMove = -value[0];
      xMove = 0;
      // inc = 100;
      // inc--;
  }

  if (address == '/down') {
      yMove = value[0];
      xMove = 0;
      // inc = 100;
      // inc--;
  }

  if (address == '/left') {
      xMove = -value[0];
      yMove = 0;
      // inc = 100;
      // inc--;
  }

  if (address == '/right') {
      xMove = value[0];
      yMove = 0;
      // inc = 100;
      // inc--;
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
