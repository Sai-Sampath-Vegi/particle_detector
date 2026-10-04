const r = require("raylib");

const range = require("./range");
const detector = require("./detector");

const d1 = {};
const d2 = {};
const d3 = {};

const f1 = {};
const f2 = {};
const f3 = {};

function running() { return !r.WindowShouldClose(); }

function init() {
  d1.leftRange = 0;
  d1.rightRange = r.GetScreenWidth() / 2;
  d1.start = d1.leftRange;
  d1.width = 50;
  d1.velocity = 1;
  d1.particlesOverlapping = false;

  d2.leftRange = r.GetScreenWidth() / 2;
  d2.rightRange = r.GetScreenWidth();
  d2.start = d2.leftRange;
  d2.width = 50;
  d2.velocity = 2;
  d2.particlesOverlapping = false;

  d3.leftRange = 0;
  d3.rightRange = r.GetScreenHeight();
  d3.start = d3.leftRange;
  d3.width = 50;
  d3.velocity = 1;
  d3.particlesOverlapping = false;

  f1.start = 400;
  f1.width = 100;

  f2.start = 600;
  f2.width = 10;

  f3.start = 300;
  f3.width = 30;
}

function setup(width, height, title) {
  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(width, height, title);
  r.SetTargetFPS(120);

  init();
}

function update() {
  detector.update(d1, f1, f2);

  detector.update(d2, f1, f2);

  detector.update(d3, f3);
}

function drawVerticalDetectors() {
  const detectorY = 0;

  r.DrawRectangle(d1.start, detectorY, d1.width, r.GetScreenHeight(), detector.getDetectorColor(d1.particlesOverlapping));
  r.DrawRectangle(d2.start, detectorY, d2.width, r.GetScreenHeight(), detector.getDetectorColor(d2.particlesOverlapping));
}

function drawHorizontalDetectors() {
  const detectorX = 0;

  r.DrawRectangle(detectorX, d3.start, r.GetScreenWidth(), d3.width, detector.getDetectorColor(d3.particlesOverlapping));
}

function drawDetectors() {
  drawVerticalDetectors();

  drawHorizontalDetectors();
}

function drawVerticalParticalFields() {
  const particalFieldsY = 0;

  r.DrawRectangle(f1.start, particalFieldsY, f1.width, r.GetScreenHeight(), r.BLUE);

  r.DrawRectangle(f2.start, particalFieldsY, f2.width, r.GetScreenHeight(), r.BLUE);
}

function drawHorizontalParticalFields() {
  const particalFieldsX = 0;

  r.DrawRectangle(particalFieldsX, f3.start, r.GetScreenWidth(), f3.width, r.BLUE);
}

function drawParticleFields() {
  drawVerticalParticalFields();

  drawHorizontalParticalFields();
}

function draw() {
  r.BeginDrawing();

  r.ClearBackground(r.BLACK);

  drawParticleFields();

  drawDetectors();

  r.EndDrawing();
}

function teardown() { r.CloseWindow(); }

module.exports = {
  running,
  setup,
  update,
  draw,
  teardown,
}
