maxDefaultHeight = 400; //max height of an image before expansion
headerHeight = 74; //the thing that says Omegle, talk to strangers, etc.
lineHeight = 26; //text is 15px, linespacing is 15px, -4 cause in practice it seems more accurate
moreshit = false; //this is just for making the load-on-scroll stuff happen only once in testing purposes

$(document).ready(function(){
	resizeSearchContainer();
});

$(window).resize(function(){
	resizeSearchContainer();
});

$(window).load(function(){
	$('.span6.offset1.img-polaroid').each(function(){
		cropImage($(this));
	});

	$('.span6.offset1.img-polaroid').click(function(){   //Code the expand the image when you click it
		var imageHeight = $(this).find('img').height();
		var offset = $(this).offset();

		if (imageHeight < maxDefaultHeight){return;}  //don't do anything if it's too small to expand

		if ($(this).hasClass('open')) { //if its already open, close it
			$('html, body').animate({
					scrollTop: offset.top - 55 - 22,
			}, 300);
			$(this).animate({
			    height: maxDefaultHeight,
			}, 300);
			cropImage($(this));
			$(this).removeClass('open');
			if (imageHeight>500) {
				$(this).siblings('.span3.control-container').find('.controls').removeClass('stickable');
				jQuery.waypoints('refresh');
			}
		}
		else {
			var imageHeight = $(this).find('img').height(); //otherwise, open it
			$(this).animate({
			    height: imageHeight,
			}, 300);
			$(this).find('img').animate({
			    top: 0,
			}, 300);
			// alert("Top: "+offset.top+". Left: "+offset.left+"");
			$('html, body').animate({
					scrollTop: offset.top - 55 - 25,
			});
			$(this).addClass('open');
			if (imageHeight>500) {
				$(this).siblings('.span3.control-container').find('.controls').addClass('stickable');
				jQuery.waypoints('refresh');
			} //make the controls stickable if the image is tall enough
		}
	});

	$('.line-number').click(function(){
		var imageContainer = $(this).parents('.span3.control-container').siblings('.span6.offset1.img-polaroid');
		var image = imageContainer.find('img');
		var imageHeight = image.height();
		var lineOfInterest = image.attr('data-linenumber');

		if(!image.hasClass('open'))  //if the image isn't open, open it
		{
			imageContainer.animate({
			    height: imageHeight,
			}, 300);
			image.animate({
			    top: 0,
			}, 300);
			imageContainer.addClass('open');
			if (imageHeight>500) {
				imageContainer.siblings('.span3.control-container').find('.controls').addClass('stickable');
				jQuery.waypoints('refresh');
			}
		}
		var offsetVal = Math.max(imageContainer.offset().top -55, headerHeight + (lineHeight*lineOfInterest) -200 + imageContainer.offset().top);
		var offsetVal = Math.min(offsetVal, imageHeight + imageContainer.offset().top - 455) 
		// alert("Offsetval: "+offsetVal+". Top:"+imageContainer.offset().top+"");
		$('html, body').animate({
					scrollTop: offsetVal,
			});

	});

	$('.info-button').click(function() {
		$('#info-modal').modal('show');
	});

	$('.flag-chat').click(function(){
		$('#flag-modal').modal('show');
	});

	$('#submit-flag').click(function(){
		$('.submit-flag-alert').fadeIn(200);
	});

	$('.modal-footer .btn').click(function(){
		$('body').scrollTop() = 0;
	});

	$('#top-of-chat').click(function(){
		document.getElementById('image-contain').scrollTop = 0;
	})

	$('.search-control-item.selected a').click(function(){   //this is for when you already have this picture selected. would need another for when you have to load the new image first.
		var lineOfInterest = $(this).attr('data-linenumber');
		var containerHeight = $('#image-contain').height();
		var imageHeight = $('#image-contain img').height();
		var lineHeight = 25;  //the image is squished a bit in this veiw so lineheight is smaller
		// alert("Line: "+lineOfInterest+". Container: "+containerHeight+". Image: "+imageHeight+".");
		// x = headerHeight + lineHeight*lineOfInterest - (containerHeight/2);
		// y= containerHeight-imageHeight;
		// alert("Container-image: "+y+". Normal: "+x+"");
		document.getElementById('image-contain').scrollTop = Math.min((containerHeight-imageHeight-60)*-1, headerHeight + lineHeight*lineOfInterest - (containerHeight/2));
	})

	$('.up-section, .down-section').click(function(){ //for vote button clicking
		$(this).toggleClass('pressed');
		if ($(this).siblings('.span1').hasClass('pressed')) {$(this).siblings('.span1').toggleClass('pressed')};
	});

	$('.chat-link input').click(function(){
		$(this).select();
	});

	$('.controls').waypoint(function(event, direction){
		if (!$(this).hasClass('stickable')) {return;}
		if (direction=='down' && !$(this).hasClass('stuck-to-bottom')){
				$(this).css({'position':'fixed',
							'top':'70px'}).addClass('sticky-controls');
		}
		if (direction=='up' && $(this).hasClass('stuck-to-bottom')) {
			$(this).css({'position': 'fixed',
						  'top':'90px'}).removeClass('stuck-to-bottom').addClass('sticky-controls');
		}
	}, {offset:70});

	$('.item-divider').waypoint(function(event, direction){
		controller = $(this).prev('.results-item').find('.controls');
				if (!controller.hasClass('stickable')) {
					return;}
		if (direction=='down'){
			var itemHeight = $(this).prev('.results-item').find('.row').height();
			var controlsHeight = controller.height();
										// alert('row height: '+itemHeight+' controller height: '+controlsHeight+'');
			controller.css({'position': 'relative',
							'top': itemHeight-controlsHeight-54}).removeClass('sticky-controls').addClass('stuck-to-bottom');
		}
		else if (!controller.hasClass('sticky-controls')){
			controller.css({'position': 'fixed',
						  'top':'70px'}).removeClass('stuck-to-bottom').addClass('sticky-controls');
		}
	}, {offset:345});

	$('.results-item').waypoint(function(event, direction){
		controller = $(this).find('.controls');
		if (direction=='up'){		
			controller.css({'position': '',
 							'top':''	}).removeClass('sticky-controls');
		}
	}, {offset:70});

	$(window).scroll(function() {
		//for 9gag style page
		// var x = ($(window).height() + $(window).scrollTop());
	    if ($('body').height() <= ($(window).height() + $(window).scrollTop()) && moreshit==false) {
		     $('.item-divider:last').after('<div class="results" style="display: none; padding-top:0"><span> Loading more shit</span></div><hr>');
		     $('.results:last').delay('400').fadeIn('slow');
		     moreshit=true;
	    }
	});

	// $('*').click(function(){
	// 	alert(this.scrollTop);
	// 	$(this).css('border', '3px solid red')
	// 	return false;
	// });

	$(document).keydown(function(e){  //Arrow key nav for random and top page
	    var code = (e.keyCode ? e.keyCode : e.which);
	    var tops = [];
	    var dividersInView = $('.results-item:in-viewport');
	    // if (dividersInView.length > 1) {

	    // }
	    // else {
	    // 	dividersInView.next('.item-divider').scrollTop();
	    // }
	    // // dividersInView.each(function(i){
	    // // 	top[i] = $(this).scrollTop();
	    // // });

	    if (code == 38) { //up
	       
	     }
	    if (code == 40) { //down
	    	// alert(dividersInView.scrollTop());
	    	alert(dividersInView.nextAll('.results-item').first().scrollTop());
	    	dividersInView.nextAll('.results-item').first().css('border-color', 'red')
	    	$('html,body').scrollTop(dividersInView.nextAll('.results-item').first().scrollTop());
	    }
	});
});



