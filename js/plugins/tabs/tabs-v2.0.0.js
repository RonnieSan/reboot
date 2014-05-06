// --------------------------------------------------
// REBOOT TABS
// Simple tabbed content
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

;(function($) {

	var methods = {
		
		init : function(options) {

			var settings = $.extend({

				// Default Options
				activeTab    : false

			}, options);

			return this.each(function() {

				var $this = $(this);
				
				$this.on('click', function() {
					$this.tabs('select');
				});

				// Activate the initial tab in the options
				if (settings.activeTab) {
					
					// Activate the initial tab from settings
					$(settings.activeTab).tabs('select');

				}

				return $this;
				
			});

		},

		select : function() {

			var $this = $(this);

			// Get the tabs for this tab group
			var tabGroup   = $this.data('tab-group'),
				tabContent = $this.data('tab-content-id');

			if ($this.is(':not(.active)')) {

				// Reset the state to off and set clicked tab to active
				$('[data-tab-group="' + tabGroup + '"]').removeClass('active');
				$this.addClass('active');
				$('#' + tabContent).addClass('active');

			}

		}

	};

	// Decide which function to call
	$.fn.tabs = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for tabs plugin.');
		}
	
	};

})(jQuery);