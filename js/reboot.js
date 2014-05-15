// --------------------------------------------------
// REBOOT PAGE BOOTSTRAP
// Set the viewport width and add some support
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

// ------------------------------
// SNAP RESPONSIVENESS

// Snap the viewport to specific widths
function setViewport() {

	// Anything under the threshold will snap to the width
	// Put smaller sizes first so they iterate in correct order
	var snapSizes = [

		// Mobile Screens
		{
			'threshold' : 700,
			'width'     : 320
		},

		// Tablet Screens
		{
			'threshold' : 960,
			'width'     : 760
		},

		// Smaller Desktop Screens
		{
			'threshold' : 1200,
			'width'     : 960
		}

	];

	// Get the screen width based on the orientation of the device
	var landscape   = (Math.abs(window.orientation) == 90 || window.orientation == 270) || false;
	var deviceRatio = window.devicePixelRatio;

	// Use the window width by default
	var screenWidth = $(window).width() * deviceRatio;

	// On a portable device, use the screen width/height
	if (window.orientation !== undefined) {
		screenWidth = window.screen.width * deviceRatio;
		if (landscape) {
			screenWidth = window.screen.height * deviceRatio;
		}
	}

	// Iterate through snapSizes to get the right one
	var viewportWidth = screenWidth;
	$.each(snapSizes, function(index, snap) {
		if (screenWidth < snap.threshold) {
			viewportWidth = snap.width;
			return false;
		}
	});

	// Set the viewport width
	// Your viewport tag MUST have an id attribute set to 'viewport'
	$('meta#viewport').attr('content', 'width=' + viewportWidth);
}

// END SNAP RESPONSIVENESS
// ------------------------------

var reboot_init = function() {

	// Check for Android - because it's all wonky
	var isAndroid = (navigator.userAgent.indexOf("Android") >= 0);

	if (window.self === window.top) {
		// Set the viewport when the window loads

		// Update the viewport when the orientation changes
		if (!isAndroid) {
			$(window).on('load orientationchange', setViewport);
		}
	}
	
	// --------------------------------------------------
	// IE8 COMPATIBILITY

	// Add a last-child class to all last-child elements for compatibility in IE8-
	if (!jQuery.support.leadingWhitespace) {
		$('ul:last-child, ol:last-child, li:last-child, tr:last-child, th:last-child, td:last-child, .column:last-child, .row:last-child').addClass('last-child').css('background-color', '#F00');
	}

	// END IE8 COMPATIBILITY
	// --------------------------------------------------


	// --------------------------------------------------
	// FORM STYLING

	// Make all form elements styleable
	if (jQuery().stylable) {
		$(document).stylable();
	}

	// END FORM STYLING
	// --------------------------------------------------

}