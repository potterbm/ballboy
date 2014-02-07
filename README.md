ballboy
============

A jQuery plugin to fetch a user's shots from Dribbble and display them.

## Usage

If you had a friend whose Dribbble ID was 'exampleplayer' (which would be a dumb ID to have) and who had posted 20 shots, then you could use this HTML
```html
<script src="/path/to/jquery/jquery.js"></script>
<script src="/path/to/plugin/ballboy.js"></script>
<div id="ballboy-shots"></div>
```

and this Javascript
```javascript
$(document).ready(function(e) {
	
	$("#ballboy-shots").ballboy({
		player : "exampleplayer"
	});
	
});
```

to  get this HTML
```html
<div id="ballboy-shots" class="ballboy-container">
	<div class="ballboy-shot"> ... </div>
	<div class="ballboy-shot"> ... </div>
	...
	<div class="ballboy-shot"> ... </div>
	
	<div class="ballboy-pagination">
		<span class="ballboy-pagination-previous disabled">Previous</span>
		<span class="ballboy-pagination-page ballboy-pagination-current" data-page="1"></span>
		<span class="ballboy-pagination-page" data-page="2"></span>
		<span class="ballboy-pagination-next">Next</span>
	</div>
</div>
```


## Configuration

### Options

* `format(shot)` - This function is passed [an object](http://dribbble.com/api#get_player_shots) containing data about a single shot. It returns a DOM element representing that shot.

* `page` - The desired page of results. The results are returned by the Dribbble API in the reverse order they were posted (newest first). Combined with `per_page` this determines the offset of results. Default of `1`.

* `per_page` - The number of results to show on each page. This cannot be more than 30 (a constraint of the Dribbble API). Default of `15`.

* `shotClass` - A class to apply to each shot on the page. Default of `ballboy-shot`.

* `showPaginationControls` - A boolean value that determines whether or not to show next/previous links and page bubbles. Default of `true`.

* `showPaginationPages` - A boolean value that determines whether or not each page bubble will be numbered. Default of `false`.

* `paginationPreviousText` - A string that will be used as the text of the previous page element. Default of `Previous`.

* `paginationNextText` - A string that will be used as the text of the next page element. Default of `Next`.


### Event Handlers

Behind the scenes ballboy.js used a jQuery Deferred object to access the Dribbble API. This means that any callback function you provide as one of the following options can expect to be passed the information given out by the Deferred object.

* `begin` - This option takes a function that executes just before ballboy.js makes the call to the Dribbble API. The function is passed a jQuery collection with only the container element.

* `always` - This option takes a function which executes when the Deferred object resolves, whether or not the API call succeeds or fails.

* `fail` - This option takes a function which executes if the API call fails. This would be a great place to put some sort of error handling, as ballboy.js does not do any for you.

* `done` - This option takes a function which executes if the API call succeeds. The provided function (if any) will be executed before ballboy.js does its thing with the data returned.

* `finished` - This option takes a function which will be executed if the API call succeeds and after ballboy.js marks up the page. This function is passed [an object](http://dribbble.com/api#get_player_shots) which is the response received from the Dribbble API.


## Pagination

There are several classes in use for pagination. Here are some useful ones, mostly in order.

* `.ballboy-pagination` - This class is applied to a container element for all the pagination elements. The container element will also have a `data-current-page` attribute containing the number of the current page.

* `.ballboy-pagination-previous` - This class is applied to the "previous page" element.

* `.disabled` - This class is applied to the "previous page" element on the first page, and the "next page" element on the last page.

* `.ballboy-pagination-page` - This class is applied to each page bubble, regardless of whether `showPaginationPages` is true or false. Each page bubble will also have a `data-page` attribute containing the number of the page it represents.

* `.ballboy-pagination-current` - This class is applied to only the page bubble that represents the current page.

* `.ballboy-pagination-next` - This class is applied to the "next page" element.


## Visual Styles

An example CSS file is included with this plugin, but it is meant to be more of a guide of what could be possible than a production-ready stylesheet. That said, feel free to use it in any capacity that you wish.
