/*!
 * BermudaTourism.com namespace, includes all common and landing page functionality.
 * @author Chris Kennedy
 * @author Fahim Chowdhury
 */

Bermuda = {}

Bermuda.Common = {
    elements: {
        sLink: $("a.select-all"),
        dsLink: $("a.deselect-all"),
        bbLink: $(".lightbox"),
        emailIframeHeader: $('#ifrmemailPopup'),
        emailIframeFooter: $('#ifrmemailPopupFooter')
    },

    initialize: function() {
        var _this = this;

        var filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3)$/i;
        var baseHref = '';
        if ($('base').attr('href') != undefined) baseHref = $('base').attr('href');
        $('a').each(function() {
            var href = $(this).attr('href');
            if (href && (href.match(/^https?\:/i)) && (!href.match(document.domain))) {
                $(this).click(function() {
                    var extLink = href.replace(/^https?\:\/\//i, '');
                    _gaq.push(['_trackEvent', 'Outbound-Links', 'Click-Website-Links', extLink]);
                    if ($(this).attr('target') != undefined && $(this).attr('target').toLowerCase() != '_blank') {
                        setTimeout(function() {
                            location.href = href;
                        }, 200);
                        return false;
                    }
                });
            }
            else if (href && href.match(/^mailto\:/i)) {
                $(this).click(function() {
                    var mailLink = href.replace(/^mailto\:/i, '');
                    _gaq.push(['_trackEvent', 'Email-Links', 'Click-MailTo', mailLink]);
                });
            }
            else if (href && href.match(filetypes)) {
                $(this).click(function() {
                    var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
                    var filePath = href;
                    _gaq.push(['_trackEvent', 'Downloads', 'Click-' + extension, filePath]);
                    if ($(this).attr('target') != undefined && $(this).attr('target').toLowerCase() != '_blank') {
                        setTimeout(function() {
                            location.href = baseHref + href;
                        }, 200);
                        return false;
                    }
                });
            }
        });

        //Bermuda break lightbox
        _this.elements.bbLink.lightbox();

        $("table.stripes tbody tr:nth-child(odd)").addClass("odd");
        $("table.stripes tbody tr:nth-child(even)").addClass("even");

        $(".acco-loc-right > *").hover(function() {
            return false;
        })

        $.fn.center = function() {
            this.css("position", "absolute");
            this.css("top", ($(window).height() - this.outerHeight()) / 2 + $(window).scrollTop() + "px");
            this.css("left", ($(window).width() - this.outerWidth()) / 2 + $(window).scrollLeft() + "px");
            return this;
        }
        $.fn.center();

        //Select all checkbox inputs
        _this.elements.sLink.bind("click", function(e) {
            e.preventDefault();
            var iChkParent = $(this).parent().parent();
            var iChk = iChkParent.find("ul li input:checkbox");

            iChk.each(function() {
                $(this).attr("checked", "checked");
            });
        });

        //Deselect all checkbox inputs
        _this.elements.dsLink.bind("click", function(e) {
            e.preventDefault();
            var iChkParent = $(this).parent().parent();
            var iChk = iChkParent.find("ul li input:checkbox");

            iChk.each(function() {
                $(this).removeAttr("checked");
            });
        });

        //Email-Print-Share Icons
        if ($(".emailprintshare")) {

            //email popup
            $('.emailprintshare a.email').click(function(e) {
                e.preventDefault();
                $('.email-popup').show();
                $('.email-popup-footer').hide();
                return false;
            });
            $('.emailsignup div a.btn-signup').click(function(e) {
                e.preventDefault();
                $('.email-popup-footer').show();
                $('.email-popup').hide();
                return false;
            });

            $('.email-popup a.btn-close').bind('click', function(e) {
                e.preventDefault();
                _this.elements.emailIframeHeader.attr('src', '/emailsignup.aspx');
                _this.elements.emailIframeHeader.load();
                $('.email-popup').hide();
                return false;
            });

            $('.email-popup-footer a.btn-close').bind('click', function(e) {
                e.preventDefault();
                _this.elements.emailIframeFooter.attr('src', '/emailsignup.aspx');
                _this.elements.emailIframeFooter.load();
                $('.email-popup-footer').hide();
                return false;
            });

            //print
            $(".emailprintshare a.print").click(function(e) {
                e.preventDefault();
                window.print();
                return false;
            });


        }

    },

    /**
     *Function to hide-show tab content and titles
     *"cDiv" passes the tab content (div)
     *"tLi" passes the tab title (li)
     */
    toggleTabs: function(parentDiv, cDiv, tLi, defaultstate) {
        var pDiv = parentDiv;
        //On pageload, default tab selection
        if (defaultstate == false) {
            $(pDiv + " .default-state").show();
        } else {
            $(pDiv + " .default-state").hide();
            $(pDiv + " ul.tabs li:first").addClass("active").show();
            $(pDiv + " .tab-content:first").show();

        }

        //On tab click, hide all tab content, show tab title link (activates href link to the content div)
        tLi.click(function(e) {
            e.preventDefault();
            cDiv.addClass("hidden");
            $(pDiv + " .default-state").hide();
            tLi.removeClass("active");
            $(this).addClass("active");

            var activeTab = $(this).find("a").attr("href");
            $(activeTab).removeClass("hidden");

            //Hide video container
            if (".aboutbermuda-mediagallery") {
                $(activeTab).removeClass("video-hide");
            }
            return false;
        });
    },

    /**
     *Function to hide-show tab content and titles
     *"cDiv" passes the tab content (div)
     *"tLi" passes the tab title (li)
     */
    toggleCustomTabs: function(parentDiv, cDiv, tLi) {
        var pDiv = parentDiv;
        var tabContent = $("div.tab-content");

        //On tab click, hide all tab content, show tab title link (activates href link to the content div)
        tLi.click(function(e) {
            e.preventDefault();
            tLi.removeClass("active");
            $(this).addClass("active");

            if ($(this).hasClass("info")) {
                tabContent.each(function() {
                    $(this).addClass("hidden");
                });
                $("div.tab1").removeClass("hidden");
            }
            if ($(this).hasClass("photogallery")) {
                tabContent.each(function() {
                    $(this).addClass("hidden");
                });
                $("div.tab2").removeClass("hidden");
            }
            if ($(this).hasClass("meetings")) {
                tabContent.each(function() {
                    $(this).addClass("hidden");
                });
                $("div.tab3").removeClass("hidden");
            }
            if ($(this).hasClass("weddings")) {
                tabContent.each(function() {
                    $(this).addClass("hidden");
                });
                $("div.tab4").removeClass("hidden");
            }
            if ($(this).hasClass("offers")) {
                tabContent.each(function() {
                    $(this).addClass("hidden");
                });
                $("div.tab5").removeClass("hidden");
            }
            return false;
        });
    }

}

