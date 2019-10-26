(function($) {

	// Set button state
	function setButtonState($inputfield, values) {
		$inputfield.find('.PageListActionQuickSelect').removeClass('qs-disabled');
		$.each(values, function(index, value) {
			var $disable = $inputfield.find('.PageListID' + value + ' .PageListActionQuickSelect');
			$disable.addClass('qs-disabled');
		});
	}

	$(function() {

		var $js_config = ProcessWire.config.PageListSelectMultipleQuickly;

		// Rename "Cancel" button to "Close"
		// Must work around issue where click event propagation stopped on toggle element by core "return false"
		$(document).on('click', '.Inputfield.select-quickly .PageListSelectHeader li', function() {
			var $toggle = $(this).find('.PageListSelectActionToggle');
			if(!$toggle.find('.replacement-text').length) {
				$toggle.wrapInner('<span class="original-text"></span>');
				$toggle.append('<span class="replacement-text">' + $js_config.close_button_label + '</span>');
			}
		});

		// Add buttons as branches are AJAX-loaded
		$(document).on('ajaxComplete', function() {
			$('.Inputfield.select-quickly').each(function() {
				// Add custom select buttons
				$(this).find('.PageList .PageListActions').each(function() {
					if(!$(this).children('.PageListActionQuickSelect').length) {
						$(this).append('<li class="PageListActionQuickSelect"><a href="#">' + $js_config.select_button_label + '</a></li>');
					}
				});
				// Set button states
				var values = $(this).find('input.InputfieldPageListSelectMultipleData').val().split(',');
				setButtonState($(this), values);
			});
		});

		// Update buttons states when value changes
		$(document).on('change', '.Inputfield.select-quickly input.InputfieldPageListSelectMultipleData', function() {
			$inputfield = $(this).closest('.Inputfield.select-quickly');
			var values = $(this).val().split(',');
			setButtonState($inputfield, values);
		});

		// Update field value when select buttons are clicked
		$(document).on('click', '.PageListActionQuickSelect a', function(event) {
			event.preventDefault();
			// Return early if button is disabled
			if($(this).parent().hasClass('qs-disabled')) return;
			// Get list item
			var $list_item = $(this).closest('.PageListItem');
			// Get page ID from list item class
			var id = '';
			var classes = $list_item.attr('class').split(/\s+/);
			$.each(classes, function(index, value) {
				if(value.substring(0, 10) === 'PageListID') {
					id = value.substring(10);
					return false;
				}
			});
			if(!id) return;
			// Get page title
			var title = $list_item.find('.label_title').text();
			// Get input element
			var $input = $(this).closest('.Inputfield.select-quickly').find('input.InputfieldPageListSelectMultipleData');
			// Update sortable list and input value
			var $ol = $('#' + $input.attr('id') + '_items');
			var $li = $ol.children(".itemTemplate").clone();
			$li.removeClass("itemTemplate");
			$li.children('.itemValue').text(id);
			$li.children('.itemLabel').text(title);
			$ol.append($li);
			InputfieldPageListSelectMultiple.rebuildInput($ol);
		});

	});

}(jQuery));
