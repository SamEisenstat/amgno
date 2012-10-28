maxDefaultHeight = 400; //max height of an image before expansion
headerHeight = 74; //the thing that says Omegle, talk to strangers, etc.
lineHeight = 26; //text is 15px, linespacing is 15px, -4 cause in practice it seems more accurate
moreshit = false; //this is just for making the load-on-scroll stuff happen only once in testing purposes
navbarHeight = 55;
stickyControllers = [];

$(window).load(function(){
	//Add a bunch of callbacks to keep each sticky element in the right place
	$('.controls').each(function(){ 
		var footer = $(this).parents('.results-item').next('.item-divider');
		initSticky($(this), footer);
	});

	//Initialize Modals
	$('.info-button').click(function() {
		$('#info-modal').modal('show');
	});

	$('.flag-chat, .report-chat').click(function(){ //flag-chat is just the flag on the search page, .report-chat is the whole div on the top/random page
		$('#flag-modal').modal('show');
	});

	//Thanks you for submitting flag, needs to happen after flag is actaully sent
	$('#submit-flag').click(function(){
		$('.submit-flag-alert').fadeIn(200);
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
	
	//for vote button clicking
	$('.up-section, .down-section').click(function(){ 
		$(this).toggleClass('pressed');
		if ($(this).siblings('.span1').hasClass('pressed')) {$(this).siblings('.span1').toggleClass('pressed')};
	});

	//To make the chat url box select on click
	$('.chat-link input').click(function(){
		$(this).select();
	});

	//Registers a callback that keeps the given sticky in its correct position
	function initSticky(sticky, footer){
		var stickyTop = sticky.offset().top; 
		var footerTop = footer.offset().top; 
		var stickyHeight = sticky.height();
		var limit = footerTop - stickyHeight - 15;
		stickyControllers.push(function(){
			var padding = navbarHeight + 15;
			var windowTop = $(window).scrollTop();
			  
			if (stickyTop < windowTop + padding){
			   sticky.css({ position: 'fixed', top: padding });
			}
			else {
			   sticky.css('position','static');
			}
			  
			if (limit < windowTop + padding) {
				var diff = limit - windowTop;
				sticky.css({top: diff});
			}     
		});
	}

	$(window).scroll(function() {
		//Gives the callbacks to the window scroll event
		for (var index in stickyControllers){
			stickyControllers[index]();
		}

		//For continuous scrolling
		//Needs ajax, right now just adds a div when you hit the bottom
		//The "moreshit" flag is purely for this demonstration, so that it only does it once
	    if ($('body').height() <= ($(window).height() + $(window).scrollTop()) && moreshit==false) {
		     $('.item-divider:last').after('<div class="results" style="display: none; padding-top:0"><span> Loading more shit</span></div><hr>');
		     $('.results:last').delay('400').fadeIn('slow');
		     moreshit=true;
	    }
	});

	//Arrow key nav for random and top page
	$(document).keydown(function(e){  
	    
	    var code = (e.keyCode ? e.keyCode : e.which);
	    var tops = [];
	    var topImgInView = $('.row:in-viewport:first'); //set to row instead of img to prevent issues with images that are smaller than the controller

	    if (code == 38) { //up
	    	e.preventDefault();
	    	if (topImgInView.is($('.row:first')) && topInView(topImgInView)){ //if you push up and you're on the top of the top image
	    		$('html,body').scrollTop(0);
	    	}
	    	else{ //otherwise, behave normally
	    		$('html,body').scrollTop(topImgInView.parents('.results-item').offset().top-navbarHeight-22);
	    	}
	     	return;
	     }
	    if (code == 40) { //down
	    	e.preventDefault();
	    	if ($(window).scrollTop() < $('.results-divider').offset().top - navbarHeight){ //if user hasn't scrolled past the first chat
	    		$('html,body').scrollTop($('.results-divider').offset().top-navbarHeight);
	    	}
	    	else if (bottomInView(topImgInView)){
	     		$('html,body').scrollTop(topImgInView.parents('.results-item').next('.item-divider').offset().top-navbarHeight);
	    	}
		    else{
		    	$('html,body').scrollTop(topImgInView.parents('.results-item').nextAll('.item-divider').eq(1).offset().top-navbarHeight);
		    }
		    return;
	    }
	});
	
	//function that checks if the bottom of an image is in view,
	//taking into account the navbar. For arrow key traversing.
	function bottomInView(image){     
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
	function topInView(image){     
		imageTop = image.offset().top; 
		documentScroll = $(window).scrollTop();
		if(imageTop - documentScroll >= navbarHeight){
			return true;
		}			
		else{
			return false;
		}			
	}

	//-------------------Search Page Below Here---------------------
	//for "Top Of Chat" button in the search page
	$('#top-of-chat').click(function(){
		document.getElementById('image-contain').scrollTop = 0;
	})

	//When you click a specific result snippet in the search page.
	//This is for when you already have this picture selected.
	//Would need another for when you have to load the new image first.
	$('.search-control-item.selected a').click(function(){   
		var lineOfInterest = $(this).attr('data-linenumber');
		var containerHeight = $('#image-contain').height();
		var imageHeight = $('#image-contain img').height();
		var headerHeight = 68; //the image is squished a bit in this veiw so headerheight is smaller
		var lineHeight = 25;  //same with lineHeight
		document.getElementById('image-contain').scrollTop = Math.min((containerHeight-imageHeight-60)*-1, headerHeight + lineHeight*lineOfInterest - (containerHeight/2));
	});
});

//To load more search results when you hit the bottom of the search results div
$('#search-controls-contain').scroll(function(){ 
	var realHeight = document.getElementById('search-controls-contain').scrollHeight;
	if (realHeight <= $(this).height() + $(this).scrollTop() +50 && moreshit==false){
		$('.search-control-item:last').after('<div class="search-control-item loading-more">Loading More Results</div>');
		moreshit=true;
	}
});

//Resizes the container so the contents take up the whole window, without any scrolling
//In a document.ready so that you don't see the huge image for a split second
$(document).ready(function(){
	resizeSearchContainer();
});

$(window).resize(function(){
	resizeSearchContainer();
});

function resizeSearchContainer(){
	var newContainerHeight = $(window).height()-75-80;
	$('.container.no-overflow').height(newContainerHeight);
	$('body').height($('body').height()-60);
}
