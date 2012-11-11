//maxDefaultHeight = 400; //max height of an image before expansion
//headerHeight = 74; //the thing that says Omegle, talk to strangers, etc.
//lineHeight = 26; //text is 15px, linespacing is 15px, -4 cause in practice it seems more accurate
navbarHeight = 55;
moreLogs = true;
var searchPage, randomPage;

$(document).ready(function(){
	randomPage = $("#random-page").length !== 0;
	searchPage = $("#search-page").length !== 0;
	topPage    = $("#top-page")   .length !== 0;
});

$(window).load(function(){
	//Initialize Modals
	$('.info-button').click(function() {
		$('#info-modal').modal('show');
	});

	//flag-chat is just the flag on the search page, .report-chat is the whole div on the top/random page
	$('.container').on('click', '.flag-chat, .report-chat', function(){ 
		$('#flag-modal').modal('show');
	});

	//Thanks you for submitting flag, needs to happen after flag is actaully sent
	$('#submit-flag').click(function(){
		$('.submit-flag-alert').fadeIn(200);
	});

	//Removes the "thank you" message after the modal is dismissed.
	$('.modal-dismiss').click(function(){
		$('.submit-flag-alert').fadeOut(0);
	});

	//Fixes bug on search page where clicking to an anchor in the info modal made the page scroll.
	// Stopped happening once I removed the overflow:hidden. 
	// $('.modal-footer .btn').click(function(){
	// 	$('body').scrollTop() = 0;
	// });

	//Manually scrolls to the question anchors in the info-modal because if we use
	// actually anchors, it scrolls the background too.
	$('.modal-body li a').click(function(e){
		e.preventDefault();
		anchor = $(this).attr('href');
		anchorScrollTop = $('#'+anchor).offset().top;
		modalOffset = $('#info-modal').offset().top;
		modalHeader = 58;
		$('.modal-body').scrollTop(anchorScrollTop-modalOffset-modalHeader);
	});
	
	//For vote button clicking
	$('.container').on('click', '.up-section, .down-section', function(){ 
		toggleVote($(this));
		if ($(this).siblings('.span1').hasClass('pressed')) {
			toggleVote($(this).siblings('.span1'));
		}
	});

	//Sends a request to the server to vote and changes the appearence of the vote button.
	function toggleVote(voteButton) {
		var delta = voteButton.hasClass("pressed") ? -1 : 1;
		votes = voteButton.find("span");
		votes.text(parseInt(votes.text()) + delta);
		voteButton.toggleClass("pressed");

		var voteType = voteButton.hasClass("up-section") ? "upvote" : "downvote";
		$.post("votes/"+$.base64.encode(voteButton.attr('data-url'))+
				"/"+voteType);
	}

	//To make the chat url box select on click
	$('.container').on('click', '.chat-link input', function(){
		$(this).select();
	});

	//For continuous scrolling
	function autoload(scrollable, currentHeight, loadDistance, loadingMessage, url) {
		scrollable.scroll(function() {
			if(currentHeight() <= scrollable.height() + scrollable.scrollTop() + loadDistance
					&& $('.loading-message').length == 0 && moreLogs) {
				$('.autoload-item:last').after('<div class="loading-message">' + loadingMessage + '</div>');
				$('.loading-message').fadeIn(200);
				$.getScript(url(), function(data) {
					$('.loading-message').remove();
				});
			}
		});
	}

	// The following should only run on the random page and the top page.
	if(randomPage || topPage) {
		$(window).scroll(function() {
			//Gives the callbacks to the window scroll event
			$('.controls').each(function() {
				var footer = $(this).closest('.results-item').next('.item-divider');
				var stickyTop = $(this).closest('.control-container').offset().top; 
				var footerTop = footer.offset().top; 
				var stickyHeight = $(this).height();
				var limit = footerTop - stickyHeight - 15;
				var padding = navbarHeight + 15;
				var windowTop = $(window).scrollTop();

				if (stickyTop < windowTop + padding){
					$(this).css({ position: 'fixed', top: padding });
				}
				else {
					$(this).css('position','static');
				}

				if (limit < windowTop + padding) {
					var diff = limit - windowTop;
					$(this).css({top: diff});
				} 
			});
		});

		//Load more logs on the random page.
		autoload($(window), function(){return $(document).height()}, 1500,
				'<div class="results">'+
				'<span>Loading more chats</span></div><hr>', function(){
					if(randomPage) {
						return "logs/more"
					} else {
						return "logs/more_top?start=" + $('.autoload-item').length;
					}
				});

		//Arrow key nav for random and top page
		$(document).keydown(function(e)	{
			var code = (e.keyCode ? e.keyCode : e.which);
			var tops = [];
			var topImgInView = $('.row:in-viewport:first'); //set to row instead of img to prevent issues with images that are smaller than the controller

			if (code == 38) { //up
				e.preventDefault();
				if (topImgInView.is($('.row:first')) && topInView(topImgInView)){ //if you push up and you're on the top of the top image
					$('html,body').scrollTop(0);
				}
				else{ //otherwise, behave normally
					$('html,body').scrollTop(topImgInView.closest('.results-item').offset().top-navbarHeight-22);
				}
				return;
			}
			if (code == 40) { //down
				e.preventDefault();
				if ($(window).scrollTop() < $('.results-divider').offset().top - navbarHeight){ //if user hasn't scrolled past the first chat
					$('html,body').scrollTop($('.results-divider').offset().top-navbarHeight);
				}
				else if (bottomInView(topImgInView)){
					$('html,body').scrollTop(topImgInView.closest('.results-item').next('.item-divider').offset().top-navbarHeight);
				}
				else{
					$('html,body').scrollTop(topImgInView.closest('.results-item').nextAll('.item-divider').eq(1).offset().top-navbarHeight);
				}
				return;
			}
		});
		
		//function that checks if the bottom of an image is in view,
		//taking into account the navbar. For arrow key traversing.
		function bottomInView(image) {
			imageBottom = image.offset().top + image.height();
			documentScroll = $(window).scrollTop();
			if(imageBottom - documentScroll >= navbarHeight){
				return true;
			}			
			else{
				return false;
			}			
		}

		//function that checks if the top of an image is in view,
		//taking into account the navbar. For arrow key traversing.
		function topInView(image) { 
			imageTop = image.offset().top; 
			documentScroll = $(window).scrollTop();
			if(imageTop - documentScroll >= navbarHeight){
				return true;
			}			
			else{
				return false;
			}			
		}
	}
	else if(searchPage) {
		//-------------------Search Page Below Here---------------------
		//for "Top Of Chat" button in the search page
		$('.container').on('click', '.top-of-chat', function(){
			$(this).closest('.image-container').find('.search-result-scroll').scrollTop(0);
		})

		//Make the popover select on click.
		$('body').on('click', '.popover input', function(){
			$(this).select();
		});

		//Show the appropriate image and, if a specific snippet was clicked on,
		//scroll to the appropriate place in the log.
		$('#search-controls-contain').on('click', '.search-control-item', function(event) {
			if(!$(this).hasClass("selected")) {
				showResult(matchToIndex($(this)));
			}
			scrollToResult($(event.target).closest("a"));
		});

		//Scrolls the container with the image of the chat to reach the chosen
		//line.
		function scrollToResult(match) {
			var lineOfInterest = match.attr('data-linenumber');
			var imageContainer = $('.search-result-scroll').eq(matchToIndex(match));
			var containerHeight = imageContainer.height();
			var imageHeight = imageContainer.find('img').height();
			var headerHeight = 68; //the image is squished a bit in this veiw so headerheight is smaller
			var lineHeight = 25;  //same with lineHeight
			imageContainer.scrollTop(Math.min((containerHeight-imageHeight-60)*-1, headerHeight + lineHeight*lineOfInterest - (containerHeight/2)));
		};

		//To load more search results when you hit the bottom of the search results div
		autoload($('#search-controls-contain'),
			function(){return $('#search-controls-contain')[0].scrollHeight;}, 500,
			'<div class="search-message-item loading-more">'+
			'Loading more results</div>', function(){
				return "logs/more?search=" + decodeURI(/search=(.+?)(&|$)/.
					exec(location.search)[1]) +
					"&start=" + $('.autoload-item').length});
	}
});

