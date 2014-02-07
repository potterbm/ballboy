(function($) {
	$.fn.ballboy = function(options) {
		
		// Sanitize options
		$.fn.ballboy.settings = $.extend({}, $.fn.ballboy.defaults, options);
		
		var settings = $.fn.ballboy.settings;
		
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
		settings.url = "http://api.dribbble.com/players/" + settings.player + "/shots?page=" + settings.page + "&per_page=" + settings.per_page + "&callback=?";
		
		
		
		// Allow chaining
		return this.each(function() {
			
			var $container = $(this).addClass("ballboy-container");
			
			if(typeof(settings.begin) == "function") {
				settings.begin($container);
			}
			
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
			
			request.done(function(response, textStatus, jqxhr) {
				
				if(jqxhr.status != 200) {
					return false;
				}
				
				$container.attr({
					"data-page" : response.page,
					"data-pages" : response.pages
				});
				
				
				// Pagination
				
				if($container.find(".ballboy-pagination").length > 0) {
					var $pagination = $container.find(".ballboy-pagination").detach();
				}
				else {
					var $pagination = $.fn.ballboy.pagination(response.pages, response.page);
				}
				
				$container.find(".ballboy-pagination .disabled").removeClass("disabled");
				
				if(parseInt(response.page) >= parseInt(response.pages)) {
					response.page = response.pages;
					$container.find(".ballboy-pagination-next").addClass("disabled");
				}
				
				if(parseInt(response.page) <= 1) {
					response.page = 1;
					$container.find(".ballboy-pagination-previous").addClass("disabled");
				}
				
				
				
				// Shots
				
				$container.empty();
				$.each(response.shots, function(index, element) {
					$container.append(settings.format(element));
				});
				$container.append($pagination);
				
				
				
				// Pagination events
				
				if(settings.bindPaginationEvents) {
					$container.find(".ballboy-pagination-previous:not(.disabled)").one("click", function(e) {
						settings["page"] = parseInt(response.page) - 1;
						$container.ballboy(settings);
					});
					
					$container.find(".ballboy-pagination-page").one("click", function(e) {
						settings["page"] = $(this).attr("data-page");
						$container.ballboy(settings);
					});
					
					$container.find(".ballboy-pagination-next:not(.disabled)").one("click", function(e) {
						settings["page"] = parseInt(response.page) + 1;
						$container.ballboy(settings);
					});
				}
				
				if(typeof(settings.finished) == "function") {
					settings.finished(response);
				}
			});

		});

	};


	$.fn.ballboy.format = function(shot) {
		var markup = '<div class="' + $.fn.ballboy.settings.shotClass + '" data-id="' + shot.id + '">';
	
		// Shot image
		markup += '<div class="ballboy-shot-image" data-src="' + shot.image_url + '" data-teaser-src="' + shot.image_teaser_url + '">';
		markup += '<a href="' + shot.url + '"><img src="' + shot.image_teaser_url + '" /></a>';
		
		// Shot title
		markup += '<a href="' + shot.url + '" class="ballboy-shot-image-description">';
		markup += '<h3>' + shot.title + '</h3>';
		markup += '</a>';
		
		markup += '</div>';
		
		// Extra stats
		markup += '<div class="ballboy-shot-extras">';
		if(parseInt(shot.rebounds_count) > 0) {
			markup += '<span class="ballboy-shot-rebound-marker"></span>';
		}
		markup += '<span class="ballboy-shot-view-count" data-view-count="' + shot.views_count + '"></span>';
		markup += '<span class="ballboy-shot-comment-count" data-comment-count="' + shot.comments_count + '"></span>';
		markup += '<span class="ballboy-shot-like-count" data-like-count="' + shot.likes_count + '"></span>';
		markup += '</div>';
		
		markup += '</div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.ballboy.pagination = function(pages, currentPage) {
		var markup = '<div class="ballboy-pagination" data-current-page="' + currentPage + '">';
		markup += '<a class="ballboy-pagination-previous">' + $.fn.ballboy.settings.paginationPreviousText + '</a>';
		
		var currentClass = '';
		for(var p = 1; p <= pages; p++) {
			
			if(p == currentPage) {
				currentClass = ' ballboy-pagination-current';
			}
			else {
				currentClass = '';
			}
			
			markup += '<a class="ballboy-pagination-page' + currentClass + '" data-page="' + p + '">';
			
			if($.fn.ballboy.settings.showPaginationPages) {
				markup += p;
			}
			
			markup += '</a>';
		}
		
		markup += '<a class="ballboy-pagination-next">' + $.fn.ballboy.settings.paginationNextText + '</a>';
		markup += '</div>';
		
		return $.parseHTML(markup);
	};
	
	
	$.fn.ballboy.defaults = {
		format : $.fn.ballboy.format,
		page : 1,
		per_page : 15,
		shotClass : "ballboy-shot",
		bindPaginationEvents : true,
		showPaginationControls : true,
		showPaginationPages : false,
		paginationPreviousText : "Previous",
		paginationNextText : "Next"
	};
	
	
}(jQuery));
