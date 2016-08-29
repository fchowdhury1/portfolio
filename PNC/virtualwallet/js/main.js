function clickfloodlight(linkloacation, dartnum) {
    var axel = Math.random() + "";
    var a = axel * 10000000000000;
    var iframe = document.createElement('iframe');
    iframe.style.display = "none";
    iframe.src = 'https://fls.doubleclick.net/activityi;src=3072892;type=credi337;cat='+ dartnum +';ord='+ a +'?';
    iframe.onload = function() {leave(linkloacation)};
    document.body.appendChild(iframe);
    setTimeout(function(){leave(linkloacation)}, 1000);

}

function leave(alink) {
	//alert('leave')
    window.location = alink;
}

$(document).ready(function(){

        
		$('#compareButton').click(function (e) {
			$('#dialog').modal();
			return false;
		});

		$('.popup').popupWindow({ 
			height:500, 
			width:900, 
			top:50, 
			left:50 
		}); 

		$(".slider").mousedown(function () {
			$("#dragMe").fadeOut("slow");
		});

		$('.slider-lbl1').addClass("activeSlide");

		$('.slider-lbl1').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});

		$('.slider-lbl2').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});

		$('.slider-lbl3').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});

		$('.slider-lbl4').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});

		$('.slider-lbl5').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});

		$('.slider-lbl6').click(function (e) {
			$('.slider-lbl-base').removeClass("activeSlide");
			$(this).addClass("activeSlide");
			return false;
		});


		if (Modernizr.video) {
		var movie = $('#virtual-wallet-feature-detail-video');
			movie.onclick = function() {
			if (movie.paused) {
			  movie.play();
			} else {
			  movie.pause();
			}
		};

		$(".slider").mousedown(function () {
			$('video')[0].pause();
		});
		}



		
		window.onload = function () {
			
			

        var container = $('div.sliderGallery');
        var ul = $('ul');
        var testtest = $('.slider-lbl-base');

		
		var leftHolder;
        
        var itemsWidth = ul.innerWidth() - container.outerWidth();
		
	
	
	
			
		//console.log(itemsWidth); 
		 
        $('.slider', container).slider({
           /* min: 0,
            max: itemsWidth,
            step: 750,
			value:500,*/
			max: 1000, // Set "max" attribute to array length
			min: 0,
			value:75,
		 	stepValues: [ 75, 241, 414, 580, 740, 910 ],
            stop: function (event, ui) {
			
				
				//console.log(ui.value);
				switch(ui.value){
				case 75:
					ul.animate({'left' : 0}, 300);
					break;
				case 241:
					ul.animate({'left' : 746 * -1}, 300);
					break;
				case 414:
					ul.animate({'left' : 1490 * -1}, 300);
					break;
				case 580:
					ul.animate({'left' : 2236 * -1}, 300);
					break;
				case 740:
					ul.animate({'left' : 2981 * -1}, 300);
					break;
				case 910:
					ul.animate({'left' : 3726 * -1}, 300);
					break;
					
				default:
					ul.animate({'left' : 0}, 300);
				}
            	 

				
						
				//get the left position, remove the px, round it to whole number
				leftHolder = $('a.ui-slider-handle').position();	
						
				leftHolder = Math.round(leftHolder.left);
				
				
				
			//var position = $('a.ui-slider-handle').position();
			
			//console.log('and here: ' + position.left);	
				
			//remove the active state	
			$('.slider-lbl-base').removeClass("activeSlide");
						
			
			if (leftHolder < 50) {
				$('.slider-lbl1').addClass("activeSlide");
			
			} else if  (leftHolder > 50 && leftHolder < 200 ) {			
				$('.slider-lbl2').addClass("activeSlide");
			} else if  (leftHolder > 200 && leftHolder < 300 ) {			
				$('.slider-lbl3').addClass("activeSlide");
			} else if  (leftHolder > 300 && leftHolder < 400 ) {			
				$('.slider-lbl4').addClass("activeSlide");
			} else if  (leftHolder > 400 && leftHolder < 500 ) {			
				$('.slider-lbl5').addClass("activeSlide");
			} else if  (leftHolder > 500 ) {			
				$('.slider-lbl6').addClass("activeSlide");
			} 
				
				
				
				
            },
            slide: function (event, ui) {
				
				
				  var stepValues = $(this).slider("option", "stepValues"),
					  distance = [],
					  minDistance = $(this).slider("option", "max"),
					  minI;
					$.each(stepValues, function(i, val) {
					  distance[i] = Math.abs( ui.value - val );
					  if ( distance[i] < minDistance ) {
						minDistance = distance[i];
						minI = i;
					  }
					});
					if ( minDistance ) {
					  $(this).slider("value", stepValues[ minI ]);
					  return false;
					}
				 
				 
				 
            	$('ui-slider-handle').animate({'left' : "+=200"}, 300);
				if (ui.value > -1 && ui.value < 1 && ui.value != 0) {
				// force it to 0 between -1 and 1.
				jSlider.slider('value', 1); 
				
				
				return false;
				}
				return true;
			}
        });
		
		
		
		
		
		

		
		};

        /**** Comment this out for now just in case they really need left and right buttons for the carousel 

	       $(".btn-left").click(function(){
	       	console.log("left");
		       var elValue = $('.slider', container).slider('option', 'value');
			       if(elValue > 0) {
			          elValue = elValue - 740;
			          if(elValue < 0) {
		             elValue = 0;
		          }
			     $(".sliderGallery .slider").slider('value', elValue);
		          $(".sliderGallery ul").animate({'left' : elValue * -1}, 500);
			       }
			});
			$(".btn-right").click(function(){
				console.log("right");
			  var elValue = $('.slider', container).slider('option', 'value');
			       if(elValue < itemsWidth) {
			          elValue = elValue + 740; 
			          if(elValue > itemsWidth) {
		             elValue = itemsWidth;
		          }
		          $(".sliderGallery .slider").slider('value', elValue); 
		          $(".sliderGallery ul").animate({'left' : elValue * -1}, 500);
			       }

			});

		******/

		

});