$(document).ready(function(){
	if(searchPage) {
		//Resizes the container so the contents take up the whole window, without any scrolling
		//and hides all but the first search result.
		//In a document.ready so that you don't see the huge image for a split second
		$(document).ready(function(){
			showResult(0);
			resizeSearchContainer();
		});

		$(window).resize(function(){
			resizeSearchContainer();
		});
	}
});

function resizeSearchContainer(){
	var newContainerHeight = $(window).height()-75-80;
	$('.container.no-overflow').height(newContainerHeight);
	$('body').height($('body').height()-60);
	$('.search-result-scroll').height(newContainerHeight-55);
}

//Shows the image-container for the specified search result and hides all the
//other ones. Also ensures that clickovers are initialized properly.
function showResult(showIndex) {
	$('.search-control-item').removeClass('selected');
	$('.search-control-item').eq(showIndex).addClass('selected');

	$('.image-container').hide();
	var selectedImage = $('.image-container').eq(showIndex).show();
	if(typeof selectedImage.data('clickoverAdded') === 'undefined') {
		selectedImage.find('.direct-link').clickover();
		selectedImage.data('clickoverAdded', true);
	}
}

//Finds the index of the given search link.
function matchToIndex(match) {
	return $('.search-control-item').index(match.closest('.search-control-item'));
}
