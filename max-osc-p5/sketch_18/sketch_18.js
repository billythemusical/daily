let walkers = [];
let numWalkers = 10;
let t = 0;
let prevTick = 0;
let tick = 0;

function setup() {
  createCanvas(600, 600);
  setupOsc(12000, 3334);

  for(i = 0; i < numWalkers - 1; i++){
    let x = width*(1/numWalkers) + width*(i/numWalkers);
    let y = height*(1/numWalkers) + height*(i/numWalkers);
    let r = 20;
    walkers[i] = new Walker(x, y, r);
  }

}

class Walker {

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  update() {
    if (prevTick != tick)
    {
      this.x = this.x + width*(1/numWalkers);
    }

    if (this.x > width*((numWalkers-1)/numWalkers))
    {
      this.x = width*(1/numWalkers);
    }
  }

  display() {
    noStroke();
    fill(220, 220, 120);
    // fill(255);
    ellipse(this.x, this.y, this.r);
    // strokeWeight(10);
    // line(this.x, this.y, 0, height)
  }
}


function draw() {
  t+=0.1;
  background(120, 200, 85);
  for (i = 0; i < numWalkers - 1; i++) {
    strokeWeight(10);
    stroke(255, 0, 0)
    line(walkers[i].x, walkers[i].y, 0, height);
    walkers[i].update();
    walkers[i].display();
  }
  prevTick = tick;
}

function receiveOsc(address, values) {
  // console.log("received OSC: " + address + " " + values);
  tick = values[0];
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
