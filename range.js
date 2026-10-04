const r = require("raylib");

const VERTICAL = 0;
const HORIZONTAL = 1;

function getRangeEnd(range) {
  return (range.direction === VERTICAL ? range.x : range.y) + (range.direction === VERTICAL ? range.width : range.height);
}

function isOverlapping(rangeOne, rangeTwo) {
  const rangeOneEnd = getRangeEnd(rangeOne);
  const rangeTwoEnd = getRangeEnd(rangeTwo);

  const rangeOneStart = (rangeOne.direction === VERTICAL ? rangeOne.x : rangeOne.y);
  const rangeTwoStart = (rangeTwo.direction === VERTICAL ? rangeTwo.x : rangeTwo.y);

  return !((rangeOneStart > rangeTwoEnd) || (rangeOneEnd <= rangeTwoStart));
}

function createRange(start, width, height, direction) {
  return {
    x: direction === VERTICAL ? start : 0,
    y: direction === HORIZONTAL ? start : 0,
    width,
    height,
    color: r.BLUE,
    direction,
  };
}

function drawParticleField(range) {
  r.DrawRectangleRec(range, range.color);
}

function draw(world) {
  drawParticleField(world.f1);
  drawParticleField(world.f2);
  drawParticleField(world.f3);
}

module.exports = {
  VERTICAL,
  HORIZONTAL,
  isOverlapping,
  createRange,
  draw,
};