let geodata;
let waterData;

let projection;

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

  projection = d3
    .geoMercator()
    .center([8.30801, 47.04554])
    .translate([width / 2, height / 2])
    .scale(500000);

  frameRate(30);
}

function draw() {
  background(0);

  drawWater();

  // transform  position to screen coordinates
  let projcoords = projection([myPosition.lng, myPosition.lat]);
  let x = projcoords[0];
  let y = projcoords[1];

  // draw blinking location indicator
  let opacity = map(sin(0.2 * frameCount), -1, 1, 0, 255);

  noFill();
  stroke(0, 128, 163, opacity);
  strokeWeight(2);
  ellipse(x, y, 30, 30);
  line(x + 15, y, x + 20, y);
  line(x - 15, y, x - 20, y);
  line(x, y - 15, x, y - 20);
  line(x, y + 15, x, y + 20);

  noStroke();
  fill("#0080A3");
  text(myPosition.lng + " " + myPosition.lat, x + 20, y - 10);

  if (frameCount < 100 || frameCount % 100 == 0) {
    if (!navigator.geolocation) {
      alert("navigator.geolocation is not available");
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      myPosition.lat = position.coords.latitude;
      myPosition.lng = position.coords.longitude;
    });
  }
}

function setPos(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  background(0);
  fill(255);
  textSize(32);
  text(
    "Current position: " + nf(lat, 2, 2) + " " + nf(lng, 2, 2),
    10,
    height / 2
  );
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
      // let lat = coord[1];
      // let lon = coord[0];

      let x = projcoords[0];
      let y = projcoords[1];

      // let x = map(lon, bounds.left, bounds.right, 0, width);
      // let y = map(lat, bounds.top, bounds.bottom, 0, height);
      // console.log(x, y);

      vertex(x, y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
