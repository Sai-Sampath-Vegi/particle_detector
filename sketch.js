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

function getHalf(x) { return x / 2; }

const detectorOneLeftRangeX = 0;
const detectorOneRightRangeX = getHalf(windowWidth);

const detectorTwoLeftRangeX = getHalf(windowWidth);
const detectorTwoRightRangeX = windowWidth;

let detectorOneX = detectorOneLeftRangeX;
let detectorTwoX = detectorTwoLeftRangeX;

const detectorOneWidth = 50;
const detectorTwoWidth = 50;

const detectorOneSpeed = 1;
const detectorTwoSpeed = 2;

const SCAN_LEFT = "SCAN LEFT REGION";
const SCAN_RIGHT = "SCAN RIGHT REGION";

const particleFieldOneWidth = 100;
const particleFieldOneX = getHalf(windowWidth) - particleFieldOneWidth;

const particleFieldTwoWidth = 10;
const particleFieldTwoX = getHalf(windowWidth) + particleFieldOneWidth;

let detectorOneMode = SCAN_RIGHT;
let detectorTwoMode = SCAN_RIGHT;

let areParticlesOverlappingDetectorOne = false;
let areParticlesOverlappingDetectorTwo = false;

function hasDetectorReachedLeftEdge(detectorX, detectorLeftRangeX, detectorMode, detectorSpeed) {
	return ((detectorMode === SCAN_LEFT) && ((detectorX - detectorLeftRangeX) <= detectorSpeed));
}

function hasDetectorReachedRightEdge(detectorX, detectorWidth, detectorRightRangeX, detectorMode, detectorSpeed) {
	return ((detectorMode === SCAN_RIGHT) && ((detectorRightRangeX - (detectorX + detectorWidth)) <= detectorSpeed));
}

function getToggledDetectorMode(detectorMode) {
	return detectorMode === SCAN_LEFT ? SCAN_RIGHT : SCAN_LEFT;
}

function hasDetectorReachedAnyEdge(detectorX, detectorWidth, detectorLeftRangeX, detectorRightRangeX, detectorMode, detectorSpeed) {
	return hasDetectorReachedRightEdge(detectorX, detectorWidth, detectorRightRangeX, detectorMode, detectorSpeed) || hasDetectorReachedLeftEdge(detectorX, detectorLeftRangeX, detectorMode, detectorSpeed);
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

function getDetectorNextX(detectorX, detectorWidth, windowWidth, detectorMode, detectorSpeed) {
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
	if (hasDetectorReachedAnyEdge(detectorOneX, detectorOneWidth, detectorOneLeftRangeX, detectorOneRightRangeX, detectorOneMode, detectorOneSpeed)) {
		detectorOneMode = getToggledDetectorMode(detectorOneMode);
	}

	if (hasDetectorReachedAnyEdge(detectorTwoX, detectorTwoWidth, detectorTwoLeftRangeX, detectorTwoRightRangeX, detectorTwoMode, detectorTwoSpeed)) {
		detectorTwoMode = getToggledDetectorMode(detectorTwoMode);
	}

	detectorOneX = getDetectorNextX(detectorOneX, detectorOneWidth, getHalf(windowWidth), detectorOneMode, detectorOneSpeed);
	detectorTwoX = getDetectorNextX(detectorTwoX, detectorTwoWidth, windowWidth, detectorTwoMode, detectorTwoSpeed);

	areParticlesOverlappingDetectorOne = areParticlesOverlapping(detectorOneX, detectorOneWidth, particleFieldOneX, particleFieldOneWidth) || areParticlesOverlapping(detectorOneX, detectorOneWidth, particleFieldTwoX, particleFieldTwoWidth);
	areParticlesOverlappingDetectorTwo = areParticlesOverlapping(detectorTwoX, detectorTwoWidth, particleFieldOneX, particleFieldOneWidth) || areParticlesOverlapping(detectorTwoX, detectorTwoWidth, particleFieldTwoX, particleFieldTwoWidth);
}

function getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother) {
	return areParticlesOverlappingEachother ? r.RED : r.WHITE;
}

function drawDetectors() {
	const detectorY = 0;

	r.DrawRectangle(detectorOneX, detectorY, detectorOneWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingDetectorOne));

	r.DrawRectangle(detectorTwoX, detectorY, detectorOneWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingDetectorTwo));
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