const r = require("raylib");
const range = require("./range");

const VERTICAL = 0;
const HORIZONTAL = 1;

function hasDetectorReachedAnyEdge(d) {
  const dStart =
    (d.direction === HORIZONTAL ? d.y : d.x);
  const dLength =
    (d.direction === HORIZONTAL ? d.height : d.width)

  return ((dStart + dLength) >= d.end) || (dStart <= d.start);
}

function toggleDetectorMode(d) {
  return hasDetectorReachedAnyEdge(d) ?
    -d.velocity :
    d.velocity;
}

function getNextPosition(d) {
  return (d.direction === HORIZONTAL ? d.y : d.x) + d.velocity;
}

function getDetectorColor(d) {
  return d.particlesOverlapping ?
    r.ColorAlpha(r.RED, 0.5) :
    r.ColorAlpha(r.WHITE, 0.7);
}

function createDetector(start, width, height, velocity, end, direction) {
  return {
    x: direction === VERTICAL ? start : 0,
    y: direction === HORIZONTAL ? start : 0,
    start,
    end,
    width: width,
    height,
    velocity: velocity,
    particlesOverlapping: false,
    direction,
  };
}

function updateDetector(d, f1, f2) {
  if (d.direction === VERTICAL) { d.x = getNextPosition(d); }
  if (d.direction === HORIZONTAL) { d.y = getNextPosition(d); }

  d.velocity =
    toggleDetectorMode(d);

  d.particlesOverlapping =
    Boolean(f1) && range.isOverlapping(d, f1) ||
    Boolean(f2) && range.isOverlapping(d, f2);

  return d;
}

function update(world) {
  world.detectors.d1 =
    updateDetector(world.detectors.d1, world.fields.f1, world.fields.f2);
  world.detectors.d2 =
    updateDetector(world.detectors.d2, world.fields.f1, world.fields.f2);
  world.detectors.d3 =
    updateDetector(world.detectors.d3, world.fields.f3);

  return world;
}

function drawDetector(d) {
  r.DrawRectangleRec(d, getDetectorColor(d));

  return d;
}

function draw(world) {
  drawDetector(world.detectors.d1);
  drawDetector(world.detectors.d2);
  drawDetector(world.detectors.d3);

  return world;
}

module.exports = {
  VERTICAL,
  HORIZONTAL,
  createDetector,
  update,
  draw,
};
