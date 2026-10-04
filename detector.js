const range = require("./range");

function hasDetectorReachedAnyEdge(detector) {
  return ((detector.rightRange - (detector.start + detector.width)) === 0 || (detector.start - detector.leftRange) === 0);
}

function toggleDetectorMode(detector) {
  return hasDetectorReachedAnyEdge(detector) ? -detector.velocity : detector.velocity;
}

function getNextPosition(detector) {
  return detector.start + detector.velocity;
}

function getDetectorColor(raylib, particlesOverlapping) {
  return particlesOverlapping ? raylib.ColorAlpha(raylib.RED, 0.5) : raylib.ColorAlpha(raylib.WHITE, 0.7);
}

function update(d, f1, f2) {
  d.start = getNextPosition(d);
  d.velocity =
    toggleDetectorMode(d);
  d.particlesOverlapping =
    f1 && range.isOverlapping(d, f1) ||
    f2 && range.isOverlapping(d, f2);
}

module.exports = {
  hasDetectorReachedAnyEdge, updateDetector: update, toggleDetectorMode, getNextPosition, getDetectorColor,
};