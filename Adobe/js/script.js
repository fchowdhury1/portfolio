
/* Author:

*/
if (!Modernizr.boxshadow) {
    // If not, then load in the jQuery Corners plugin and apply rounded corners to the article elements
    $('.shadowed').css({
        'background-image': 'url(../img/shadow.png)',
        'background-repeat': 'repeat-y',
        padding: '0 8px'
    });
    $('header').css({
        'background-image': 'url(../img/shadow.png)',
        'background-repeat': 'repeat-y',
        width: '998px'
    });
    $('footer div').css({
        'background-image': 'url(../img/shadow.png)',
        'background-repeat': 'repeat-y',
        width: '970px'
    });
    $('header .topheader').css({
        padding: '10px 10px 10px 80px'
    })
    $('.container').css({
        'background-image': 'url(../img/topshadow.png)',
        'background-repeat': 'no-repeat',
        'background-position': '0 0'
    })

}

if (!Modernizr.borderradius) {
    // If not, then load in the jQuery Corners plugin and apply rounded corners to the article elements
    //$.getScript("js/libs/jquery.corner.js", function () {
    $.fn.corner.defaults.useNative = false;
    $('#tabs ul a.active').corner('top 5px');
    $('#tabs ul li a').click(function () {
        $(this).addClass('active').corner('top 5px');
    });
    $('#menu').corner('bottom 5px');
	$('.directorymenu').corner('bottom 5px');
    $('.inputcontainer').corner('5px');
    $('.submenu').corner('cc:#fff');
    $('.widgets').wrap('<div class="outer" />');
    $('.widgets').corner('round 5px').css({
        'background-color': '#fff'
    });
    $('.outer').corner('round 5px');

    //$('.submenu').css('background-color','#ccc')
    //});
}

$(function () {
    $('nav ul li').mouseenter(function () {
        $this = $(this);
        $this.data("delay", setTimeout(function () {
            if ($('.submenu', $this).length == 1) {
                $('.submenu', $this).show();
                $this.addClass('selected')
            } else {
                $this.removeClass('selected')
            }
        }, 200));
    }).mouseleave(function () {
        $this = $(this);
        $this.removeClass('selected')
        $('.submenu', $this).hide();
        clearTimeout($this.data("delay"));
    });

});
/*$('nav ul li').hover(
function () {
    //show its submenu
    //console.log($(this).has('.submenu'))
    if ($('.submenu', this).length == 1) {
        $('.submenu', this).show();
        $(this).addClass('selected')
    } else {
        $(this).removeClass('selected')
    }
},

function () {
    //hide its submenu
    $(this).removeClass('selected')
    $('.submenu', this).hide();
});*/

$('.btn-profile').click(function () {
    $('#menu').slideToggle(100);
    $(this).toggleClass('openprofile')
    //$(this).parent("div").find(".btn-profile").toggleClass('openprofile')
})

$('.adobedir').click(function () {
    $('#directorymenu').slideToggle(100);
    $(this).toggleClass('openprofile')
    //$(this).parent("div").find(".btn-profile").toggleClass('openprofile')
})

//toggle the componenet with class msg_body
/*$('.heading').click(function () {
    $(this).find('h2').toggleClass('exapnded')
    $(this).next('.content').slideToggle(100);
    console.log($(this).closest())
    $(this).parent().find('.widgetmenu').toggle();
});*/

$('.widgetmenu').click(function (e) {
    e.preventDefault();
    $(this).addClass('openmenu')
    $(this).parent().find('.wmenucontent').show();


})
$('.link-close').click(function (e) {
    e.preventDefault();
    $(this).parent().parent().parent().parent().find('.widgetmenu').removeClass('openmenu')
    //console.log($(this).parent().parent().parent().parent().find('.widgetmenu').html())
    $(this).closest('.wmenucontent').hide();
})


//$('#tabs div').hide();
$('#tabs .tabscontainer:first').show();
$('#tabs ul a:first').addClass('active');

$('#tabs ul li a').click(function () {
    $('#tabs ul li a').removeClass('active');
    $(this).addClass('active');
    var currentTab = $(this).attr('href');
    $('#tabs .tabscontainer').hide();
    $(currentTab).show();
    return false;
});

$('#rsstabs .rsscontent:first').show();
$('#rsstabs ul a:first').addClass('active');

$('#rsstabs ul:first li a').click(function () {
    $('#rsstabs ul li a').removeClass('active');
    $(this).addClass('active');
    var currentTab = $(this).attr('href');
    $('.rsscontent').hide();
    $(currentTab).show();
    return false;
});

$('.rsscontent ul li a').click(function () {
    return false;
})

$('input[type=text]').focus(function () {
    if (this.value == this.title) {
        $(this).val("");
    }
}).blur(function () {
    if (this.value == "") {
        $(this).val(this.title);
    }
});


