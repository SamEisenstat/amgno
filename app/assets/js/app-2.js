maxDefaultHeight = 400; //max height of an image before expansion
headerHeight = 74; //the thing that says Omegle, talk to strangers, etc.
lineHeight = 26; //text is 15px, linespacing is 15px, -4 cause in practice it seems more accurate

$(document).ready(function(){
});

$(window).load(function(){
	$('.span6.offset1.img-polaroid').each(function(){
		cropImage($(this));
	});

	$('.controls').stickySidebar({speed: 0, padding: 55, constrain: true});

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
			$(this).siblings('.control-container').height(maxDefaultHeight);
			$(this).removeClass('open');
			if (imageHeight>500) {
				$(this).siblings('.span3.control-container').find('.controls').removeClass('stickable');
				// jQuery.waypoints('refresh');
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
			$(this).siblings('.control-container').height(imageHeight);
			$(this).addClass('open');
			if (imageHeight>500) {
				$(this).siblings('.span3.control-container').find('.controls').addClass('stickable');
				$(this).siblings('.span3.control-container').find('.controls').stickySidebar({speed: 0, padding: 0, constrain: true})
				// jQuery.waypoints('refresh');
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
				// jQuery.waypoints('refresh');
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

	$('.up-section, .down-section').click(function(){ //for vote button clicking
		$(this).toggleClass('pressed');
		if ($(this).siblings('.span1').hasClass('pressed')) {$(this).siblings('.span1').toggleClass('pressed')};
	});

	$('.chat-link input').click(function(){
		$(this).select();
	});
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