Bermuda.Homepage = {
    elements: {
        hDiv: $(".hero-img-carousel"),
        hPag: ".hero-pagination",
        lpDiv: $(".left-promo-carousel"),
        lpPag: ".left-promo-pagination",
        bkPop: $('.bookingpopup')
    },

    initialize: function() {
        var _this = this;
        if ($("body").hasClass("homepage")) {
            //Homepage main carousel
            _this.elements.hDiv.cycle({
                fx: "fade",
                speed: 400,
                timeout: 12000,
                pager: _this.elements.hPag
            });

            //Homepage left promo carousel
            _this.elements.lpDiv.cycle({
                fx: "scrollLeft",
                speed: 600,
                timeout: 5000,
                pager: _this.elements.lpPag,
                pagerAnchorBuilder: function(index, el) {
                    return "<a href='#'>&nbsp;</a>";
                }
            });

            //Auto expand Booking Widget

            function toggleBW() {
                _this.elements.bkPop.fadeIn(800);
                return;
            }

            function toggleBWfadeout() {
                _this.elements.bkPop.fadeOut(800);
                return;
            }
            setTimeout(toggleBW, 4000);
            setTimeout(toggleBWfadeout, 15000);

        }

    }

}

Bermuda.Navmenu = {
    initialize: function() {
        var timeout = 500;
        var closetimer = 0;
        var ddmenuitem = 0;
        var ddmenuline;

        function jsddm_open() {
            jsddm_canceltimer();
            jsddm_close();
            ddmenuitem = $(this).find('ul').css('visibility', 'visible');
            ddmenuline = $(this).find('div').css('visibility', 'visible');
        }

        function jsddm_close() {
            if (ddmenuitem) {
                ddmenuitem.css('visibility', 'hidden');
                ddmenuline.css('visibility', 'hidden');
            }
        }

        function jsddm_timer() {
            closetimer = window.setTimeout(jsddm_close, timeout);
        }

        function jsddm_canceltimer() {
            if (closetimer) {
                window.clearTimeout(closetimer);
                closetimer = null;
            }
        }

        $(document).ready(function() {
            $('.topnav > li').bind('mouseover', jsddm_open)
            $('.topnav > li').bind('mouseout', jsddm_timer)
        });

        document.onclick = jsddm_close;
    }
}

