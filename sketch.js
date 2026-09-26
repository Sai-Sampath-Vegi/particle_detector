const r = require("raylib");

const windowWidth = 800;
const windowHeight = 600;
const windowTitle = "Particle Detector";

const FPS = 120;

function running() { return !r.WindowShouldClose(); }

function setup() {
	r.InitWindow(windowWidth, windowHeight, windowTitle);
	r.SetTargetFPS(FPS);
}

let detectorX = 0;

const detectorWidth = 50;

const detectorSpeed = 1;

const SCAN_LEFT = "SCAN LEFT REGION";
const SCAN_RIGHT = "SCAN RIGHT REGION";

const particleFieldOneWidth = 100;
const particleFieldOneX = windowWidth / 2 - particleFieldOneWidth;

const particleFieldTwoWidth = 10;
const particleFieldTwoX = windowWidth / 2 + particleFieldOneWidth;

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

function areParticleEdgesOverlapping(particleOneX, particleTwoLeftEdgeX, particleTwoRightEdgeX) {
	return ((particleOneX >= particleTwoLeftEdgeX) && (particleOneX <= particleTwoRightEdgeX));
}

function isOverlapping(particleOneLeftEdgeX, particleOneRightEdgeX, particleTwoLeftX, particleTwoRightX) {
	return (areParticleEdgesOverlapping(particleOneLeftEdgeX, particleTwoLeftX, particleTwoRightX) || areParticleEdgesOverlapping(particleOneRightEdgeX, particleTwoLeftX, particleTwoRightX));
}

function areParticlesOverlapping(detectorX, detectorWidth, particleFieldX, particleFieldWidth) {
	let particlesOverlapping = true;

	const detectorLeftEdgeX = getParticleLeftEdgeX(detectorX);
	const detectorRightEdgeX = getParticleRightEdgeX(detectorX, detectorWidth);

	const particleFieldLeftX = getParticleLeftEdgeX(particleFieldX);
	const particleFieldRightX = getParticleRightEdgeX(particleFieldX, particleFieldWidth);

	if (particleFieldWidth >= detectorWidth) {
		if (!isOverlapping(detectorLeftEdgeX, detectorRightEdgeX, particleFieldLeftX, particleFieldRightX)) {
			particlesOverlapping = false;
		}
	} else {
		if (!isOverlapping(particleFieldLeftX, particleFieldRightX, detectorLeftEdgeX, detectorRightEdgeX)) {
			particlesOverlapping = false;
		}
	}

	return particlesOverlapping;
}

function getDetectorNextX(detectorX, detectorWidth, windowWidth, detectorMode) {
	let detectorNextX;

	if (!hasDetectorReachedRightEdge(detectorX, detectorWidth, windowWidth, detectorMode) && detectorMode === SCAN_RIGHT) {
		detectorNextX = detectorX + detectorSpeed;
	}

	if (!hasDetectorReachedLeftEdge(detectorX, detectorMode) && detectorMode === SCAN_LEFT) {
		detectorNextX = detectorX - detectorSpeed;
	}

	return detectorNextX;
}

function update() {
	if (hasDetectorReachedAnyEdge(detectorX, detectorWidth, windowWidth, detectorMode, detectorSpeed)) {
		detectorMode = getToggledDetectorMode(detectorMode);
	}

	detectorX = getDetectorNextX(detectorX, detectorWidth, windowWidth, detectorMode);

	areParticlesOverlappingEachother = areParticlesOverlapping(detectorX, detectorWidth, particleFieldOneX, particleFieldOneWidth) || areParticlesOverlapping(detectorX, detectorWidth, particleFieldTwoX, particleFieldTwoWidth);
}

function getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother) {
	return areParticlesOverlappingEachother ? r.RED : r.WHITE;
}

function drawDetector() {
	const detectorY = 0;
	r.DrawRectangle(detectorX, detectorY, detectorWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother));
}

function drawParticleFields() {
	const particleFieldY = 0;

	r.DrawRectangle(particleFieldOneX, particleFieldY, particleFieldOneWidth, windowHeight, r.BLUE);

	r.DrawRectangle(particleFieldTwoX, particleFieldY, particleFieldTwoWidth, windowHeight, r.BLUE);
}

function draw() {
	r.BeginDrawing();

	r.ClearBackground(r.BLACK);

	drawParticleFields();

	drawDetector();

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