if ($('#sliders').length > 0) {
    //get the slideshow length and initialize the page slide variable to the length of thumbs shown
    var thumbLength = $('#inner-slider-nav li').size();
    var baseSlide = 4;
    var rotateFlag = false;

    $('#inner-slider').cycle({
        fx: 'scrollHorz',
        speed: 'fast',
        nowrap: 1,
        pause: true,
        pauseOnPagerHover: true,
        timeout: 7000,
        //autostop:1,
        after: function (currSlideElement, nextSlideElement, options, forwardFlag) {
            if (options.currSlide == baseSlide) {
                if (baseSlide < thumbLength) {
                    rotateFlag = true;
                    cycleNextPage();
                }
                baseSlide = baseSlide + 4;
            }
        },
        pagerEvent: 'mouseover',
        pager: '#inner-slider-nav',
        pagerAnchorBuilder: function (idx, slide) {
            // return sel string for existing anchor
            return '#inner-slider-nav li:eq(' + (idx) + ') a';
        },
        end: function () {
            baseSlide = 4;
            rotateFlag = true;
            $('.carousel-pagination p a:first-child').click();
            $('#inner-slider').cycle(0);
        }
    })
    //this function is only called while in cycle so it keep the rotation going
    function cycleNextPage() {
        rotateFlag = true;
        $('#snext').click();
    }

    //pause cycle on pagination click, kill baseSlide
    $(document).on('click', '#snext', function () {
        if (rotateFlag === false) {
            $('#inner-slider').cycle('pause');
            baseSlide = -1;
            whichPage = $('.carousel-pagination p a.active span').html();
            $('#inner-slider').cycle('pause');
            if (whichPage == 1) {
                whichTab = 0;
            } else {
                whichTab = (whichPage - 1) * 4;
                baseSlide = -1;
            }
            $('#inner-slider').cycle(whichTab);
        } else {
            rotateFlag = false;
        }
    });
    //pause cycle on pagination click, kill baseSlide
    $(document).on('click', '#sprev', function () {
        $('#inner-slider').cycle('pause');
        whichPage = $('.carousel-pagination p a.active span').html();
        if (whichPage == 1) {
            whichTab = 0;
        } else {
            whichTab = ((whichPage - 1) * 4);
            baseSlide = -1;
        }
        $('#inner-slider').cycle(whichTab);
    });
    //pause cycle on pagination click, kill baseSlide
    //set the proper tab
    $(document).on('click', '.carousel-pagination p a', function () {
        whichPage = $(this).children().html();
        if ((rotateFlag === false)) {
            $('#inner-slider').cycle('pause');
            if (whichPage == 1) {
                whichTab = 0;
            } else {
                whichTab = (whichPage - 1) * 4;
                baseSlide = -1;
            }
            $('#inner-slider').cycle(whichTab);
        } else {
            rotateFlag = false;
        }
    })
    //end if sliders exists	
}

$(".thumbs").carousel({
    dispItems: 4,
    autoSlide: false,
    pagination: true,
    nextBtn: "<div id='snext'>&#9658;</div>",
    prevBtn: "<div id='sprev'>&#9668;</div>",
    btnsPosition: 'after'
});


if ($('#spotlight').hasClass('addplaybtn')) {
    $('<div class="btnplay"></div>').prependTo('#spotlight')
}

if ($('#newsvideo').hasClass('addplaybtn')) {
    $('<div class="btnplaylrg"></div>').prependTo('#newimg')
}

$("#smimg-gallery").cycle({
    fx: 'scrollHorz',
    speed: 'fast',
    timeout: 0,
    nowrap: 1,
    navigation: true,
    prev: '#prevbutton',
    next: '#nextbutton',
    pager: '#nav',
    after: function (c, n, o, f) {
        $(this).index() > 0 ? $('#prevbutton').removeClass('disable') : $('#prevbutton').addClass('disable');
        $(this).index() == (o.slideCount - 1) ? $('#nextbutton').addClass('disable') : $('#nextbutton').removeClass('disable');
        $('#caption').html(this.alt);
        //$('#prev').removeClass('disable');
    },
    pagerAnchorBuilder: function (idx, slide) {
        var s = idx > idx.length ? ' style="display:none"' : '';
        return '<li' + s + '><a href="#">' + (idx + 1) + '</a></li>';
        $(this).index() == 0 ? $('#prevbutton').addClass('disable') : $('#prevbutton').removeClass('disable');
    }
});

var num = 0;

$('#imgslider').cycle({
    fx: 'scrollHorz',
    speed: 'fast',
    timeout: 0,
    nowrap: 1,
    navigation: true,
    prev: '#prevbutton',
    next: '#nextbutton',
    pager: '#nav',
    after: function (c, n, o, f) {
        $(this).index() > 0 ? $('#prevbutton').removeClass('disable') : $('#prevbutton').addClass('disable');
        $(this).index() == (o.slideCount - 1) ? $('#nextbutton').addClass('disable') : $('#nextbutton').removeClass('disable');
        $('#caption').html(this.alt);
        //$('#prev').removeClass('disable');
    },
    pagerAnchorBuilder: function (idx, slide) {
        var s = idx > idx.length ? ' style="display:none"' : '';
        return '<li' + s + '><a href="#">' + (idx + 1) + '</a></li>';
        $(this).index() == 0 ? $('#prev').addClass('disable') : $('#prev').removeClass('disable');
    }

});

//code for overlay

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
    $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
    $(window).scrollLeft()) + "px");
    return this;
}

$('.overlaylink').click(function(e) {
	e.preventDefault();
	$('#overlay').show();
	$('.overlaycontent').show().center();
})


$('.btn-close').click(function(e) {
	e.preventDefault();
	$('#overlay').hide();
	$('.overlaycontent').hide();
})

//end of overlay code