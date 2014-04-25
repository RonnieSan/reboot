// --------------------------------------------------
// REBOOT ANIMATED
// Animate a sprite with multiple frames
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

// Modify select fields
;(function($){

	var methods = {
		
		init : function(options) {

			var settings = $.extend({

				// Default Options
				frames : 12,
				loop   : 0,
				offset : 100,
				speed  : 100

			}, options);

			return this.each(function() {

				var $this = $(this);

				$this.data('animation', {});
				var data = $this.data('animation');

				// Set the current frame
				data.settings     = settings;
				data.currentFrame = 1;
				data.currentLoop  = 1;

				data.interval = setInterval(function() {
					
					if (data.currentFrame > settings.frames) {
						data.currentFrame = 1;
						data.currentLoop++;
					}

					// Stop the current animation if the loops are complete
					if (settings.loop > 0 && data.currentLoop > settings.loop) {
						methods.destroy.call($this);
					} else {
						offset = (data.currentFrame - 1) * settings.offset * -1;
						$this.css('background-position', offset + 'px 0');
						data.currentFrame++;
					}

				}, settings.speed);

				return $this;
				
			});

		},

		// Stop the animation
		destroy : function() {

			return this.each(function() {

				var $this = $(this),
					data  = $this.data('animation');

				// Clear the animation interval
				clearInterval(data.interval);

				// Destroy the data
				$this.removeData('animation');

				return $this;
				
			});

		}

	};

	// Decide which function to call
	$.fn.zoetrope = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for zoetrope plugin.');
		}
	
	};

})(jQuery);