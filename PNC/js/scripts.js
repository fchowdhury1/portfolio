$(document).ready(function() {
	if ($("#terms").length > 0) {
	var termposition = $('#terms').offset().top;
	  $(".prgdetails").click(function() {
			$(".bot").toggle();
			$(".progdetails-iframe-container").toggle();
			$('html, body').animate({scrollTop:termposition}, 'fast');
			return false;
	   });
	}
	  $('a.benfeatlink').click(function(e){
		  e.preventDefault();
		  var getposition = $(this).position();
		  var getsrc = $(this).attr('href');
		  var getitle = $(this).attr('rel');
		  $('#benrateiframe').attr('src',getsrc);
		  $('.iframecontainer h2').html(getitle)
		  $('.iframecontainer').css({
			  top: getposition.top -150 + "px",
        	  left: getposition.left - 100 + "px"
		  }).show();
		  //return false;
	  });
	  
	  $('.btn-close').click(function(){
		$(this).parent().hide();
		return false; 
	  })
	   
	 
	 
		  
 });


/*function clickfloodlight() {
	//alert(hreflink)
	var axel = Math.random() + "";
	var a = axel * 10000000000000;
	
	
	document.write('<iframe src=""https://fls.doubleclick.net/activityi;src=3072892;type=credi337;cat=1084212;ord=' + a + '?"" width=""1"" height=""1"" frameborder=""0"" style=""display:none""></iframe>');
	document.write('<noscript>');
	document.write('<iframe src=""https://fls.doubleclick.net/activityi;src=3072892;type=credi337;cat=1084212;ord=1?"" width=""1"" height=""1"" frameborder=""0"" style=""display:none""></iframe>');
	document.write('</noscript>');
}
*/

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

