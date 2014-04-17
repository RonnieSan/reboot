// -------------------------
// FORM MODIFIERS
// -------------------------

// Modify select fields
;(function($){

	var methods = {
		
		init : function(options) {

			$('select').reboot_forms('selects', options);
			$(':radio, :checkbox:not(.toggle)').reboot_forms('checks', options);
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
				selectHandleContent : '<i class="re-chevron-down"></i>',
				transferClasses     : 'move' // move, copy, false

			}, formsSettings, selectsSettings);

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
					
					// Create the data wrapper
					var wrapperClass = (isMulti) ? 'multi-select-wrapper' : 'select-wrapper';
					data.wrapper = $('<div class="' + wrapperClass + '" />')
						.css('min-width', $this.outerWidth() + 45);
					
					// Give the wrapper an ID
					if (id) {
						data.wrapper.attr('id', id + '--wrapper');
					}

					// Transfer the classes from the select element to the wrapper
					if (settings.transferClasses) {
						var classes = $this.attr('class') || '';
							classes = classes.split(/\s+/);
						$.each(classes, function(index, className) {
							data.wrapper.addClass(className);
						});
					}
					if (settings.transferClasses === 'move') {
						$this.removeAttr('class');
					}

					// Create the content element
					data.contentEl = $('<div class="select-content" />');

					// Create a function to select/unselect an multi select option
					function selectOption(parentSelect) {
						if ($(this).hasClass('selected')) {
							$(this).removeClass('selected');
							parentSelect.find('[value="' + $(this).attr('data-value') + '"]').prop('selected', false);
						} else {
							$(this).addClass('selected');
							parentSelect.find('[value="' + $(this).attr('data-value') + '"]').prop('selected', true);
						}
					}

					// Add the options to the content el
					if (isMulti) {
						$this.find('option').each(function() {
							option = $('<div class="option" data-value="' + $(this).attr('value') + '">' + $(this).text() + '</div>');
							if ($(this).prop('selected')) {
								option.addClass('selected');
							}

							// Bind some event handlers to the option
							option.on('click', function() {
								selectOption.call(this, $this);
							});

							// Add the option to the list
							option.appendTo(data.contentEl);
						});
					} else {
						data.contentEl.text($this.find('option:selected').text());
					}

					// Insert the wrapper before the element
					data.wrapper.insertBefore($this);
					data.wrapper.append($this)
						.append(data.contentEl);
					
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

							} else {
								data.wrapper.find('.select-content').text($this.find('option:selected').text());
							}
						});
				}

				return $this;
				
			});

		},

		createMultiSelect : function(settings) {

			var $this = $(this);

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
			
			// Give the wrapper an ID
			if (id) {
				data.wrapper.attr('id', id + '--wrapper');
			}

			// Transfer the classes from the select element to the wrapper
			if (settings.transferClasses) {
				var classes = $this.attr('class') || '';
					classes = classes.split(/\s+/);
				$.each(classes, function(index, className) {
					data.wrapper.addClass(className);
				});
			}
			if (settings.transferClasses === 'move') {
				$this.removeAttr('class');
			}

			// Create the content element
			data.contentEl = $('<div class="select-content" />');

			// Create a function to select/unselect an multi select option
			function selectOption(parentSelect) {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					parentSelect.find('[value="' + $(this).attr('data-value') + '"]').prop('selected', false);
				} else {
					$(this).addClass('selected');
					parentSelect.find('[value="' + $(this).attr('data-value') + '"]').prop('selected', true);
				}
			}

			// Add the options to the content el
			if (isMulti) {
				$this.find('option').each(function() {
					option = $('<div class="option" data-value="' + $(this).attr('value') + '">' + $(this).text() + '</div>');
					if ($(this).prop('selected')) {
						option.addClass('selected');
					}

					// Bind some event handlers to the option
					option.on('click', function() {
						selectOption.call(this, $this);
					});

					// Add the option to the list
					option.appendTo(data.contentEl);
				});
			} else {
				data.contentEl.text($this.find('option:selected').text());
			}

			// Insert the wrapper before the element
			data.wrapper.insertBefore($this);
			data.wrapper.append($this)
				.append(data.contentEl);
			
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

					} else {
						data.wrapper.find('.select-content').text($this.find('option:selected').text());
					}
				});

		},

		// Make radio buttons and checkboxes stylable
		checks : function(options) {

			var settings = $.extend({}, options);

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

					var className = 'checkbox-wrapper';
					if ($this.is(':radio')) {
						className = 'radio-wrapper';
					}
					
					data.wrapper = $('<div class="' + className + '" />')
					.width(settings.width).height(settings.height);
					if (id) data.wrapper.attr('id', id + '-wrapper');
					data.wrapper.insertBefore($this)
					.append($this);

					if ($this.is(':checked')) data.wrapper.addClass('checked');

					$this
					.on('focus', function() {
						data.wrapper.addClass('focused');
					})
					.on('blur', function() {
						data.wrapper.removeClass('focused');
					})
					.on('check', function() {
						console.log('check');
						if ($this.is(':radio')) {
							// If it's a radio button, disable the other radio buttons in the group
							$('[name="' + $this.attr('name') + '"]:radio').closest('.radio-wrapper').removeClass('checked');
						}
						$this.prop('checked', true);
						data.wrapper.addClass('checked');
					})
					.on('uncheck', function() {
						console.log('uncheck');
						if ($this.is(':checkbox')) {
							$this.prop('checked', '');
							data.wrapper.removeClass('checked');
						}
					})
					.on('click', function() {
						console.log('click');
						if ($this.is(':radio')) {
							// If it's a radio button, disable the other radio buttons in the group
							$('[name="' + $this.attr('name') + '"]:radio').closest('.radio-wrapper').removeClass('checked');
						}
						if ($this.is(':checked')) {
							data.wrapper.addClass('checked');
						} else {
							data.wrapper.removeClass('checked');
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