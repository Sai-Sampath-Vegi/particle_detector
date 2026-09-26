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

const detectorThreeLeftRangeY = 0;
const detectorThreeRightRangeY = windowHeight;

let detectorOneX = detectorOneLeftRangeX;
let detectorTwoX = detectorTwoLeftRangeX;
let detectorThreeY = detectorThreeLeftRangeY;

const detectorOneWidth = 50;
const detectorTwoWidth = 50;

const detectorThreeWidth = windowWidth;
const detectorThreeHeight = 20;

const particleFieldColor = r.BLUE;

const SCAN_LEFT = "SCAN LEFT REGION";
const SCAN_RIGHT = "SCAN RIGHT REGION";

const particleFieldOneWidth = 100;
const particleFieldOneX = getHalf(windowWidth) - particleFieldOneWidth;

const particleFieldTwoWidth = 10;
const particleFieldTwoX = getHalf(windowWidth) + particleFieldOneWidth;

const particleFieldThreeHeight = 10;
const particleFieldThreeY = getHalf(windowHeight) - particleFieldThreeHeight;

let detectorOneMode = SCAN_RIGHT;
let detectorTwoMode = SCAN_RIGHT;
let detectorThreeMode = SCAN_RIGHT;

let areParticlesOverlappingDetectorOne = false;
let areParticlesOverlappingDetectorTwo = false;
let areParticlesOverlappingDetectorThree = false;

function hasDetectorReachedLeftEdge(detectorLeft, detectorLeftRange, detectorMode, detectorSpeed) {
	return ((detectorMode === SCAN_LEFT) && ((detectorLeft - detectorLeftRange) <= detectorSpeed));
}

function hasDetectorReachedRightEdge(detectorLeft, detectorWidth, detectorRightRange, detectorMode, detectorSpeed) {
	return ((detectorMode === SCAN_RIGHT) && ((detectorRightRange - (detectorLeft + detectorWidth)) <= detectorSpeed));
}

function getToggledDetectorMode(detectorMode) {
	return detectorMode === SCAN_LEFT ? SCAN_RIGHT : SCAN_LEFT;
}

function hasDetectorReachedAnyEdge(detectorLeft, detectorWidth, detectorLeftRange, detectorRightRange, detectorMode, detectorSpeed) {
	return hasDetectorReachedRightEdge(detectorLeft, detectorWidth, detectorRightRange, detectorMode, detectorSpeed) || hasDetectorReachedLeftEdge(detectorLeft, detectorLeftRange, detectorMode, detectorSpeed);
}

function getRangeLeftEdge(particleLeft) {
	return particleLeft;
}

function getRangeRightEdge(particleLeft, particleWidth) {
	return particleLeft + particleWidth;
}

function areRangeEdgesOverlapping(rangeOneLeft, rangeTwoLeftEdge, rangeTwoRightEdge) {
	return ((rangeOneLeft >= rangeTwoLeftEdge) && (rangeOneLeft <= rangeTwoRightEdge));
}

function isOverlapping(rangeOneLeftEdge, rangeOneRightEdge, rangeTwoLeft, rangeTwoRight) {
	return (areRangeEdgesOverlapping(rangeOneLeftEdge, rangeTwoLeft, rangeTwoRight) || areRangeEdgesOverlapping(rangeOneRightEdge, rangeTwoLeft, rangeTwoRight));
}

function areRangesOverlapping(rangeOneLeft, rangeOneWidth, rangeTwoLeft, rangeTwoWidth) {
	let rangesOverlapping = true;

	const rangeOneLeftEdge = getRangeLeftEdge(rangeOneLeft);
	const rangeOneRightEdge = getRangeRightEdge(rangeOneLeft, rangeOneWidth);

	const rangeTwoLeftEdge = getRangeLeftEdge(rangeTwoLeft);
	const rangeTwoRightEdge = getRangeRightEdge(rangeTwoLeft, rangeTwoWidth);

	if (rangeTwoWidth >= rangeOneWidth) {
		if (!isOverlapping(rangeOneLeftEdge, rangeOneRightEdge, rangeTwoLeftEdge, rangeTwoRightEdge)) {
			rangesOverlapping = false;
		}
	} else {
		if (!isOverlapping(rangeTwoLeftEdge, rangeTwoRightEdge, rangeOneLeftEdge, rangeOneRightEdge)) {
			rangesOverlapping = false;
		}
	}

	return rangesOverlapping;
}

