DEFAULT_ANCHOR = {
	'verticalAlign': 'top',
	'horizontalAlign': 'left'
};

function getAnchorOffset(element, anchor) {
	var top = 0;
	var left = 0;
	if (anchor) {
		switch (anchor.verticalAlign) {
			case 'middle':
				top += Math.round(element.height() / 2);
			case 'bottom':
			    top += element.height();
		} // otherwise threat as 'top'
		switch (anchor.horizontalAlign) {
			case 'center':
			    left += Math.round(element.width() / 2);
			case 'right':
			    left += element.width();
		} // Otherwise treat as 'left'
	}
	return {'left': left, 'top': top}
}

function alignUnit(unit) {
    var $unit = $(unit);
    var anchor = $unit.data('anchor');
    var offset = getAnchorOffset($unit, anchor);
    $unit.css({
    	left: anchor.left - offset.left,
    	top: anchor.top - offset.top,
    })
}

function updateAnchor(unit) {
	var $unit = $(unit);
	var anchor = $unit.data('anchor');
	if (!anchor)
		anchor = $.extend({}, DEFAULT_ANCHOR);
	var offset = getAnchorOffset($unit, anchor);
	var position = $unit.position();
	anchor.left = position.left + offset.left;
	anchor.top = position.top + offset.top;
	$unit.data('anchor', anchor);
}