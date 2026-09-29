function getRangeRightEdge(range) {
	return range.start + range.width;
}

function isOverlapping(rangeOne, rangeTwo) {
	const rangeOneRight = getRangeRightEdge(rangeOne);
	const rangeTwoRight = getRangeRightEdge(rangeTwo);

	return !((rangeOne.start > rangeTwoRight) || (rangeOneRight <= rangeTwo.start));
}

module.exports = {
	isOverlapping,
};