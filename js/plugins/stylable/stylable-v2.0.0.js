// --------------------------------------------------
// REBOOT FORMS PLUGIN
// Allow stylable selects, checkboxes, and radios
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

// Modify select fields
;(function($){

	var methods = {
		
		init : function(options) {

			$('select').stylable('selects', options);
			$(':radio').stylable('radios', options);
			$(':checkbox:not(.toggle)').stylable('checkboxes', options);
			$(':checkbox.toggle').stylable('toggles', options);

		},

		// Make select elements stylable
		selects : function(options) {

			if (options) {
				var formsSettings   = options.forms;
				var selectsSettings = options.selects;
			}

			var settings = $.extend({

				// Default Options
				'class'               : false,
				'selectedClass'       : false,
				'selectHandleContent' : '<i class="re-chevron-down"></i>',
				'transferClasses'     : 'move' // move, copy, false

				// Events
				// 'destroy' : function() {}

			}, formsSettings, selectsSettings);

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('stylable'),
					id    = $this.attr('id');

				// If the plugin hasn't been initialized yet
				if (!data) {

					var isMulti = $this.attr('multiple');

					// Create the data object
					$this.data('stylable', {
						'settings' : settings,
						'target'   : $this
					});
					data = $this.data('stylable');
					
					// Create the data wrapper
					var wrapperClass = (isMulti) ? 'multi-select-wrapper' : 'select-wrapper';
					data.wrapper = $('<div class="' + wrapperClass + '" />')
						.css('min-width', $this.outerWidth() + 45);
					if (id) {
						data.wrapper.attr('id', id + '--wrapper');
					}

					// Transfer the classes from the select element to the wrapper
					if (settings.transferClasses) {
						methods.transferClasses.call($this);
					}
					if (settings.class) {
						data.wrapper.addClass(settings.class);
					}

					// Create the content element
					data.contentEl = $('<div class="select-content" />');

					// Build the multi-select element
					if (isMulti) {
						// *** Multi-select styling requires the jQuery UI selectable plugin

						var selectedClass = 'ui-selected';

						if (settings.selectedClass) {
							selectedClass = 'ui-selected ' + settings.selectedClass;
						}

						// Add the options to the content area
						$this.find('option').each(function() {
							option = $('<div class="option" data-value="' + $(this).attr('value') + '">' + $(this).text() + '</div>');
							if ($(this).prop('selected')) {
								option.addClass(selectedClass);
							}

							// Add the option to the list
							option.appendTo(data.contentEl);
						});

						// Make the options selectable
						data.contentEl.selectable({
								'filter'     : '.option',
								'selected'   : function(event, ui) {
										$this.find('option[value="' + $(ui.selected).attr('data-value') + '"]').prop('selected', true);
									},
								'unselected' : function(event, ui) {
										$this.find('option[value="' + $(ui.unselected).attr('data-value') + '"]').prop('selected', false);
									}
							});
						
					}

					// Build a single select dropdown
					else {

						data.contentEl.text($this.find('option:selected').text());

					}

					// Insert the wrapper before the element and add the content and stuff
					data.wrapper.insertBefore($this).append($this).append(data.contentEl);
					
					// Insert the handle for single selects
					if (!isMulti) {
						data.wrapper.append('<div class="select-handle">' + settings.selectHandleContent + '</div>');
					}

					// Add some event handlers
					$this
						.on('focus', function() {
							// Add the focus class to the wrapper
							data.wrapper.addClass('focus');
						})
						.on('blur', function() {
							// Remove the focus class from the wrapper
							data.wrapper.removeClass('focus');
						})
						.on('change keyup update', function() {
							// Set the content to the selected value
							if ($this.attr('multiple')) {
								var selectedValues = $this.val();
								data.wrapper.find('.option').removeClass(selectedClass);
								$.each(selectedValues, function(index, value) {
									data.wrapper.find('.option[data-value="' + value + '"]').addClass(selectedClass);
								});
							} else {
								data.wrapper.find('.select-content').text($this.find('option:selected').text());
							}
						});
				}

				return $this;
				
			});

		},

		radios : function(options) {
			
			if (options) {
				var formsSettings = options.forms;
				var radiosSettings = options.radios;
			}

			var settings = $.extend({

				'class'           : false,
				'bulletContent'   : '<i class="re-bullet"></i>',
				'bulletClass'     : false,
				'transferClasses' : 'move'

				// Events
				// 'click'   : function() {},
				// 'check'   : function() {},
				// 'uncheck' : function() {},
				// 'destroy' : function() {}

			}, formsSettings, radiosSettings);

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('stylable'),
					id    = $this.attr('id');

				// If the plugin hasn't been initialized yet
				if (!data) {

					// Create the data object
					$this.data('stylable', {
						settings : settings,
						target   : $this
					});

					data = $this.data('stylable');
					
					// Create the wrapper element
					data.wrapper = $('<div class="radio-wrapper" />');
					if (id) {
						data.wrapper.attr('id', id + '--wrapper');
					}

					// Transfer classes to the radio wrapper
					if (settings.transferClasses) {
						methods.transferClasses.call($this);
					}
					if (settings.class) {
						data.wrapper.addClass(settings.class);
					}

					// Create the stylable elements
					data.bullet = $('<div class="bullet">' + settings.bulletContent + '</div>');
					if (settings.bulletClass) {
						data.checkmark.addClass(settings.bulletClass);
					}
					data.radio = $('<div class="radio"></div>');

					// Wrap the checkbox in the wrapper and add the checkmark
					data.wrapper.insertBefore($this).append($this).append(data.radio).append(data.bullet);

					// Check if the checkbox is checked
					if ($this.is(':checked')) {
						data.wrapper.addClass('checked');
					}

					$this
						.on('focus', function() {
							data.wrapper.addClass('focus');
						})
						.on('blur', function() {
							data.wrapper.removeClass('focus');
						})
						.on('check', function() {
							$this.prop('checked', true);
							data.wrapper.addClass('checked');
						})
						.on('uncheck', function() {
							$this.prop('checked', '');
							data.wrapper.removeClass('checked');
						})
						.on('click', function() {
							// Unselect all radios
							$('input:radio[name="' + $this.attr('name') + '"]').trigger('uncheck');
							$this.trigger('check');
						});
						
				}

				return $this;
				
			});

		},

		// Make radio buttons and checkboxes stylable
		checkboxes : function(options) {

			if (options) {
				var formsSettings      = options.forms;
				var checkboxesSettings = options.checkboxes;
			}

			var settings = $.extend({

				'class'            : false,
				'checkmarkClass'   : false,
				'checkmarkContent' : '<i class="re-check"></i>',
				'transferClasses'  : 'move'

				// Events
				// 'click'   : function() {},
				// 'check'   : function() {},
				// 'uncheck' : function() {},
				// 'destroy' : function() {}

			}, formsSettings, checkboxesSettings);

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('stylable'),
					id    = $this.attr('id');

				// If the plugin hasn't been initialized yet
				if (!data) {

					// Create the data object
					$this.data('stylable', {
						settings : settings,
						target   : $this
					});

					data = $this.data('stylable');
					
					// Create the wrapper element
					data.wrapper = $('<div class="checkbox-wrapper" />');
					if (id) {
						data.wrapper.attr('id', id + '--wrapper');
					}

					// Transfer classes to the checkbox wrapper
					if (settings.transferClasses) {
						methods.transferClasses.call($this);
					}
					if (settings.class) {
						data.wrapper.addClass(settings.class);
					}

					// Create the stylable elements
					data.checkmark = $('<div class="checkmark">' + settings.checkmarkContent + '</div>');
					if (data.settings.checkmarkClass) {
						data.checkmark.addClass(data.settings.checkmarkClass);
					}
					data.box = $('<div class="box"></div>');

					// Wrap the checkbox in the wrapper and add the checkmark
					data.wrapper.insertBefore($this).append($this).append(data.box).append(data.checkmark);

					// Check if the checkbox is checked
					if ($this.is(':checked')) {
						data.wrapper.addClass('checked');
					}

					$this
						.on('focus', function() {
							data.wrapper.addClass('focus');
						})
						.on('blur', function() {
							data.wrapper.removeClass('focus');
						})
						.on('check', function() {
							$this.prop('checked', true);
							data.wrapper.addClass('checked');
						})
						.on('uncheck', function() {
							$this.prop('checked', '');
							data.wrapper.removeClass('checked');
						})
						.on('click', function() {
							if ($this.is(':checked')) {
								$this.trigger('check');
							} else {
								$this.trigger('uncheck');
							}
						});
						
				}

				return $this;
				
			});

		},

		// Make radio buttons anc checkboxes stylable
		toggles : function(options) {

			if (options) {
				var formsSettings   = options.forms;
				var togglesSettings = options.checkboxes;
			}

			var settings = $.extend({

				'class'             : false,
				'toggleHandleClass' : false,
				'toggleOnText'      : 'ON',
				'toggleOffText'     : 'OFF',
				'toggleSpeed'       : 100,
				'transferClasses'   : 'move'

				// Events
				// 'click'     : function() {},
				// 'toggleOff' : function() {},
				// 'toggleOn'  : function() {},
				// 'destroy'   : function() {}

			}, formsSettings, togglesSettings);

			return this.each(function() {

				if ($(this).is(':checkbox')) {

					var $this = $(this),
						data  = $this.data('stylable'),
						id    = $this.attr('id');

					// If the plugin hasn't been initialized yet
					if (!data) {

						// Create the data object
						$this.data('stylable', {
							settings : settings,
							target   : $this
						});

						data = $this.data('stylable');
						
						// Create the wrapper element
						data.wrapper = $('<div class="toggle-wrapper"></div>');
						if (id) {
							data.wrapper.attr('id', id + '--wrapper');
						}

						// Transfer classes to the wrapper
						if (settings.transferClasses) {
							methods.transferClasses.call($this);
						}

						// Add a custom wrapper class
						if (data.settings.class) {
							data.wrapper.addClass(settings.class);
						}

						// Create the groove element
						data.toggleGroove = $('<div class="groove"></div>');

						// Create the color overlay
						data.toggleOverlay = $('<div class="overlay"></div>');

						// Create the text elements
						data.toggleText = $('<div class="toggle-on">' + data.settings.toggleOnText + '</div><div class="toggle-off">' + data.settings.toggleOffText + '</div>');

						// Create the switch element
						data.toggleHandle = $('<div class="handle"></div>');

						// Add the custom class to the handle
						if (settings.toggleHandleClass) {
							data.toggleHandle.addClass(settings.toggleHandleClass);
						}

						// Insert the elements
						data.wrapper.insertBefore($this)
							.append($this)
							.append(data.toggleGroove)
							.append(data.toggleHandle);
						data.toggleGroove
							.append(data.toggleOverlay)
							.append(data.toggleText);
							
						// Toggle on by default if the checkbox is checked
						data.state = 'off';
						if ($this.is(':checked')) {
							data.wrapper.addClass('on');
							data.toggleHandle.css('left', '50%');
							data.state = 'on';
						}

						$this
						.on('focus', function() {
							data.wrapper.addClass('focus');
						})
						.on('blur', function() {
							data.wrapper.removeClass('focus');
						})
						.on('check', function() {
							data.toggleOverlay.stop().animate({ 'left' : 0 }, data.settings.toggleSpeed);
							data.toggleHandle.stop().animate({ 'left' : '50%' }, data.settings.toggleSpeed, 'easeOutQuad', function() {
								$this.prop('checked', true);
								data.wrapper.addClass('on');
								data.state = 'on';

								// Trigger the toggle on callback
								if (data.settings.toggleOn) {
									data.settings.toggleOn.call(this);
								}
							});
						})
						.on('uncheck', function() {
							data.toggleOverlay.stop().animate({ 'left' : '-100%' }, data.settings.toggleSpeed);
							data.toggleHandle.stop().animate({ 'left' : 0 }, data.settings.toggleSpeed, 'easeOutQuad', function() {
								$this.prop('checked', '');
								data.wrapper.removeClass('on');
								data.state = 'off';

								// Trigger the toggle off callback
								if (data.settings.toggleOff) {
									data.settings.toggleOff.call(this);
								}
							});
						})
						.on('click', function() {
							if ((typeof data.settings.click != 'function') || (typeof data.settings.click == 'function' && data.settings.click.call($this) !== false)) {
								if ($this.prop('checked') == true) {
									$this.trigger('check');
								} else {
									$this.trigger('uncheck');
								}
							}
						});

					}
				}

				return $this;

			});

		},

		// Transfer the element classes to the wrapper
		transferClasses : function() {
			var $this = $(this),
				data  = $this.data('stylable');

			data.wrapper.addClass($this.attr('class'));

			if (data.settings.transferClasses === 'move') {
				// Save the original classes in the data obj
				data.origClass = $this.attr('class');

				$this.removeAttr('class');	
			}
		},

		// Revert the input back to it's original state
		destroy : function() {

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('stylable'),
					id    = $this.attr('id');

				// If the plugin was initialized, revert it
				if (data) {

					// Get the wrapper element
					$wrapper = $this.closest('div[class*="-wrapper"]');

					$this.insertBefore($wrapper);
					$wrapper.remove();

					// Remove the stylable data attribute
					$this.removeData('stylable');

				}

				return $this;

			});

		}

	};

	// Decide which function to call
	$.fn.stylable = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for the stylable plugin.');
		}
	
	};

})(jQuery);