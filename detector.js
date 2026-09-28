function hasDetectorReachedAnyEdge(start, width, leftRange, rightRange) {
	return ((rightRange - (start + width)) === 0 || (start - leftRange) === 0);
}

function toggleDetectorMode(start, width, leftRange, rightRange, velocity) {
	return hasDetectorReachedAnyEdge(start, width, leftRange, rightRange) ? -velocity : velocity;
}

function getNextPosition(start, velocity) {
	return start + velocity;
}

function getDetectorColor(r, particlesOverlapping) {
	return particlesOverlapping ? r.RED : r.WHITE;
}

module.exports = {
	hasDetectorReachedAnyEdge, toggleDetectorMode, getNextPosition, getDetectorColor,
};