function getDetectorNextPosition(detectorLeft, detectorWidth, windowWidth, detectorMode, detectorSpeed) {
	let detectorNextPosition;

	if (!hasDetectorReachedRightEdge(detectorLeft, detectorWidth, windowWidth, detectorMode) && detectorMode === SCAN_RIGHT) {
		detectorNextPosition = detectorLeft + detectorSpeed;
	}

	if (!hasDetectorReachedLeftEdge(detectorLeft, detectorMode) && detectorMode === SCAN_LEFT) {
		detectorNextPosition = detectorLeft - detectorSpeed;
	}

	return detectorNextPosition;
}

function update() {
	const detectorOneSpeed = 1;
	const detectorTwoSpeed = 2;
	const detectorThreeSpeed = 1;

	if (hasDetectorReachedAnyEdge(detectorOneX, detectorOneWidth, detectorOneLeftRangeX, detectorOneRightRangeX, detectorOneMode, detectorOneSpeed)) {
		detectorOneMode = getToggledDetectorMode(detectorOneMode);
	}

	if (hasDetectorReachedAnyEdge(detectorTwoX, detectorTwoWidth, detectorTwoLeftRangeX, detectorTwoRightRangeX, detectorTwoMode, detectorTwoSpeed)) {
		detectorTwoMode = getToggledDetectorMode(detectorTwoMode);
	}

	if (hasDetectorReachedAnyEdge(detectorThreeY, detectorThreeHeight, detectorThreeLeftRangeY, detectorThreeRightRangeY, detectorThreeMode, detectorThreeSpeed)) {
		detectorThreeMode = getToggledDetectorMode(detectorThreeMode);
	}

	detectorOneX = getDetectorNextPosition(detectorOneX, detectorOneWidth, getHalf(windowWidth), detectorOneMode, detectorOneSpeed);
	detectorTwoX = getDetectorNextPosition(detectorTwoX, detectorTwoWidth, windowWidth, detectorTwoMode, detectorTwoSpeed);
	detectorThreeY = getDetectorNextPosition(detectorThreeY, detectorThreeHeight, windowHeight, detectorThreeMode, detectorThreeSpeed);

	areParticlesOverlappingDetectorOne = areRangesOverlapping(detectorOneX, detectorOneWidth, particleFieldOneX, particleFieldOneWidth) || areRangesOverlapping(detectorOneX, detectorOneWidth, particleFieldTwoX, particleFieldTwoWidth);
	areParticlesOverlappingDetectorTwo = areRangesOverlapping(detectorTwoX, detectorTwoWidth, particleFieldOneX, particleFieldOneWidth) || areRangesOverlapping(detectorTwoX, detectorTwoWidth, particleFieldTwoX, particleFieldTwoWidth);
	areParticlesOverlappingDetectorThree = areRangesOverlapping(detectorThreeY, detectorThreeHeight, particleFieldThreeY, particleFieldThreeHeight);
}

function getDetectorColorBasedOnOverlapping(areParticlesOverlappingEachother) {
	return areParticlesOverlappingEachother ? r.RED : r.WHITE;
}

function drawDetectors() {
	const detectorX = 0;
	const detectorY = 0;

	r.DrawRectangle(detectorOneX, detectorY, detectorOneWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingDetectorOne));

	r.DrawRectangle(detectorTwoX, detectorY, detectorTwoWidth, windowHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingDetectorTwo));

	r.DrawRectangle(detectorX, detectorThreeY, detectorThreeWidth, detectorThreeHeight, getDetectorColorBasedOnOverlapping(areParticlesOverlappingDetectorThree));
}

function drawParticleFields() {
	const particleFieldX = 0;
	const particleFieldY = 0;

	r.DrawRectangle(particleFieldOneX, particleFieldY, particleFieldOneWidth, windowHeight, particleFieldColor);

	r.DrawRectangle(particleFieldTwoX, particleFieldY, particleFieldTwoWidth, windowHeight, particleFieldColor);

	r.DrawRectangle(particleFieldX, particleFieldThreeY, windowWidth, particleFieldThreeHeight, particleFieldColor);
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