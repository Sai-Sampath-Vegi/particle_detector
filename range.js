function getRangeLeftEdge(start) {
	return start;
}

function getRangeRightEdge(start, width) {
	return start + width;
}

function isOverlapping(rangeOneStart, rangeOneWidth, rangeTwoStart, rangeTwoWidth) {
	const rangeOneRight = getRangeRightEdge(rangeOneStart, rangeOneWidth);
	const rangeTwoRight = getRangeRightEdge(rangeTwoStart, rangeTwoWidth);

	return !((rangeOneStart > rangeTwoRight) || (rangeOneRight <= rangeTwoStart));
}

module.exports = {
	isOverlapping,
};