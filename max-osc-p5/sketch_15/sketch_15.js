let freqs = [];

function setup() {
  createCanvas(600, 600);
  setupOsc(12000, 3334);
  freqs = [0, 0, 0, 0, 0];
}

function draw() {
  background(255, 80);
  strokeWeight(1);
  fill(0, 0);
  rect(0, 0, width, height);
  translate(width/2, height/2);

  for(i=0; i<720; i++) {
  fill(0);
  // strokeWeight(map(freqs[0], -1, 1, 20, 1));
  strokeWeight(5);
  // let dis = map(freqs[0], -1, 1, 0, sin(1/i)*10000);
  let dis = map(freqs[0], -1, 1, 0, cos(720/i)*1000);
  // let x = sin(i) * 10 * dis;
  let x = sin(i) * 100 - dis*sin(i) + random(-1, 1);
  // let y = cos(i) * 0.1 * (sqrt(dis)*1000) + sin(dis)*50;
  let wiggle = map(freqs[1], 400, 800, -4, 4)
  let y = cos(i) * 100 + dis*cos(i) + wiggle;
  point(x, y);
  }
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
