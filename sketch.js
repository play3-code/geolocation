let geodata;
let waterData;

let projection;

// variable to store location
let myPosition = {
  lat: 0,
  lng: 0,
};

function preload() {
  geodata = loadJSON("lucerne-water.geojson");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  waterData = geodata.features;
  console.log("waterData", waterData);

  // create d3 projection function
  projection = d3
    .geoMercator()
    .center([8.286628, 47.059598])
    .translate([width / 2, height / 2])
    .scale(3000000);

  frameRate(30);
}

function draw() {
  background(0);

  drawWater();

  // draw current location
  // transform  position to screen coordinates
  let projcoords = projection([myPosition.lng, myPosition.lat]);
  let x = projcoords[0];
  let y = projcoords[1];

  // calculate opacity for blinking location indicator
  let opacity = map(sin(0.2 * frameCount), -1, 1, 0, 255);

  // draw location indicator
  noFill();
  stroke(0, 128, 163, opacity);
  strokeWeight(2);
  ellipse(x, y, 30, 30);
  line(x + 15, y, x + 20, y);
  line(x - 15, y, x - 20, y);
  line(x, y - 15, x, y - 20);
  line(x, y + 15, x, y + 20);

  // write current location to screen
  noStroke();
  fill("#0080A3");
  textSize(32);
  text(
    nf(myPosition.lng, 0, 4) + " " + nf(myPosition.lat, 0, 4),
    x + 20,
    y - 10
  );

  // from time to time fetch current position and update location variable and projection center
  if (frameCount < 100 || frameCount % 100 == 0) {
    if (!navigator.geolocation) {
      alert("navigator.geolocation is not available");
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      myPosition.lat = position.coords.latitude;
      myPosition.lng = position.coords.longitude;
      projection.center([myPosition.lng, myPosition.lat]);
    });
  }
}

function drawWater() {
  for (let i = 0; i < waterData.length; i++) {
    let waterObject = waterData[i];
    let geometry = waterObject.geometry;
    let coordinates = geometry.coordinates[0][0];
    noStroke();
    fill("#005066");

    beginShape();
    for (let j = 0; j < coordinates.length; j++) {
      let coord = coordinates[j];

      let projcoords = projection(coord);

      let x = projcoords[0];
      let y = projcoords[1];

      vertex(x, y);
    }
    endShape();
  }
}

// this adapts canvas size to window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
