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
	return particlesOverlapping ? raylib.RED : raylib.WHITE;
}

module.exports = {
	hasDetectorReachedAnyEdge, toggleDetectorMode, getNextPosition, getDetectorColor,
};