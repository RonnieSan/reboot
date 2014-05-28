// --------------------------------------------------
// REBOOT VALIDATION PLUGIN
// Custom functions available for form validation
// ©2014 by Reactive Apps
// MIT License
// --------------------------------------------------

// This luhn formula is used during credit card number validation
;function luhn(s) {
    var i, n, c, r, t;

    // First, reverse the string and remove any non-numeric characters.    
    r = "";
    for (i = 0; i < s.length; i++) {
        c = parseInt(s.charAt(i), 10);
        if (c >= 0 && c <= 9) r = c + r;
    }
    
    // Check for a bad string.
    if (r.length <= 1) return false;
    
    // Now run through each single digit to create a new string. Even digits
    // are multiplied by two, odd digits are left alone.
    t = "";
    for (i = 0; i < r.length; i++) {
        c = parseInt(r.charAt(i), 10);
        if (i % 2 != 0) c *= 2;
        t = t + c;
    }
    
    // Finally, add up all the single digits in this string.
    n = 0;
    for (i = 0; i < t.length; i++) {
        c = parseInt(t.charAt(i), 10);
        n = n + c;
    }
    
    // If the resulting sum is an even multiple of ten (but not zero), the
    // card number is good.
    if (n != 0 && n % 10 == 0) {
        return true;
    } else {
        return false;
    }
}

