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

			$('select').reboot_forms('selects', options);
			$(':radio').reboot_forms('radios', options);
			$(':checkbox:not(.toggle)').reboot_forms('checkboxes', options);
			$(':checkbox.toggle').reboot_forms('toggles', options);

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

			}, formsSettings, selectsSettings);

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('reboot_forms'),
					id    = $this.attr('id');

				// If the plugin hasn't been initialized yet
				if (!data) {

					var isMulti = $this.attr('multiple');

					// Create the data object
					$this.data('reboot_forms', {
						settings : settings,
						target   : $this
					});
					data = $this.data('reboot_forms');
					
					// Create the data wrapper
					var wrapperClass = (isMulti) ? 'multi-select-wrapper' : 'select-wrapper';
					data.wrapper = $('<div class="' + wrapperClass + '" />')
						.css('min-width', $this.outerWidth() + 45);
					if (id) {
						data.wrapper.attr('id', id + '--wrapper');
					}

					// Transfer the classes from the select element to the wrapper
					if (settings.transferClasses) {
						data.wrapper.addClass($this.attr('class'));
					}
					if (settings.transferClasses === 'move') {
						$this.removeAttr('class');
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
						data.wrapper.bind("mousedown", function (event) {
    							event.metaKey = true;
							}).selectable({
								'filter'     : '.option',
								'start'      : function(event, ui) {
										// Clear existing selection
										data.wrapper.find('.option').removeClass(selectedClass);
										$this.val('');
									},
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
								$this.find('.option').removeClass(selectedClass);
								$.each(selectedValues, function(index, value) {
									$this.find('.option[data-value="' + value + '"]').addClass(selectedClass);
								});
							} else {
								data.wrapper.find('.select-content').text($this.find('option:selected').text());
							}
						});
				}

				return $this;
				
			});

		},

		radios : function() {
			
		},

		// Make radio buttons and checkboxes stylable
		checkboxes : function(options) {

			if (options) {
				var formsSettings   = options.forms;
				var checkboxesSettings = options.checkboxes;
			}

			var settings = $.extend({

				'class'            : false,
				'checkClass'       : false,
				'checkmarkContent' : '<i class="re-check"></i>',
				'transferClasses'  : 'move'

			}, formsSettings, checkboxesSettings);

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('reboot_forms'),
					id    = $this.attr('id');

				// If the plugin hasn't been initialized yet
				if (!data) {

					// Create the data object
					$this.data('reboot_forms', {
						settings : settings,
						target   : $this
					});

					data = $this.data('reboot_forms');
					
					// Create the wrapper element
					data.wrapper = $('<div class="checkbox-wrapper" />');
						if (id) {
							data.wrapper.attr('id', id + '--wrapper');
						}

					// Create the checkmark element
					data.checkmark = $('<div class="checkmark">' + settings.checkmarkContent + '</div>');

					// Wrap the checkbox in the wrapper and add the checkmark
					data.wrapper.insertBefore($this).append($this).append(data.checkmark);

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
				
			});

		},

		// Make radio buttons anc checkboxes stylable
		toggles : function(options) {

			var settings = $.extend({

				'toggleOnText'  : 'ON',
				'toggleOffText' : 'OFF',
				'toggleSpeed'   : 100,

				'onClick'       : function() { return true; }

			}, options);

			return this.each(function() {

				if ($(this).is(':checkbox')) {

					var $this = $(this),
						data  = $this.data('reboot_forms'),
						id    = $this.attr('id');

					// If the plugin hasn't been initialized yet
					if (!data) {

						// Create the data object
						$this.data('reboot_forms', {
							settings : settings,
							target   : $this
						});

						data = $this.data('reboot_forms');
						
						data.wrapper = $('<div class="toggle-wrapper"></div>');
						if (id) {
							data.wrapper.attr('id', id + '-wrapper');
						}
						data.toggleSwitch = $('<div class="switch"></div>');
						data.wrapper.insertBefore($this)
							.append(data.toggleSwitch)
							.append($('<div class="toggle-on">' + data.settings.toggleOnText + '</div><div class="toggle-off">' + data.settings.toggleOffText + '</div>'))
							.append($this);

						if ($this.is(':checked')) {
							data.wrapper.addClass('on');
							data.toggleSwitch.css('left', '50%');
						}

						$this
						.on('focus', function() {
							data.wrapper.addClass('focused');
						})
						.on('blur', function() {
							data.wrapper.removeClass('focused');
						})
						.on('check', function() {
							data.toggleSwitch.stop().animate({ 'left' : '50%', 'backgroundColor' : '#8BC84A' }, data.settings.toggleSpeed, 'easeOutQuad', function() {
								$this.prop('checked', true);
								data.wrapper.addClass('on');
							});
						})
						.on('uncheck', function() {
							data.toggleSwitch.stop().animate({ 'left' : 0, 'backgroundColor' : '#CCC' }, data.settings.toggleSpeed, 'easeOutQuad', function() {
								$this.prop('checked', '');
								data.wrapper.removeClass('on');	
							});
						})
						.on('click', function() {
							if (data.settings.onClick.call(this)) {
								if ($this.is(':checked')) {
									data.toggleSwitch.stop().animate({ 'left' : '50%', 'backgroundColor' : '#8BC84A' }, data.settings.toggleSpeed, 'easeOutQuad', function() {
										data.wrapper.addClass('on');
									});
								} else {
									data.toggleSwitch.stop().animate({ 'left' : '0', 'backgroundColor' : '#CCC' }, data.settings.toggleSpeed, 'easeOutQuad', function() {
										data.wrapper.removeClass('on');
									});
								}
							}
						});

					}
				}

			});

		}

	};

	// Decide which function to call
	$.fn.reboot_forms = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for reboot_forms plugin.');
		}
	
	};

})(jQuery);