(function($) {
	$.fn.dribbbleshot = function(options) {
		
		// Sanitize options
		var settings = $.extend({}, $.fn.dribbbleshot.defaults, options);
		
		// Player is required
		if(!settings.player || (typeof(settings.player) != "string" && typeof(settings.player) != "number")) {
			throw new TypeError("Required setting 'player' must be a string or a number.");
		}
		
		// Shots per page
		settings.per_page = parseInt(settings.per_page);
		if(settings.per_page > 30 || settings.per_page < 1) {
			settings.per_page = 30;
		}
		
		// Current page
		settings.page = parseInt(settings.page);
		
		// Request URL
		settings.url = "//api.dribbble.com/players/" + settings.player + "/shots?page=" + settings.page + "&per_page=" + settings.per_page + "&callback=?";
		
		
		
		// Allow chaining
		return this.each(function() {
			
			var $container = $(this);
			
			var request = $.ajax({
				url: settings.url,
				dataType: "jsonp"
			});
			
			if(typeof(settings.always) == "function") {
				request.always(settings.always);
			}
			
			if(typeof(settings.fail) == "function") {
				request.fail(settings.fail);
			}
			
			if(typeof(settings.done) == "function") {
				request.done(settings.done);
			}
			else {
				request.done(function(response, textStatus, jqxhr) {
					
					if(jqxhr.status != 200) {
						return false;
					}
					
					$.each(response.shots, function(index, element) {
						$container.append(settings.format(element));
					});
					
					$container.append(settings.pagination(response.pages));
				});
			}
			
		});
		
	};
	
	
	$.fn.dribbbleshot.format = function(shot) {
		var markup = '<div><img src="' + shot.image_teaser_url + '" /></div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.dribbbleshot.pagination = function(pages) {
		var markup = '<div class="dribbbleshot-pagination">';
		markup += '<div class="dribbbleshot-pagination-previous">' + settings.paginationPreviousText + '</div>';
		
		for(var p = 1; p <= pages; p++) {
			markup += '<div class="dribbbleshot-pagination-page" data-page="' + p + '">';
			
			if(settings.showPaginationPages) {
				markup += p;
			}
			
			markup += '</div>';
		}
		
		markup += '<div class="dribbbleshot-pagination-next">' + settings.paginationNextText + '</div>';
		markup += '</div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.dribbbleshot.defaults = {
		format : $.fn.dribbbleshot.format,
		page : 1,
		per_page : 15,
		showPaginationControls : true,
		showPaginationPages : false,
		paginationPreviousText : "Previous",
		paginationNextText : "Next"
	};
	
	
}(jQuery));
