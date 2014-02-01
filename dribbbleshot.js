(function($) {
	$.fn.dribbbleshot = function(options) {
		
		// Sanitize options
		$.fn.dribbbleshot.settings = $.extend({}, $.fn.dribbbleshot.defaults, options);
		
		var settings = $.fn.dribbbleshot.settings;
		
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
			
			$container.addClass("dribbbleshot-container");
			
			var request = $.ajax({
				crossDomain: true,
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
					
					
					// Shots
					
					$.each(response.shots, function(index, element) {
						$container.append(settings.format(element));
					});
					
					
					// Pagination
					
					if($container.find(".dribbbleshot-pagination").length > 0) {
						$container.find(".dribbbleshot-pagination").detach().appendTo($container);
					}
					else {
						$container.append($.fn.dribbbleshot.pagination(response.pages, response.page));
					}
					
					$container.find(".dribbbleshot-pagination .disabled").removeClass("disabled");
					
					if(parseInt(response.page) >= parseInt(response.pages)) {
						response.page = response.pages;
						$container.find(".dribbbleshot-pagination-next").addClass("disabled");
					}
					
					if(parseInt(response.page) <= 1) {
						response.page = 1;
						$container.find(".dribbbleshot-pagination-next").addClass("disabled");
					}
					
					
					// Pagination events
					
					$container.find(".dribbbleshot-pagination-next:not(.disabled)").one("click", function(e) {
						settings["page"] = parseInt(response.page) + 1;
						$container.dribbbleshot(settings);
					});
					
					$container.find(".dribbbleshot-pagination-page").one("click", function(e) {
						settings["page"] = $(this).attr("data-page");
						$container.dribbbleshot(settings);
					});
					
					$container.find(".dribbbleshot-pagination-previous:not(.disabled").one("click", function(e) {
						settings["page"] = parseInt(response.page) - 1;
						$container.dribbbleshot(settings);
					})
				});
			}
			
		});
		
	};
	
	
	$.fn.dribbbleshot.format = function(shot) {
		var markup = '<div class="' + $.fn.dribbbleshot.settings.shotClass + '" data-id="' + shot.id + '">';
		
		// Shot image
		markup += '<div class="dribbble-shot-image" data-src="' + shot.image_url + '" data-teaser-src="' + shot.image_teaser_url + '">';
		markup += '<a href="' + shot.url + '"><img src="' + shot.image_teaser_url + '" /></a>';
		
		// Shot title
		markup += '<a href="' + shot.url + '" class="dribbble-shot-image-description">';
		markup += '<h3>' + shot.title + '</h3>';
		markup += '</a>';
		
		markup += '</div>';
		
		// Extra stats
		markup += '<div class="dribbble-shot-extras">';
		if(parseInt(shot.rebounds_count) > 0) {
			markup += '<span class="dribbble-shot-rebound-marker"></span>';
		}
		markup += '<span class="dribbble-shot-view-count" data-view-count="' + shot.views_count + '"></span>';
		markup += '<span class="dribbble-shot-comment-count" data-comment-count="' + shot.comments_count + '"></span>';
		markup += '<span class="dribbble-shot-like-count" data-like-count="' + shot.likes_count + '"></span>';
		markup += '</div>';
		
		markup += '</div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.dribbbleshot.pagination = function(pages, currentPage) {
		var markup = '<div class="dribbbleshot-pagination" data-current-page="' + currentPage + ">';
		markup += '<a class="dribbbleshot-pagination-previous">' + $.fn.dribbbleshot.settings.paginationPreviousText + '</a>';
		
		var currentClass = '';
		for(var p = 1; p <= pages; p++) {
			
			if(p == currentPage) {
				currentClass = ' dribbbleshot-pagination-current';
			}
			else {
				currentClass = '';
			}
			
			markup += '<a class="dribbbleshot-pagination-page' + currentClass + '" data-page="' + p + '">';
			
			if($.fn.dribbbleshot.settings.showPaginationPages) {
				markup += p;
			}
			
			markup += '</a>';
		}
		
		markup += '<a class="dribbbleshot-pagination-next">' + $.fn.dribbbleshot.settings.paginationNextText + '</a>';
		markup += '</div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.dribbbleshot.defaults = {
		format : $.fn.dribbbleshot.format,
		page : 1,
		per_page : 15,
		shotClass : "dribbble-shot",
		showPaginationControls : true,
		showPaginationPages : false,
		paginationPreviousText : "Previous",
		paginationNextText : "Next"
	};
	
	
}(jQuery));
