var x, y, rw, rh;
var circles = [];
var amps = [];
var amp, freq, s, rot;


function setup() {

  createCanvas(600, 600);
  setupOsc(12000, 3334);
  // angleMode(DEGREES);


  //first row of circles
  for (i = 0; i < 4; i++) {
    // var x = 0.2 * width + (i * width * 0.2);
    // var y = height * 0.5 + (5 * random(1)) - height * 0.25 * sin(36 + i * 36);
    circles[i] = new Circle(x, y, rw, rh, s);
    amps[i] = 1;
  }

  //second row of circles
  for (i = 4; i < 8; i++) {
    // var x = 0.2 * width + ((i - 4) * width * 0.2);
    // var y = height * 0.5 + (5 * random(1)) + height * 0.25 * sin(36 + (i-4) * 36);
    circles[i] = new Circle(x, y, rw, rh, s);
    amps[i] = 1;
  }

  console.log(circles.length, amps.length)
  translate(width * 0.5, height * 0.5);
}

function draw() {
  background(220, 220, 50, 80);
    for (i = 0; i < 4; i++) {
      // rotate(rot);
      t = i;
      var r = map(i, 0, circles.length, 0, 255);
      fill(r, 100, 200, 100);
      var stro = map(amps[i], 10, 200, 1, 10);
      var x = cos(i + 0.08 - frameCount % 600) * width * 0.25;
      var y = sin(i + 0.08 - frameCount % 600) * height * 0.25;
      circles[i].x = x;
      circles[i].y = y;
      circles[i].stro = stro;
      circles[i].rw = amps[i] + random(-2, 2);
      circles[i].rh = amps[i] + random(-2, 2);
      circles[i].display();

      t = i;
      var r = map(i, 0, circles.length, 0, 255);
      fill(r, 100, 200, 100);
      var stro = map(amps[i + 4], 10, 200, 1, 10);
      var x = sin(i + 0.08 + frameCount % 600) * width * 0.25;
      var y = cos(i + 0.08 + 600 % frameCount) * height * 0.25;
      circles[i + 4].x = x;
      circles[i + 4].y = y;
      circles[i + 4].stro = stro;
      circles[i + 4].rw = amps[i + 4] + random(-2, 2);
      circles[i + 4].rh = amps[i + 4] + random(-2, 2);
      circles[i + 4].display();

    }

    // for (i = 0; i < 4; i++) {
    //   t = i;
    //   var r = map(i, 0, circles.length, 0, 255);
    //   fill(r, 100, 200, 80);
    //   var stro = map(amps[i + 4], 10, 200, 1, 10);
    //   var x = sin(i + 0.08) * width * 0.25;
    //   var y = cos(i + 0.08) * height * 0.25;
    //   circles[i + 4].x = x;
    //   circles[i + 4].y = y;
    //   circles[i + 4].stro = stro;
    //   circles[i + 4].rw = amps[i + 4] + random(-2, 2);
    //   circles[i + 4].rh = amps[i + 4] + random(-2, 2);
    //   circles[i + 4].display();
    //   // pop();
    // }
}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);

  if (address == '/amp') {
    for (var i = 0; i < circles.length; i++) {
      amps[i] = map(value[i], 10, 200, 20, 100);
      // ampy = amps[i];
      // console.log(amps[i])
    }
  }

  if (address == '/rot') {
    rot = radians(value[0]);
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
