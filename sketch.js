const r = require("raylib");

const range = require("./range");
const detector = require("./detector");

let d1;
let d2;
let d3;

let f1;
let f2;
let f3;

function running() { return !r.WindowShouldClose(); }

function init() {
  d1 = detector.createDetector(0, 50, r.GetScreenHeight(), 1, r.GetScreenWidth() / 2, detector.VERTICAL);
  d2 = detector.createDetector(r.GetScreenWidth() / 2, 50, r.GetScreenHeight(), 2, r.GetScreenWidth(), detector.VERTICAL);
  d3 = detector.createDetector(0, r.GetScreenWidth(), 50, 1, r.GetScreenHeight(), detector.HORIZONTAL);

  f1 = range.createRange(350, 100, r.GetScreenHeight(), range.VERTICAL);
  f2 = range.createRange(600, 10, r.GetScreenHeight(), range.VERTICAL);
  f3 = range.createRange(300, r.GetScreenWidth(), 30, range.HORIZONTAL);
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

function draw() {
  r.BeginDrawing();

  r.ClearBackground(r.BLACK);

  range.draw({ f1, f2, f3 });

  detector.draw({ d1, d2, d3 });

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