Bermuda.BookingWidget = {
    elements: {
        bytLink: $('li.bookyourtrip a'),
        bkPop: $('.bookingpopup'),
        tabParentDiv: "#bookingwidget",
        tabConDiv: $("#bookingwidget .tab-content"),
        tabTitLi: $("#bookingwidget ul.tabs li"),
        bkwidgetIframe: $('#bkwidget')
    },

    initialize: function() {
        var _this = this;

        //Show-Hide booking widget popup
        $('li.bookyourtrip').click(function() {
            $("#bkwidget").contents().find("ul.tabs li").removeClass('active');
            $("#bkwidget").contents().find(".vacpack").addClass('active');
            $("#bkwidget").contents().find("#tab1").removeClass('hidden');
            _this.elements.bytLink.addClass('selected');
            _this.elements.bkPop.fadeIn("fast");
            return false;
        });
        $('.bookingpopup a.btn-close').click(function() {
            _this.elements.bytLink.removeClass('selected');
            _this.elements.bkPop.fadeOut("fast");
            var geturl = window.location;
            var host1 = geturl.toString().search("gotobermuda.co.uk");
            if (host1 != -1) {
                _this.elements.bkwidgetIframe.attr('src', 'BermudaWidgets/bookingwidget-uk.html');
            } else {
                _this.elements.bkwidgetIframe.attr('src', 'BermudaWidgets/bookingwidget.html');
            }
            _this.elements.bkwidgetIframe.load();
            return false;
        });

        //Show-Hide tabs and content of booking widget popup
        Bermuda.Common.toggleTabs(_this.elements.tabParentDiv, _this.elements.tabConDiv, _this.elements.tabTitLi, true);

        //Remove href function from calendar links
        var cLink = $("a.btn-calendar");
        cLink.each(function() {
            $(this).click(function(e) {
                e.preventDefault();
            });
        });

        //Dropdown functionality for "Departure Month/Year" select menu in Cruises Tab
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        $("select.deptMonth option").each(function() {
            var sVal = $(this).val();
            var newVal = sVal.split(/\s*-\s*/);
            if (newVal[1] < year) {
                $(this).remove();
            }
            if ((newVal[0] < month) && (newVal[1] == year)) {
                $(this).remove();
            }
        });

    }

}

Bermuda.WheretoStay = {
    elements: {
        whatisthisPop: $('.whatisthisdiv'),
        tabParentDiv: ".wheretostay-property",
        tabConDiv: $('.wheretostay-property .tab-content'),
        tabTitLi: $('.wheretostay-property ul.tabs li'),
        facilitiesPhotoLink: $('.facilities-lightbox'),
        roomsPhotoLink: $('.rooms-lightbox')
    },

    initialize: function() {
        var _this = this;

        //Show-Hide booking widget popup
        $('.property-information a.lnk-whatisthis').click(function() {
            _this.elements.whatisthisPop.fadeIn("fast");
            return false;
        });
        $('.wheretostay-property .property-detail-container .prop-detail .whatisthisdiv a.btn-close').click(function() {
            _this.elements.whatisthisPop.fadeOut("fast");
            return false;
        });

        //Show-Hide tabs and content
        Bermuda.Common.toggleCustomTabs(_this.elements.tabParentDiv, _this.elements.tabConDiv, _this.elements.tabTitLi);

        //Photo gallery lightbox
        _this.elements.facilitiesPhotoLink.lightbox();
        _this.elements.roomsPhotoLink.lightbox();

    }

}

Bermuda.TravelDeal = {
    elements: {
        tabParentDiv: ".vtab-container",
        tabConDiv: $('.vtab-container .tab-content'),
        tabTitLi: $('.vtab-container ul.tabs li'),
        tabConDivAtag: $('.vtab-container .tab-content a')
    },

    initialize: function() {
        var _this = this;

        //Show-Hide tabs and content
        Bermuda.Common.toggleTabs(_this.elements.tabParentDiv, _this.elements.tabConDiv, _this.elements.tabTitLi, false);

        _this.elements.tabTitLi.each(function() {
            var gethotelname, fhotelname, formathotelname, divid;
            gethotelname = $(this).text();
            fhotelname = gethotelname.split("$");
            formathotelname = fhotelname[0].replace(/\s+/g, '-').toLowerCase();
            $(this).click(function() {
                _gaq.push(['_trackEvent', 'hotel-links', 'hotel-details', formathotelname]);
            });
        });

    }

}

