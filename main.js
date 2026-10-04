const sketch = require("./sketch");

const WIDTH = 800;
const HEIGHT = 600;
const TITLE = "Particle Detector";

function loop(world) {
  while (sketch.running()) {
    world = sketch.update(world);
    world = sketch.draw(world);
  }

  return world;
}

function main() {
  let world = sketch.setup(WIDTH, HEIGHT, TITLE);

  world = loop(world);

  sketch.teardown();
}

main();