$('#search-controls-contain').scroll(function(){ //for search results div in search page
	var realHeight = document.getElementById('search-controls-contain').scrollHeight;
	// alert(realHeight);
	if (realHeight <= $(this).height() + $(this).scrollTop() +50 && moreshit==false){
		$('.search-control-item:last').after('<div class="search-control-item loading-more">Loading More Results</div>');
		moreshit=true;
	}
});

//If you pass a plain .controls going down, add .sticky-controls.
//If you pass 357px above a .results-item going down, set the above .controls to .stuck-to-bottom.
//If you pass .stuck-to-bottom.controls going down, do nothing.
//If you pass a .stuck-to-bottom.controls going up, switch to .sticky-controls.
//If you pass 357px above a .results-item going up, set the above .controls to .stick-controls unless already set.
//If you pass a .results-item going up, set the containing .controls to plain.

function cropImage(container){
	var lineOfInterest = container.find('img').attr('data-linenumber');
	var imageHeight = container.find('img').height();

	if (imageHeight < maxDefaultHeight){
		container.height(imageHeight);
	}
	else {
		var offsetVal = Math.min(imageHeight - maxDefaultHeight, headerHeight + lineHeight*lineOfInterest - (maxDefaultHeight/2));
		if (offsetVal < 0) {offsetVal=0}  //we don't want a positive offset, that puts whitespace above the image
		if (container.hasClass('open')){    //animate it if its being called to close an open chat
			container.find('img').animate({
			    top: -offsetVal,
			}, 300);
		}
		else {  //if its being called on load, don't animate
			container.find('img').css('top',-offsetVal);			
		}
	}
}

function resizeSearchContainer(){
	var newContainerHeight = $(window).height()-75-80;
	$('.container.no-overflow').height(newContainerHeight);
	$('body').height($('body').height()-60);
}