Bermuda.AboutBermuda = {
    elements: {
        tabParentDiv: ".aboutbermuda-mediagallery",
        tabConDiv: $('.aboutbermuda-mediagallery .tab-content'),
        tabTitLi: $('.aboutbermuda-mediagallery ul.tabs li'),
        bermudaPhotoLink: $('.bermuda-lightbox'),
        activityPhotoLink: $('.activity-lightbox'),
        golfPhotoLink: $('.golf-lightbox'),
        beachesPhotoLink: $('.beaches-lightbox'),
        sightPhotoLink: $('.sight-lightbox'),
        weddingPhotoLink: $('.wedding-lightbox')
    },

    initialize: function() {
        var _this = this;

        //Show-Hide tabs and content
        Bermuda.Common.toggleTabs(_this.elements.tabParentDiv, _this.elements.tabConDiv, _this.elements.tabTitLi, true);

        //Photo gallery lightbox
        _this.elements.bermudaPhotoLink.lightbox();
        _this.elements.activityPhotoLink.lightbox();
        _this.elements.golfPhotoLink.lightbox();
        _this.elements.beachesPhotoLink.lightbox();
        _this.elements.sightPhotoLink.lightbox();
        _this.elements.weddingPhotoLink.lightbox();

    }

}

Bermuda.Gethere = {
    elements: {
        sStatesTp: $('#ctl00_conphMain_ctl01_sStates_tp'),
        sProTypeTp: $('#ctl00_conphMain_ctl01_sProType_tp'),
        rfpIframe: $('#formiframe')
    },

    initialize: function() {
        var _this = this;
        var grayBg = $('div.gray-bg');
        var winWidth = $('body').width();
        var winHeight = $('body').height();

        $('.btn-brobanner').click(function() {
            _this.elements.rfpIframe.addClass('formheight');
            $('.rfp-form-popup').center().show();
            return false;
        });

        $('a.btn-brobanner').bind('click', function(e) {
            e.preventDefault();
            grayBg.css({
                'display': 'block',
                'width': winWidth,
                'height': winHeight
            });
        });

        $('.rfp-form-popup a.btn-close').bind('click', function(e) {
            e.preventDefault();
            _this.elements.rfpIframe.attr('src', 't12-rfpform.aspx');
            _this.elements.rfpIframe.load();
            grayBg.css('display', 'none');
            $('.rfp-form-popup .form-thankyou').addClass('hidden');
            //$('#formiframe', top.document).addClass('formheight');
            $('#formiframe', top.document).height('');
            $('.rfp-form-popup').hide();

        });

        $('.officialrules').click(function() {
            //_this.elements.rfpIframe.addClass('formheight');
            $('.officialRules-box').center().removeClass('hidden').show();
            return false;
        });

        $('a.officialrules').bind('click', function(e) {
            e.preventDefault();
            grayBg.css({
                'display': 'block',
                'width': winWidth,
                'height': winHeight
            });
        });

        $('.officialRules-box a.btn-close').bind('click', function(e) {
            e.preventDefault();
            //_this.elements.rfpIframe.attr('src','t12-rfpform.aspx');
            //_this.elements.rfpIframe.load();
            grayBg.css('display', 'none');
            //$('.rfp-form-popup .form-thankyou').addClass('hidden');
            $('.officialRules-box').hide();
        });

        $(".sCountry").change(function() {
            var str = "";
            $(this).click(function() {
                str = $(this).val();
                switch (str) {
                case '0':
                    $('.allstates').hide();
                    break;
                case 'United States':
                    $('.allstates').hide();
                    $('.usstates').show();
                    break;
                case 'Canada':
                    $('.allstates').hide();
                    $('.canstates').show();
                    break;
                default:
                    $('.allstates').hide();
                    $('.province').show();
                }
            });
        })

        $('.form-popup a.btn-submit').click(function(e) {
            e.preventDefault();
            //$('#formiframe', top.document).removeClass('formheight');
            $('#formiframe', top.document).height(250);
            $('.formcontent').hide();
            $('.form-thankyou').removeClass('hidden');
            return false;
        });

        //Select All and Deselect All highlighting
        if ($(".content-travelagent")) {
            var sAll = $("a.s-all");
            var dsAll = $("a.ds-all");
            sAll.click(function() {
                $(this).addClass("gray");
                dsAll.removeClass("gray");
                dsAll.addClass("pink");
            });
            dsAll.click(function() {
                $(this).addClass("gray");
                sAll.removeClass("gray");
                sAll.addClass("pink");
            });
        }


    }
}


Bermuda.Footer = {
    initialize: function() {

        $('.ministermsg a.readMsg').click(function() {
            $('.ministermsg-popup').show();
            return false;
        });

        $('.ministermsg-popup a.btn-close').click(function() {
            $('.ministermsg-popup').hide();
            return false;
        });

    }
}


/**
 *Initialize all functionality on pageload.
 */
$(function() {
    Bermuda.Common.initialize();
    Bermuda.Homepage.initialize();
    Bermuda.WheretoStay.initialize();
    Bermuda.TravelDeal.initialize();
    Bermuda.Navmenu.initialize();
    Bermuda.BookingWidget.initialize();
    Bermuda.AboutBermuda.initialize();
    Bermuda.Gethere.initialize();
    Bermuda.Footer.initialize();
});