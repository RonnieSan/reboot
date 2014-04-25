// --------------------------------------------------
// REBOOT MODAL PLUGIN
// Create stylable modals
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

;(function($) {

	$.modal = function(options) {

		// Create a new modal instance
		var modal = {};

		// Create and make a reference to the modals array
		var $doc = $(document);
		if (!$doc.data('modals')) {
			$doc.data('modals', []);
		}
		var modals = $doc.data('modals');

		// Get the index based on the size of the modals array
		modal.index = modals.length;
		modal.settings = $.extend({

			// Default Options
			'closable'       : true,
			'closeButton'    : '<div class="close close-btn"><i class="re-x"></i></div>',
			'content'        : false,
			'easing'         : ['easeOutExpo', 'easeInExpo'],
			'fadeInSpeed'    : 1000,
			'formData'       : {},
			'height'         : false,
			'iFrameEl'       : '.wrapper',
			'left'           : false,
			'method'         : 'GET',
			'modalID'        : false,
			'resizeSpeed'    : 350,
			'scrollable'     : false,
			'top'            : 80,
			'type'           : 'inline',
			'width'          : false,
			'url'            : false

			// Events
			// 'open'         : function() {},
			// 'ready'        : function() {},
			// 'close'        : function() {},
			// 'closed'       : function() {}

		}, options);

		// Get or set the modal ID
		modal.id = modal.settings.modalID || 'modal-' + modal.index;

		// Create the wrapper element
		modal.wrapper = $('<div class="modal-wrapper"></div>');

		// Apply some settings to the wrapper element
		if (modal.settings.scrollable) {
			modal.wrapper.css('overflow', 'auto');
		}

		// Set the initial width and height of the modal
		if (modal.settings.width === false) {
			modal.wrapper.width(500);
		}
		if (modal.settings.height === false) {
			modal.wrapper.height(300);
		}

		// Add the close button to the modal
		if (modal.settings.closable) {
			$(modal.settings.closeButton)
				.prependTo(modal.wrapper)
				.on('click', function() {
					modal.close();
				});
		}

		// Prevent a click in the modal to trigger a click on the container
		modal.wrapper.on('click', function(event) {
			event.stopPropagation();
		});

		// Load the content into the modal
		switch (modal.settings.type) {

			// Call the content from an inline object
			case 'inline':

				// Append the content to the modal
				modal.content = $(modal.settings.content);

				// Append the content to the modal
				modal.wrapper.append(modal.content);

				break;

			case 'ajax':

				// Create the loading graphic
				modal.loader = $('<div class="loader"></div>')
					.appendTo(modal.wrapper);

				// Animate the loader
				if ($().zoetrope) {
					console.log('zoe');
					modal.loader.zoetrope({
						'frames' : 8,
						'offset' : 80,
						'speed'  : 50
					});
				}

				// Add a loading class
				modal.wrapper.addClass('loading');

				// Send an AJAX request to a URL
				$.ajax({
					'type'  : modal.settings.method,
					'url'   : modal.settings.url,
					'data'  : modal.settings.formData,
					'async' : false,

					'success' : function(response) {
						modal.content = $('<div>' + response + '</div>');

						// Remove the loading class
						modal.wrapper.removeClass('loading');
						modal.loader.zoetrope('destroy').remove();

						// Append the content to the modal
						modal.wrapper.append(modal.content);
					},

					'error' : function() {
						modal.content = $('<p>Unable to retrieve content...</p>');

						// Remove the loading class
						modal.wrapper.removeClass('loading');
						modal.loader.zoetrope('destroy');

						// Append the content to the modal
						modal.wrapper.append(modal.content);
					}
				});

				break;

			case 'iframe':

				// Create the loading graphic
				modal.loader = $('<div class="loader"></div>')
					.appendTo(modal.wrapper);

				// Animate the loader
				if ($().zoetrope) {
					console.log('zoe');
					modal.loader.zoetrope({
						'frames' : 8,
						'offset' : 80,
						'speed'  : 50
					});
				}

				// Add a loading class
				modal.wrapper.addClass('loading');

				// Create the iframe
				modal.content = $('<iframe id="' + modal.id + '--iframe" class="modal-iframe" name="' + modal.id + '--content" src="' + modal.settings.url + '" width="100%" height="100%" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" />')
					.css({
						'display'        : 'block',
						'vertical-align' : 'bottom'
					});

				// Append the content to the modal
				modal.wrapper.append(modal.content);

				modal.content.load(function() {

					// Remove the loading class
					modal.wrapper.removeClass('loading');
					modal.loader.zoetrope('destroy');
					modal.loader.remove();

					modal.content.contents().find('.close')
						.on('click', function() {
							modal.close.call(modal);
						});

					// Set a reference to the parent modal in the iframe
					modal.content.contentWindow.parentModal = modal;

					// Update the height of the iframe
					if (modal.settings.height === false) {
						modal.content.contents().find(modal.settings.iFrameEl).on('resize', function() {
							modal.fit.call(modal);
						});
					}

					// Fade in the iFrame
					modal.content.animate({'opacity' : 1}, 100);
				});

				break;

		}

		// Clicking anything in the modal with the .close class will close the modal
		if (modal.settings.type !== 'iframe') {
			modal.content.find('.close')
				.on('click', function() {
					methods.close.call(modal);
				});
		}

		// --------------------------------------------------
		// METHODS

		// Resize the modal to a specific measurement
		modal.resize = function(options, callback) {

			var newSize = {};

			// Set the new dimensions
			if (options.width) newSize.maxWidth = options.width;
			if (options.height) {
				newSize.height = options.height;
			} else {
				if (modal.settings.type == 'iframe' && modal.content.contents()) {
					newSize.height = modal.content.contents().height() + 'px';
				} else {
					newSize.height = 'auto';
				}
			}

			if (typeof callback !== 'function') {
				callback = function() {};
			}

			speed = options.speed || modal.settings.resizeSpeed;

			// Animate to the new size
			if (modal.settings.type === 'iframe') {
				modal.content.css(newSize);
			}
			modal.wrapper.animate(newSize, speed, 'easeOutQuint', callback);

			// Return modal to make it chainable
			return modal;

		};

		// Resize the modal to fit the contents
		modal.fit = function(fitWidth, el, callback) {

			// Set the dimensions
			var dimensions = {};
			if (modal.settings.type == 'iframe') {
				// Resize the iframe width and height
				fitWidth  = modal.content.contents().find(iFrameEl).width() + 'px';
				fitHeight = modal.content.contents().find(iFrameEl).height() + 'px';
			} else {
				fitWidth  = modal.content.width() + 'px';
				fitHeight = modal.content.height() + 'px';
			}

			dimensions.height = fitHeight;
			if (fitWidth) {
				dimensions.maxWidth = fitWidth;
			}

			// Call the resize function with our new dimensions
			modal.resize(dimensions, callback);

			// Return modal to make it chainable
			return modal;

		};

		// Open the modal
		modal.open = function() {

			if (typeof modal.settings.open === 'function') {
				modal.settings.open.call(modal);
			}

			// Create the overlay and modal container
			modal.overlay   = $('<div class="modal-overlay"></div>');
			modal.container = $('<div class="modal-container"></div>');

			// Make clicking on the container close the modal
			if (modal.settings.closable) {
				modal.container.on('click', function() {
					modal.close();
				});
			}

			// Set what layer the modal should be on
			var layers = $('.modal-wrapper.open').length,
				layer  = layers * 10 + 1000;

			// Make the modal closable
			if (modal.settings.closable) {
				$(document).on('keyup', function(event) {
					// Create a reference to the function so we can unbind it later
					modal.keyupFn = arguments.callee;

					var keycode = event.keyCode || event.which;
					if (keycode == 27) {
						if (modal.overlay.is(':visible')) {
							modal.close();
						}
					}
				});
			}

			// Reset the top margin
			var dropSpot = modal.settings.top - 30;
			if ($(window).width() < 700) {
				dropSpot = -20;
			}
			modal.wrapper.css('margin-top', dropSpot + 'px');

			// Set the layers for the overlay and the container
			modal.container.css('z-index', layer);
			modal.overlay.css('z-index', layer - 10);

			// Append the modal to the container
			modal.container.append(modal.wrapper);

			// Append the overlay and container to the body
			$('body').append(modal.overlay).append(modal.container);

			// Keep the background from scrolling
			document.body.style.overflow = 'hidden';

			// Set the size of the modal
			resizeOptions = {
				'speed' : 0
			};
			resizeOptions.height = modal.settings.height || modal.content.height();
			resizeOptions.width = modal.settings.width || modal.content.width();
			modal.resize(resizeOptions);

			// Fade in the overlay
			if ($('.modal-overlay:visible').length > 0) {
				$('.modal-overlay:visible').hide();
				modal.overlay.show();
				modal.overlay.css('z-index', layer - 10);
			} else {
				modal.overlay.fadeIn(100, function() {
					// We gots to do this for FireFox
					if (modal.settings.type === 'iframe' && modal.content.contents()) {
						modal.wrapper.height(modal.content.contents().height());
					}
				});
			}

			// Add the 'open' class
			modal.wrapper.addClass('open');
			modal.overlay.addClass('open');

			// Fade in the modal window
			modal.wrapper
				.delay(100)
				.animate({
						'opacity'    : 1,
						'margin-top' : '+=30'
					},
					modal.settings.fadeInSpeed,
					modal.settings.easing[0],
					function() {
						// Fire the ready callback
						if (typeof modal.settings.ready === 'function') {
							modal.settings.ready.call(modal);
						}
					});

			// Return modal to make it chainable
			return modal;

		};

		modal.close = function() {

			// Fire the close callback
			if (typeof modal.settings.close === 'function') {
				modal.settings.close.call(modal);
			}

			// Unbind the keyup function
			$(document).off('keyup', modal.keyupFn);

			// Drop the modal
			modal.wrapper
				.stop(true, true)
				.animate({
						'opacity'    : 0,
						'margin-top' : '+=30'
					},
					modal.settings.fadeInSpeed / 2,
					modal.settings.easing[1],
					function() {
						modal.wrapper.removeClass('open');
						modal.overlay.removeClass('open');
						modal.container.remove();

						// Remove the overlay and container
						if ($('.modal-overlay.open').length > 0) {
							$('.modal-overlay.open').last().fadeIn(50);
						}
						modal.overlay.fadeOut(250, function() {
							modal.overlay.remove();
						});

						// Fire the closed callback
						if (typeof modal.settings.closed === 'function') {
							modal.settings.closed.call(modal);
						}

						// Make the body scrollable again
						if ($('.modal-overlay.open').length === 0) {
							document.body.style.overflow = '';
						}
					});

			// Return modal to make it chainable
			return modal;

		};

		// END METHODS
		// --------------------------------------------------

		// Add the modal to the modals array
		$(document).data('modals').push(modal);

		// Return the modal for further use
		return modal;

	};

})(jQuery);