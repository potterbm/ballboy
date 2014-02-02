dribbbleshot
============

A jQuery plugin to fetch a user's shots from Dribbble and display them.

## Usage

If you had a friend whose dribbble ID was 'exampleplayer' (which would be a dumb ID to have) and who had posted 20 shots, then you could use this HTML
```html
<script src="/path/to/jquery/jquery.js"></script>
<script src="/path/to/plugin/dribbbleshot.js"></script>
<div id="dribbble-shots"></div>
```

and this Javascript
```javascript
$(document).ready(function(e) {
	
	$("#dribbble-shots").dribbbleshot({
		player : "exampleplayer"
	});
	
});
```

to  get this HTML
```html
<div id="dribbble-shots" class="dribbbleshot-container">
	<div class="dribbble-shot"> ... </div>
	<div class="dribbble-shot"> ... </div>
	...
	<div class="dribbble-shot"> ... </div>
	
	<div class="dribbbleshot-pagination">
		<span class="dribbbleshot-pagination-previous disabled">Previous</span>
		<span class="dribbbleshot-pagination-page dribbbleshot-pagination-current" data-page="1"></span>
		<span class="dribbbleshot-pagination-page" data-page="2"></span>
		<span class="dribbbleshot-pagination-next">Next</span>
	</div>
</div>
```


## Configuration

### Options

* `format(shot)` - This function is passed (an object)[http://dribbble.com/api#get_player_shots] containing data about a single shot. It returns a DOM element representing that shot.

* `page` - The desired page of results. The results are returned by the Dribbble API in the reverse order they were posted (newest first). Combined with `per_page` this determines the offset of results. Default of `1`.

* `per_page` - The number of results to show on each page. This cannot be more than 30 (a constraint of the Dribbble API). Default of `15`.

* `shotClass` - A class to apply to each shot on the page. Default of `dribbble-shot`.

* `showPaginationControls` - A boolean value that determines whether or not to show next/previous links and page bubbles. Default of `true`.

* `showPaginationPages` - A boolean value that determines whether or not each page bubble will be numbered. Default of `false`.

* `paginationPreviousText` - A string that will be used as the text of the previous page element. Default of `Previous`.

* `paginationNextText` - A string that will be used as the text of the next page element. Default of `Next`.


## Pagination

There are several classes in use for pagination. Here are some useful ones, mostly in order.

* `.dribbbleshot-pagination` - This class is applied to a container element for all the pagination elements. The container element will also have a `data-current-page` attribute containing the number of the current page.

* `.dribbbleshot-pagination-previous` - This class is applied to the "previous page" element.

* `.disabled` - This class is applied to the "previous page" element on the first page, and the "next page" element on the last page.

* `.dribbbleshot-pagination-page` - This class is applied to each page bubble, regardless of whether `showPaginationPages` is true or false. Each page bubble will also have a `data-page` attribute containing the number of the page it represents.

* `.dribbbleshot-pagination-current` - This class is applied to only the page bubble that represents the current page.

* `.dribbbleshot-pagination-next` - This class is applied to the "next page" element.


## Visual Styles

An example CSS file is included with this plugin, but it is meant to be more of a guide of what could be possible than a production-ready stylesheet. That said, feel free to use it in any capacity that you wish.
