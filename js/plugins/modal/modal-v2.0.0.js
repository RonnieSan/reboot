// --------------------------------------------------
// REBOOT MODAL PLUGIN
// Create stylable modals
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

;/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

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
			'autoResize'      : true,
			'closable'        : true,
			'closeButton'     : '<div class="close close-btn"><i class="re-x"></i></div>',
			'content'         : false,
			'easing'          : ['easeOutExpo', 'easeInExpo'],
			'formData'        : {},
			'height'          : false,
			'iFrameEl'        : '.wrapper',
			'left'            : false,
			'method'          : 'GET',
			'modalID'         : false,
			'overlayOpacity'  : 0.65,
			'resizeSpeed'     : 350,
			'scrollable'      : false,
			'top'             : 80,
			'transitionSpeed' : 500,
			'type'            : 'inline',
			'width'           : false,
			'url'             : false

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
		modal.contentWrapper = $('<div class="content-wrapper"></div>');
		modal.wrapper.append(modal.contentWrapper);

		// Set the dimensions
		if (modal.settings.width !== false) {
			modal.wrapper.css('maxWidth', modal.settings.width);
		}
		if (modal.settings.height !== false) {
			modal.wrapper.css('maxHeight', modal.settings.height);
		}

		// Apply some settings to the wrapper element
		if (modal.settings.scrollable) {
			modal.wrapper.css('overflow', 'auto');
		}

		// Add the close button to the modal
		if (modal.settings.closable) {
			modal.wrapper.prepend($(modal.settings.closeButton));
		}

		// Load the content into the modal
		switch (modal.settings.type) {

			// Call the content from an inline object
			case 'inline':

				// Append the content to the modal
				modal.content = $(modal.settings.content);

				// Append the content to the modal
				modal.contentWrapper.append(modal.content);

				break;

			case 'ajax':

				// Create the loading graphic
				modal.loader = $('<div class="loader"></div>')
					.appendTo(modal.contentWrapper);

				// Animate the loader
				if ($().zoetrope) {
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
						modal.contentWrapper.append(modal.content);
					},

					'error' : function() {
						modal.content = $('<p>Unable to retrieve content...</p>');
						modal.content.height(300);

						// Remove the loading class
						modal.wrapper.removeClass('loading');
						modal.loader.zoetrope('destroy');

						// Append the content to the modal
						modal.contentWrapper.append(modal.content);
					}
				});

				break;

			case 'iframe':

				// Create the loading graphic
				modal.loader = $('<div class="loader"></div>')
					.appendTo(modal.wrapper);

				// Animate the loader
				if ($().zoetrope) {
					modal.loader.zoetrope({
						'frames' : 8,
						'offset' : 80,
						'speed'  : 50
					});
				}

				// Add a loading class
				modal.wrapper.addClass('loading');

				// Create the iframe
				modal.content = $('<iframe />', {
						'class'        : 'modal-iframe',
						'frameborder'  : 0,
						'height'       : '100%',
						'id'           : modal.id + '--iframe',
						'marginheight' : 0,
						'marginwidth'  : 0,
						'name'         : modal.id + '--content',
						'scrolling'    : 'no',
						'src'          : modal.settings.url,
						'width'        : '100%'
					})
					.css({
						'display'        : 'block',
						'vertical-align' : 'bottom'
					})
					.hide();

				// Append the content to the modal
				modal.contentWrapper.append(modal.content);

				modal.content.load(function() {

					// Remove the loading class
					modal.wrapper.removeClass('loading');
					modal.loader.zoetrope('destroy');
					modal.loader.remove();

					if (modal.content.contents()) {
						modal.content.contents().find('.close')
							.on('click', function() {
								modal.close();
							});

						// Set a reference to the parent modal in the iframe
						modal.content.contents().parentModal = modal;
					}

					// Bind the resize event handlers
					if (modal.settings.autoResize) {
						modal.content.contents().find(modal.settings.iFrameEl).on('resize', function() {
							if (!modal.wrapper.is(':animated')) {
								modal.fit();
							}
						});
					}

					var fitOptions = {};
					if (modal.settings.width !== false) {
						fitOptions.fitWidth = false;
					}
					if (modal.settings.height !== false) {
						fitOptions.fitHeight = false;
					}

					// Fade in the iFrame
					modal.fit(fitOptions, function() {
						modal.content.fadeIn(500);
					});
				});

				break;

		}

		// --------------------------------------------------
		// METHODS

		// Resize the modal to a specific measurement
		modal.resizeModal = function(options, callback) {

			var newSize = {};

			// Set the new dimensions
			if (options.width) {
				newSize.maxWidth = options.width;
				newSize.width    = 'auto';
			}
			if (options.height) {
				newSize.height = options.height;
			} else {
				if (modal.settings.type == 'iframe' && modal.content.contents()) {
					newSize.height = modal.content.contents().outerHeight() + 'px';
				} else {
					newSize.height = modal.content.outerHeight() + 'px';
				}
			}

			if (typeof callback !== 'function') {
				callback = function() {};
			}

			speed = options.speed || modal.settings.resizeSpeed;

			// Animate to the new size
			modal.wrapper.animate(newSize, speed, 'easeOutQuint', callback);

			// Return modal to make it chainable
			return modal;

		};

		// Resize the modal to fit the contents
		modal.fit = function(options, callback) {

			// The el argument is optional
			if (typeof options === 'function') {
				callback = options;
				iFrameEl = modal.settings.iFrameEl;
			} else {
				var options = options || {};
				iFrameEl = options.iFrameEl || modal.settings.iFrameEl;
			}

			// Set the dimensions
			var dimensions = {};
			if (modal.settings.type == 'iframe' && modal.content.contents()) {
				// Resize the iframe width and height
				fitWidth  = modal.content.contents().find(iFrameEl).outerWidth() || $(window).width() - 20;
				fitHeight = modal.content.contents().find(iFrameEl).outerHeight() || $(window).width() - 20;
			} else {
				fitWidth  = modal.content.outerWidth();
				fitHeight = modal.content.outerHeight();
			}

			if (options.fitWidth !== false) {
				dimensions.width = fitWidth + 'px';
			}
			if (options.fitHeight !== false) {
				dimensions.height = fitHeight + 'px';
			}

			// Call the resize function with our new dimensions
			modal.resizeModal(dimensions, callback);

			// Return modal to make it chainable
			return modal;

		};

		// Open the modal
		modal.open = function(callback) {

			if (typeof modal.settings.open === 'function') {
				modal.settings.open.call(modal);
			}

			// Prevent a click in the modal to trigger a click on the container
			modal.wrapper.on('click', function(event) {
				event.stopPropagation();
			});

			// Create the overlay and modal container
			modal.overlay   = $('<div class="modal-overlay"></div>');
			modal.container = $('<div class="modal-container"></div>');

			// Make clicking on the container close the modal
			if (modal.settings.closable) {
				modal.container.on('click', function() {
					modal.close();
				});
			}

			// Clicking anything in the modal with the .close class will close the modal
			modal.wrapper.find('.close')
				.on('click', function() {
					modal.close();
				});

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

			// Bind the resize event handlers
			if (modal.settings.autoResize && modal.settings.type !== 'iframe') {
				modal.content.on('resize', function() {
					if (!modal.wrapper.is(':animated')) {
						modal.fit();
					}
				});
			}

			// Set what layer the modal should be on
			var layers = $('.modal-wrapper.open').length,
				layer  = (layers * 1000) + 1000;

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

			// First add it to the far left
			modal.wrapper.css('left', '-9999px');

			// Append the overlay and container to the body
			$('body').append(modal.overlay).append(modal.container);

			// Bring it to the center
			modal.wrapper.css('left', '');

			var fitOptions = {};
			if (modal.settings.width !== false) {
				fitOptions.fitWidth = false;
			}
			if (modal.settings.height !== false) {
				fitOptions.fitHeight = false;
			}

			if (modal.settings.type !== 'iframe') {
				modal.fit(fitOptions);
			}

			// Keep the background from scrolling
			document.body.style.overflow = 'hidden';

			// Fade in the overlay
			if ($('.modal-overlay.open').length > 0) {
				$('.modal-overlay.open').hide();
				modal.overlay.fadeTo(0, modal.settings.overlayOpacity);
				modal.overlay.css('z-index', layer - 10);
			} else {
				modal.overlay
					.fadeTo(modal.settings.transitionSpeed, modal.settings.overlayOpacity, 'easeOutQuad', function() {
						// We gots to do this for FireFox
						if (modal.settings.type === 'iframe' && modal.content.contents()) {
							modal.wrapper.height(modal.content.contents().height());
						}
					});
			}

			// Fade in the modal window
			modal.wrapper
				// .delay(100)
				.animate({
						'opacity'    : 1,
						'margin-top' : '+=30'
					},
					modal.settings.transitionSpeed,
					modal.settings.easing[0],
					function() {
						// Fire the ready callback
						if (typeof modal.settings.ready === 'function') {
							modal.settings.ready.call(modal);
						}

						// Fire the passed in callback
						if (typeof callback === 'function') {
							callback.call(modal);
						}
					});

			// Add the 'open' class
			modal.wrapper.addClass('open');
			modal.overlay.addClass('open');

			// Return modal to make it chainable
			return modal;

		};

		modal.close = function(callback) {

			// Fire the close callback
			if (typeof modal.settings.close === 'function') {
				modal.settings.close.call(modal);
			}

			// Unbind the keyup function
			$(document).off('keyup', modal.keyupFn);

			// Unbind resize event handlers
			if (modal.settings.autoResize) {
				var contents = modal.content;
				if (modal.settings.type === 'iframe') {
					contents = modal.content.contents().find(modal.settings.iFrameEl);
				}
				contents.off('resize');
			}

			// Drop the modal
			modal.wrapper
				.stop(true, true)
				.animate({
						'opacity'    : 0,
						'margin-top' : '+=30'
					},
					modal.settings.transitionSpeed / 2,
					modal.settings.easing[1],
					function() {
						modal.wrapper.removeClass('open');
						modal.overlay.removeClass('open');
						modal.container.remove();

						// Open the next overlay
						if ($('.modal-overlay.open').length > 0) {
							$('.modal-overlay.open').last().fadeIn(50);
						}

						// Fade out and remove the overlay
						modal.overlay.fadeOut(100, function() {
							modal.overlay.remove();
						});

						// Fire the closed callback
						if (typeof modal.settings.closed === 'function') {
							modal.settings.closed.call(modal);
						}
						if (typeof callback === 'function') {
							callback.call(modal);
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