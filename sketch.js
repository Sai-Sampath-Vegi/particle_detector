const r = require("raylib");

const windowWidth = 800;
const windowHeight = 600;
const windowTitle = "Particle Detector";

const detectorWidth = 50;

const FPS = 60;

function running() { return !r.WindowShouldClose(); }

function setup() {
	r.InitWindow(windowWidth, windowHeight, windowTitle);
	r.SetTargetFPS(FPS);
}

let detectorX = 0;
const detectorY = 0;

const SCAN_LEFT = "SCAN LEFT REGION";
const SCAN_RIGHT = "SCAN RIGHT REGION";

let detectorMode = SCAN_RIGHT;

function hasDetectorReachedLeftEdge(detectorX, detectorMode) {
	return ((detectorMode === SCAN_LEFT) && (detectorX === 0));
}

function hasDetectorReachedRightEdge(detectorX, detectorWidth, windowWidth, detectorMode) {
	return ((detectorMode === SCAN_RIGHT) && ((detectorX + detectorWidth) === windowWidth));
}

function getToggledDetectorMode(detectorMode) {
	return detectorMode === SCAN_LEFT ? SCAN_RIGHT : SCAN_LEFT;
}

function hasDetectorReachedAnyEdge(detectorX, detectorWidth, windowWidth, detectorMode) {
	return hasDetectorReachedRightEdge(detectorX, detectorWidth, windowWidth, detectorMode) || hasDetectorReachedLeftEdge(detectorX, detectorMode);
}

function update() {
	if (hasDetectorReachedAnyEdge(detectorX, detectorWidth, windowWidth, detectorMode)) {
		detectorMode = getToggledDetectorMode(detectorMode);
	}

	if (!hasDetectorReachedRightEdge(detectorX, detectorWidth, windowWidth, detectorMode) && detectorMode === SCAN_RIGHT) {
		detectorX++;
	}

	if (!hasDetectorReachedLeftEdge(detectorX, detectorMode) && detectorMode === SCAN_LEFT) {
		detectorX--;
	}
}

function draw() {
	r.BeginDrawing();

	r.ClearBackground(r.BLACK);
	r.DrawRectangle(detectorX, detectorY, detectorWidth, windowHeight, r.WHITE);

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