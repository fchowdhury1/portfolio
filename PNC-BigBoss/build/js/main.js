// See if border-radius is available
if (!Modernizr.borderradius) {
	// If not, then load in the jQuery Corners plugin and apply rounded corners to the article elements
		$(".button").corner("10px");	
}


var allPanels = $('#accordion .accordion-body').show();

var slider = $('.bxslider');

$(window).setBreakpoints({
// use only largest available vs use all available
    distinct: true, 
// array of widths in pixels where breakpoints
// should be triggered
    breakpoints: [
        320,
        480,
        768,
        1024
    ] 
});     


$(window).bind('enterBreakpoint320',function() {
    console.log('entering 320 breakpoint');
	if ($(slider).length) {
		 slider.bxSlider({
		 infiniteLoop: false,
		 adaptiveHeight: true
	});
	}
	allPanels.hide();
	$('.accordion-toggle').click(function() {
		allPanels.slideUp();
		$(this).next().slideToggle();
		return false;
	  });
	/*$('#accordion ul a.accordion-toggle').click(function(e){
	e.preventDefault();
    var $this = $(this);
    //var $collapse = $this.next('.accordion-body');
    $('.accordion-body').collapse('hide');*/
//})
});

$(window).bind('exitBreakpoint320',function() {
    console.log('Exiting 320 breakpoint');
	if ($(slider).length) {slider.destroySlider();}
});

$(window).bind('enterBreakpoint480',function() {
	console.log('enter 480 breakpoint');
	allPanels.hide();
	$('.accordion-toggle').click(function() {
		allPanels.slideUp();
		$(this).next().slideDown();
		return false;
	  });
});

$(window).bind('exitBreakpoint480',function() {
    console.log('Exiting 480 breakpoint');
	
});

$(window).bind('enterBreakpoint768',function() {
	console.log('enter 768 breakpoint');
	allPanels.hide();
	$('.accordion-toggle').click(function() {
		allPanels.slideUp();
		$(this).next().slideDown();
		return false;
	  });
	 
	
});

$(window).bind('exitBreakpoint768',function() {
    console.log('Exiting 768 breakpoint');
	allPanels.show();
});

$(window).bind('enterBreakpoint1024',function() {
    console.log('enter 1024 breakpoint');
	allPanels.show();
});

$(window).bind('exitBreakpoint1024',function() {
    console.log('Exiting 1024 breakpoint');
	allPanels.show();
	
});


