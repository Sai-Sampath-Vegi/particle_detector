const sketch = require("./sketch");

const WIDTH = 800;
const HEIGHT = 600;
const TITLE = "Particle Detector";

function loop() {
	while (sketch.running()) {
		sketch.update();
		sketch.draw();
	}
}

function main() {
	sketch.setup(WIDTH, HEIGHT, TITLE);
	loop();
	sketch.teardown();
}

main();