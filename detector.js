function hasDetectorReachedAnyEdge(detector) {
	return ((detector.rightRange - (detector.start + detector.width)) === 0 || (detector.start - detector.leftRange) === 0);
}

function toggleDetectorMode(detector) {
	return hasDetectorReachedAnyEdge(detector) ? -detector.velocity : detector.velocity;
}

function getNextPosition(detector) {
	return detector.start + detector.velocity;
}

function getDetectorColor(raylib, particlesOverlapping) {
	return particlesOverlapping ? raylib.ColorAlpha(raylib.RED, 0.5) : raylib.ColorAlpha(raylib.WHITE, 0.7);
}

module.exports = {
	hasDetectorReachedAnyEdge, toggleDetectorMode, getNextPosition, getDetectorColor,
};