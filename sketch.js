const r = require("raylib");

const range = require("./range");
const detector = require("./detector");

function running() { return !r.WindowShouldClose(); }

function init() {
  const world = {};

  world.detectors = {};
  world.fields = {};

  world.detectors.d1 = detector.createDetector(0, 50, r.GetScreenHeight(), 1, r.GetScreenWidth() / 2, detector.VERTICAL);
  world.detectors.d2 = detector.createDetector(r.GetScreenWidth() / 2, 50, r.GetScreenHeight(), 2, r.GetScreenWidth(), detector.VERTICAL);
  world.detectors.d3 = detector.createDetector(0, r.GetScreenWidth(), 50, 1, r.GetScreenHeight(), detector.HORIZONTAL);

  world.fields.f1 = range.createRange(350, 100, r.GetScreenHeight(), range.VERTICAL);
  world.fields.f2 = range.createRange(600, 10, r.GetScreenHeight(), range.VERTICAL);
  world.fields.f3 = range.createRange(300, r.GetScreenWidth(), 30, range.HORIZONTAL);

  return world;
}

function setup(width, height, title) {
  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(width, height, title);
  r.SetTargetFPS(120);

  const world = init();

  return world;
}

function update(world) {
  world = detector.update(world);

  return world;
}

function draw(world) {
  r.BeginDrawing();

  r.ClearBackground(r.BLACK);

  range.draw(world);
  detector.draw(world);

  r.EndDrawing();

  return world;
}

function teardown() { r.CloseWindow(); }

module.exports = {
  running,
  setup,
  update,
  draw,
  teardown,
}