(function($){

	// Basic validation rules
	var rules = {

		// Create a custom rule
		custom : function(functionName, functionArgs) {
			if (typeof(functionName) == 'function') {
				return functionName.apply(this, functionArgs);
			} else {
				return true;
			}
		},

		// Field is not empty or spaces
		required : function() {
			if (this.is(':radio, :checkbox')) {
				if (this.filter(':checked').size() < 1) {
					return false;
				}
			} else {
				var value = $.trim(this.val());
				if (this.val() == null || value == '') {
					return false;
				}
			}
			return true;
		},

		// Field does not equal a certain value
		not : function(notValue) {
			return (this.val() != notValue);
		},

		// The value has at least the minimum text length or number of options checked
		minLength : function(min) {
			if (this.is(':radio, :checkbox')) {
				return (this.filter(':checked').size() >= min);
			}
			return (this.val().length >= min);
		},

		// The value has at most the maximum text length or number checked
		maxLength : function(max) {
			if (this.is(':radio, :checkbox')) {
				return (this.filter(':checked').size() <= max);
			}
			return (this.val().length <= max);
		},

		// The value is a valid email address
		email : function() {
			var value = $.trim(this.val().replace(/\.$/, ''));
			var re    = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
            return re.test(value);
		},

		// The value is a valid postal code
		postalCode : function() {
			var re = /\b[0-9]{5}(?:-[0-9]{4})?\b/;
            return re.test(this.val());
		},

		// The value matches another field's value
		match : function(matchField) {
			return (this.val() == $(matchField).val());
		},

		// The value is a valid credit card number
		ccNumber : function(ccType) {
			// Setup the validation result
            var result = false;
            // Strip non-digit characters from cc number
            var cardNumber = new String(this.val());
            	cardNumber = cardNumber.replace(/[^0-9]/g, '');
            // Check if it's the test cc number
            if (cardNumber == '4895895895895895') {
                return true;
            }
            // Setup the cc type rules
            var re = { 
                         visa : /^4\d{12}(\d\d\d){0,1}$/,
                         mc   : /^5[12345]\d{14}$/,
                         amex : /^3[47][0-9]{13}$/,
                         disc : /^3[47][0-9]{13}$/
                     };
            // Validate each CC type
            var limit = ccType.length;
            for (var n = 0; n < limit; n++) {
                cardType = ccType[n];
                if (re[cardType].test(cardNumber)) {
                    if (cardType == 'visa' || cardType == 'mc') {
                        if (luhn(cardNumber)) {
                            result = true;
                        }
                    }
                    if (cardType == 'amex') {
                        if (cardNumber.charAt(0) == 3) {
                            result = true;
                        }
                    }
                    if (cardType == 'disc') {
                        if (cardNumber.charAt(0) == 6) {
                            result = true;
                        }
                    }
                }
            }
            return result;
		},

		// The value is a date in the future
        ccExpDate : function(expMonth, expYear) {
            if ($(expMonth).val() == '' || $(expYear).val() == '') {
                return false;
            }

            var expDate = new Date($(expMonth).val() + '/1/' + $(expYear).val());
            var today   = new Date();
                today   = new Date((today.getMonth() + 1) + '/1/' + today.getFullYear());

            if (expDate.getTime() < today.getTime()) {
                return false;
            }

            return true;
        },

        // Field is a valid CVV2 code
        cvv : function() {
            var re = /\d{3,4}/;
            return re.test(this.val());
        }

	}

	// Callable methods
	var methods = {

		// Add settings to objects
		init : function(options) {

			return this.each(function() {
				methods.settings.apply(this, options);
			});

		},

		settings : function(options) {

			var $this    = $(this),
				settings = $.extend({

					// Default options
					'errorClass'       : 'invalid',
					'errorContainer'   : $this.closest('.controls'),
					'errorElement'     : this,
					'errorTemplate'    : '<div class="form-error">{errorMsg}</div>',
					'validationEvents' : 'blur'

					// Events
					// 'error'  : function() {},
					// 'valid'  : function() {}

				}, options);

			if (!$this.data('validation-settings')) {
				$this.data('validation-settings', settings);
			}

		},

		// Run validation
		validate : function(options) {

			// Set the result to true by default then test for failures
			isValid = true;

			$(this).each(function() {

				var $this = $(this);

				// If we're validating a whole form
				if ($this.is('form')) {

					// Validate each field with rules
					$this.find('.validate').each(function() {
						// Apply the settings to the field
						if (!$(this).data('validation-settings') || options) {
							methods.settings.call(this, options);
						}

						if (!methods.validateField.call(this)) {
							isValid = false;
						}
					});

				} else {

					// Apply the settings to the field
					if (!$this.data('validation-settings') || options) {
						methods.settings.call(this, options);
					}

					// Check if the field is valid
					if (!methods.validateField.call(this)) {
						isValid = false;
					}

				}

			});

			return isValid;

		},

		validateField : function() {

			var $this    = $(this),
				settings = $this.data('validation-settings');

			// Get the validation rules
			var validationRules = $this.data('validation-rules') || [];
			
			// Set the result to true to begin with
			var result = true;

			// Loop through all the validation rules
			$.each(validationRules, function(index, rule) {

				// Test the field value against the rule definition
				result = rules[rule.rule].apply($this, rule.args);

				// Add the error if the value is invalid
				if (!result) {

					// If it's the same error, don't do anything
					if ($this.data('validation-error') !== rule.rule) {

						// Add the validation error to the rule
						$this.data('validation-error', rule.rule);
						
						// Append the error message to the page
						if (settings.errorTemplate) {
							errorTemplate = $(settings.errorTemplate.replace('{errorMsg}', rule.message));
							$this.data('validation-error-element', errorTemplate);
							errorTemplate.appendTo(settings.errorContainer);
						}

						// Add the error class to the field
						if (settings.errorElement) {
							$(settings.errorElement).addClass(settings.errorClass);
						}

						// Bind validation to events
						validationEvents = settings.validationEvents;
						if ($this.not(':radio') && $this.not(':checkbox')) {
							validationEvents += ' keyup';
						}
						if ($this.is('select')) {
							validationEvents += ' change';
						}
						if ($this.is(':radio') || $this.is(':checkbox')) {
							validationEvents += ' click';
						}

						$this.off(validationEvents, methods.validate).on(validationEvents, methods.validate);

					}

					// Return false so the errors don't stack
					return false;

				} else {

					// Remove the error element from the page
					if ($this.data('validation-error-element')) {
						$this.data('validation-error-element').remove();
						$this.removeData('validation-error-element');
					}

					// Remove the error class from the field
					$(settings.errorElement).removeClass(settings.errorClass);

					// Reset the validation error data
					$this.removeData('validation-error');

				}

			});

			// Call the custom valid callback
			if (result) {
				if (typeof settings.valid === 'function') settings.valid.call($this);
			} else {
				if (typeof settings.error === 'function') settings.error.call($this);
			}

			return result;

		}

	}

	// Decide which function to call
	$.fn.reboot_validation = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist for the reboot_validation plugin.');
		}
	
	};

})(jQuery);