// --------------------------------------------------
// REBOOT TABS
// Simple tabbed content
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

// Modify select fields
;(function($) {

	$.tabs = function(options) {

		// Create and make a reference to the modals array
		var $doc = $(document);
		if (!$doc.data('tabGroups')) {
			$doc.data('tabGroups', []);
		}
		var tabGroups = $doc.data('tabGroups');

		// Load the settings that were passed in
		var settings = $.extend({

			'selector'  : '.tab'

			// Events
			// 'load'   : function() {}
			// 'switch' : function() {}

		}, options);

		tabGroups.select.call(tabGroups, );

		$(settings.selector).on('click', function() {

			var $this = $(this);

			// Handle the click event


			if ($this.not('.active')) {

			}

		});

		tabGroups.select = function(tabID) {

		}

	}

	var methods = {
		
		init : function(options) {

			var settings = $.extend({

				// Default Options
				activeTab       : false,
				contentSelector : '.content'

			}, options);

			return this.each(function() {

				var $this = $(this);

				// Get the tabs for this tab group
				var tabs     = $('[data-tab-group="' + tabGroup + '"]'),
					contents = $('#' + contentsID).find('.tab-content');
				
				tabs.bind('click', function() {
						
					// Reset the state to off and set clicked tab to active
					tabs.removeClass('active');
					$(this).addClass('active');

					// Hide all content and show linked content
					var tabID     = $(this).attr('id'),
						contentID = tabID.replace('--tab', '--content');

					contents.hide();
					$('#' + contentID).show();

				});

				tabs.removeClass('active');
				contents.hide();

				// Activate the initial tab in the options
				if (settings.initialTab) {
					
					// Activate the initial tab from settings
					$(settings.initialTab).addClass('active');

					// Hide all content and show linked content
					var tabID     = $(settings.initialTab).attr('id'),
						contentID = tabID.replace('--tab', '--content');

					// Show the corresponding content
					$('#' + contentID).show();
				}

				// Activate the first tab
				else {
					tabs.first().addClass('active');
					contents.first().show();
				}

				return $this;
				
			});

		}

	};

	// Decide which function to call
	$.fn.reboot_tabs = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for reboot_tabs plugin.');
		}
	
	};

})(jQuery);