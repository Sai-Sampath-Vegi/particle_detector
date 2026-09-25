const r = require("raylib");

const windowWidth = 800;
const windowHeight = 600;
const windowTitle = "Particle Detector";

const FPS = 60;

function running() { return !r.WindowShouldClose(); }

function setup() {
	r.InitWindow(windowWidth, windowHeight, windowTitle);
	r.SetTargetFPS(FPS);
}

let detectorX = 0;
const detectorY = 0;

const detectorWidth = 50;

const SCAN_LEFT = "SCAN LEFT REGION";
const SCAN_RIGHT = "SCAN RIGHT REGION";

const particleFieldWidth = 10;

const particleFieldX = windowWidth / 2 - particleFieldWidth;
const particleFieldY = 0;

let detectorMode = SCAN_RIGHT;
let areParticlesOverlappingEachother = false;

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

function getParticleLeftEdgeX(particleX) {
	return particleX;
}

function getParticleRightEdgeX(particleX, particleWidth) {
	return particleX + particleWidth;
}

function areParticleEdgesOverlappingEachother(particleOneX, particleTwoLeftEdgeX, particleTwoRightEdgeX) {
	return ((particleOneX >= particleTwoLeftEdgeX) && (particleOneX <= particleTwoRightEdgeX));
}

function areParticlesOverlapping(detectorX, detectorWidth, particleFieldX, particleFieldWidth) {
	let particlesOverlapping = true;

	const detectorLeftEdgeX = getParticleLeftEdgeX(detectorX);
	const detectorRightEdgeX = getParticleRightEdgeX(detectorX, detectorWidth);

	const particleFieldLeftX = getParticleLeftEdgeX(particleFieldX);
	const particleFieldRightX = getParticleRightEdgeX(particleFieldX, particleFieldWidth);

	if (!areParticleEdgesOverlappingEachother(detectorLeftEdgeX, particleFieldLeftX, particleFieldRightX) && !areParticleEdgesOverlappingEachother(detectorRightEdgeX, particleFieldLeftX, particleFieldRightX)) {
		particlesOverlapping = false;
	}

	return particlesOverlapping;
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

	if (particleFieldWidth >= detectorWidth) {
		areParticlesOverlappingEachother = areParticlesOverlapping(detectorX, detectorWidth, particleFieldX, particleFieldWidth);
	} else {
		areParticlesOverlappingEachother = areParticlesOverlapping(particleFieldX, particleFieldWidth, detectorX, detectorWidth);
	}
}

function getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother) {
	return areParticlesOverlappingEachother ? r.RED : r.WHITE;
}

function draw() {
	r.BeginDrawing();

	r.ClearBackground(r.BLACK);

	r.DrawRectangle(particleFieldX, particleFieldY, particleFieldWidth, windowHeight, r.BLUE);

	r.DrawRectangle(detectorX, detectorY, detectorWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother));

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