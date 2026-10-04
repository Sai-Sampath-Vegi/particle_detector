const r = require("raylib");
const range = require("./range");

const VERTICAL = 0;
const HORIZONTAL = 1;

function hasDetectorReachedAnyEdge(d) {
  const dStart = (d.direction === HORIZONTAL ? d.y : d.x);
  const dLength = (d.direction === HORIZONTAL ? d.height : d.width)

  return ((dStart + dLength) >= d.end) || (dStart <= d.start);
}

function toggleDetectorMode(d) {
  return hasDetectorReachedAnyEdge(d) ? -d.velocity : d.velocity;
}

function getNextPosition(d) {
  return (d.direction === HORIZONTAL ? d.y : d.x) + d.velocity;
}

function getDetectorColor(d) {
  return d.particlesOverlapping ? r.ColorAlpha(r.RED, 0.5) : r.ColorAlpha(r.WHITE, 0.7);
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

function update(d, f1, f2) {
  if (d.direction === VERTICAL) { d.x = getNextPosition(d); }
  if (d.direction === HORIZONTAL) { d.y = getNextPosition(d); }
  d.velocity =
    toggleDetectorMode(d);
  d.particlesOverlapping =
    Boolean(f1) && range.isOverlapping(d, f1) ||
    Boolean(f2) && range.isOverlapping(d, f2);
}

function draw(d) {
  r.DrawRectangleRec(d, getDetectorColor(d));
}

module.exports = {
  VERTICAL,
  HORIZONTAL,
  hasDetectorReachedAnyEdge,
  createDetector,
  update,
  draw,
  toggleDetectorMode,
  getNextPosition,
  getDetectorColor,
};