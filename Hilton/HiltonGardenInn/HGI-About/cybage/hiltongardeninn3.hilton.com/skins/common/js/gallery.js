// =========================================
// gallery
// =========================================

/*
 Notes: All gallery styling including the initial hiding of on screen elements is handled in CSS for the individual site.
 Positioning of the elements is also handled in CSS with the exception of when dynamic positioning is enabled.
 JDM -- 6/30/11

 Dependencies
 Requires carousel.js, jquery.jcarousel, jquery-ui, convert_gallery.js

 Usage
 var myGallery = new gallery({options hash});

 Settings
 addClass -- Additional class to add to gallery container after it is initalized - we use this on offers pages
 activeIndex -- Index of the image you want to set as active always - see Hampton homepage for an example.
 alwaysDisplayCounter -- If counter is always needed for layout purposes -- see Hampton About and Meetings/Events pages for an example.
 autoRotateInterval -- Time in ms to rotate the gallery forward automatically.
 baseSelector -- Selector for the gallery container, we use this as a base to select certain elements.
 categorySelector -- Selector for the category list
 counterSelector -- Selector for the counter element
 displayCategoryLabel -- If the category list should display the label at the top of the list as the active gallery set to true (only used on Home2)
 displayCounter -- Display the counter for the gallery (e.g. image 1/1)
 displayExtraContent -- Display the copy block for the gallery
 displayImagesAsCarousel -- Are the images in the gallery an actual circular carousel?
 displayImageNavigation -- Always display the next and previous image arrows
 displayImageNavigationOnHover -- Display the next and previous image arrows when the gallery is hovered over.
 displayImageNavigationOnHoverNear -- Display either the next or previous area if the mouse gets close to one of them
 displayThumbsAsCarousel -- Display the thumbnail images in a carousel
 extraContentSelector -- Selector for the gallery content
 extraContentTitleTagName -- Allows you to supply an alternate tag name for the gallery content title.
 galleryStartsHidden - Set to true if the gallery should fade in after it's loaded, helpful if images are being dynamically centered
 gallerContentTransition - Possible values are 'fade' and 'slide'
 galleryTransition -- Possible values are 'fade', 'slideh' and 'slidev'
 hasCategories -- Set to true if the gallery list component will be displayed
 imageButtonsDynamicallyPositioned -- Set to true if the previous and next image buttons should be positioned dynamically to the carousel
 imageCarouselIsCircular -- Set to true if the main images should be in a carousel and that carousel should be circular
 imaegDynamicallyCentered -- Set to true if the images in the gallery should be dynamically centered, useful for small images in large galleries
 imageLeftOffset -- Set if images in the gallery should be given a negative left offset initially
 mainImageSelector -- Selector for the main image element
 nextImageButtonSelector -- Selector for the next image button for the gallery
 pageLength -- Page length of the gallery carousel
 prevImageButtonSelector -- Selector for the previous image button for the gallery
 thumbCarouselContentSelector -- Selector for the container which holds the thumbnail (or bullet) carousel
 thumbCarouselNextButtonSelector -- Selector for the next page button of the carousel
 thumbCarouselPrevButtonSelector -- Selector for the prev page button of the carousel
 thumbCarouselIsVertical -- Set to true if the thumbnails should be displayed vertically
 thumbCarouselIsCircular -- Set to true if the thumbnail carousel is circular (defaults to true)
 thumbCarouselDynamicallyCentered -- Set to true to dynamically center the carousel once it's filled initially based on the width of the gallery
 */
var gallery = function(options) {

	var settings = jQuery.extend({
		addClass : null,
		activeIndex : 0,
		alwaysDisplayCounter : false,
		autoRotateInterval : 0,
		baseSelector : null,
		baseSelectorElement : undefined,
		categorySelector : '.gallery_list',
		counterSelector : '.gallery_counter',
		controlsSelector : '.gallery_controls_container',
		captionsSelector : '.gallery_caption_toggle',
		displayCategoryLabel : false,
		displayCounter : false,
		displayExtraContent : false,
		displayImagesAsCarousel : false,
		displayImageNavigation : false,
		displayImageNavigationOnHover : false,
		displayImageNavigationOnHoverNear : false,
		displayActiveThumbnailOnly : false,
		displayThumbsAsCarousel : false,
		displayCaptionToggle : false,
		extraContentSelector : '.gallery_content',
		extraContentTitleTagName : null,
		galleryStartsHidden : false,
		galleryContentTransition : 'fade',
		galleryPhotoDescriptionSelector : '.gallery_photo_description',
		galleryTransition : 'fade',
		hasCategories : false,
		imageButtonsDynamicallyPositioned : false,
		imageCarouselIsCircular : true,
		imageDynamicallyCentered : false,
		imageLeftOffset : 0,
		mainImageSelector : '.gallery_image',
		nextImageButtonSelector : '.gallery_next',
		pageLength : 0,
		prevImageButtonSelector : '.gallery_prev',
		thumbCarouselContentSelector : '.gallery_carousel',
		thumbCarouselNextButtonSelector : '.gallery_page_next',
		thumbCarouselPrevButtonSelector : '.gallery_page_prev',
		thumbCarouselIsVertical : false,
		thumbCarouselIsCircular : true,
		thumbCarouselDynamicallyCentered : false
	}, options || {});

	var baseSelectorElement;
	var mainImageElement;
	var thumbCarouselElement;
	var categorySelectorElement;
	var extraContentElement;
	var captionsSelector;
	var counterElement;
	var categoryDrawerOpenHeight;
	var categoryItemHeight;
	var categoryTopItemHeight;
	var galleryPhotoDescriptionSelector;
	var autoRotateTimer;
	var autoRotatePauseTimer;
	var totalThumbs;
	var nextImageButtonElement;
	var prevImageButtonElement;
	var carouselNextButtonElement;
	var carouselPrevButtonElement;
	var animating = false;

	//If we are using a horizontal or vertical transition this instantiates an image object and sets it's attributes -
	//it's returned so we can insert it into the DOM.
	var createImageForCarousel = function(element, index) {
		var leftOffset = index > 0 ? settings.imageLeftOffset : 0;
		var newImage = new Image();
		showLoadingImage();

		var newImageAltAttr = '';
		if (0 < jQuery(element).children('a').children('.image_alt').text().length) {
			newImageAltAttr = jQuery(element).children('a').children('.image_alt').text();
		} else {
			newImageAltAttr = jQuery(element).children('a').children('img').attr('alt');
		}

		jQuery(newImage).load(function() {
			if (settings.imageDynamicallyCentered) {
				centerWithMargins(this);
			}
			jQuery(this).fadeIn();
			removeLoadingImage();
		}).attr({
			src : jQuery(element).children('a').attr('href'),
			alt : newImageAltAttr
		}).css('left', '-' + leftOffset * index + 'px');

		if (jQuery(newImage).attr('alt') == '') {

			jQuery(newImage).attr('alt', jQuery(element).children('a').text());
		}

		return jQuery(newImage);
	};

	//If a horizontal or vertical image transition has been chosen (even if it isn't a carousel) we need to basically insert all of the
	//possible images into the main image container. If the main image container should hold a true circular image carousel then we
	//initialize that at this time. We dynamically expand the main image container to fit all of the images to prevent
	//some unfortunate display issues.
	var initImageCarousel = function() {

		if (settings.imageCarouselIsCircular) {

			mainImageElement.empty();
			//Only initialize another carousel if absolutely necessary
			var list = jQuery('<ul>');
			var listItem = jQuery('<li>');
			listItem.append(createImageForCarousel(jQuery(thumbCarouselElement.find('li:last'))));
			list.append(listItem);

			thumbCarouselElement.find('li').each(function(index, value) {
				if (index >= 2) {
					return false;
				}
				var listItem = jQuery('<li>');
				listItem.append(createImageForCarousel(jQuery(this)));
				list.append(listItem);
			});
			mainImageElement.append(list);
		} else {
			var i = 0;
			thumbCarouselElement.find('li').each(function() {
				mainImageElement.append(createImageForCarousel(jQuery(this), i));
				i++;
			});
		}
	};

	//If an active index is set we want the image in that slot to always be active, this generally means we have
	//to rotate the carousel to that spot. This function takes care of that.
	var rotateCarouselToNewActiveItem = function(carouselSelector, carouselElement, newElement, activeElement) {
		var currentjcIndex = getjCarouselIndex(newElement);

		if (settings.activeIndex) {
			//Do what we need to rotate the selected thumb to the 'active' position...
			var carousel = getCarouselObject(carouselSelector, carouselElement);

			if (carousel != undefined) {
				var distance = currentjcIndex - getjCarouselIndex(activeElement);

				if (distance < 0) {
					carousel.options.scroll = settings.pageLength * distance * -1;
					carousel.prev();
				}
				if (distance > 0) {
					carousel.options.scroll = settings.pageLength * distance;
					carousel.next();
				}
			}
		}
	};

	// This deals with all of the transitions for the gallery image.
	var changeImage = function(element, delay, isInit, extraContentCallback) {
		if (element.attr('href') != undefined) {
			var currentThumb = getActiveThumb();
			if (animating)
				return;

			switch(settings.galleryTransition) {

				case 'fade':

					showLoadingImage();
					var newImage = new Image();
					if (jQuery('[src="' + element.attr('href') + '"]', mainImageElement).length == 0) {
						var newImageAltAttr = '';
						if (0 < element.children('.image_alt').text().length) {
							newImageAltAttr = element.children('.image_alt').text();
						} else {
							newImageAltAttr = element.children('img').attr('alt');
						}

						jQuery(newImage).load(function() {
							removeLoadingImage();
							animating = true;
							mainImageElement.append(jQuery(newImage).removeAttr('width').removeAttr('height').addClass('active'));
							if (settings.imageDynamicallyCentered) {
								centerWithMargins(newImage);
								jQuery(this).delay(delay).fadeIn('slow', function() {
									animating = false;
								}).prev().fadeOut('slow', function() {
									jQuery(this).remove();
								});
							} else {
								jQuery(this).delay(delay).fadeIn('slow', function() {
									animating = false;
								}).prev().fadeOut('slow', function() {
								});
							}
						}).attr({
							src : element.attr('href'),
							alt : newImageAltAttr
						});

						if (jQuery(newImage).attr('alt') == '') {
							jQuery(newImage).attr('alt', element.text());
						}

					} else {
						
						removeLoadingImage();
						theImage = jQuery('[src="' + element.attr('href') + '"]', mainImageElement);
						otherImages = jQuery('img', mainImageElement).not(theImage);
						if (settings.imageDynamicallyCentered) {
							centerWithMargins(theImage);
							theImage.delay(delay).fadeIn('slow', function() {
								animating = false;
							});
							otherImages.fadeOut('slow', function() {
								jQuery(this).remove();
							});
						} else {
							theImage.delay(delay).fadeIn('slow', function() {
								animating = false;
							});
							otherImages.fadeOut('slow');

						}
					}
					break;
				case 'slideh':

					if (settings.imageCarouselIsCircular) {
						rotateCarouselToNewActiveItem('ul', mainImageElement, getImage(element.attr('href')).last().parent(), getActiveImage().parent());
					} else {
						var scrollWidth = mainImageElement.children('img').first().outerWidth() - settings.imageLeftOffset;
						var newOffset = getThumbIndex(element.parent()) * scrollWidth * -1;
						mainImageElement.animate({
							left : newOffset + 'px'
						}, function() {
							animating = false;
						});
					}
					break;
				case 'slidev':
					
					// To implement CR17591 replace everything inside of the 'slidev' in the previous revision number. Replace it with everything
					// contained in this file between "//Start of CR17591" and "//End of CR17591" 
					// Start of CR17591
					// Currently used for HAMPTON ONLY
					rotateCarouselToNewActiveItem(undefined, undefined, element.parent(), getActiveThumb());
					var newThumb = jQuery(element.parent());
					var previousThumb = jQuery(getActiveThumb());
					
					var newImgIndex = newThumb.attr('jcarouselindex');
					var previousImgIndex = previousThumb.attr('jcarouselindex');
					
					var newImgHref = newThumb.find('.gallery_link').attr('href');
					var previousImgHref = previousThumb.find('.gallery_link').attr('href');
					
					var newImgSelector = 'img[src="' + newImgHref + '"]';
					var newImgEl = mainImageElement.find(newImgSelector);
					var $newImgEl = jQuery(newImgEl);
					
					var newTop = 0;
					var $previousImages;
					
					
					
					if(!newImgEl[0]){
						var imgCollection = mainImageElement.find('img');
						for(i = 0; i < imgCollection.length; i++){
							var img = imgCollection[i];
							var imgSrc = jQuery(img).attr('src');
							if(imgSrc === newImgHref){
								$newImgEl = jQuery(img);
							}
						
						}
					}
					
					$previousImages = $newImgEl.prevAll('img');
					
					$previousImages.each(function(index, Element){
						newTop += jQuery(this).outerHeight();
					});
					
					newTop *= -1;
					
					mainImageElement.animate({
						top : newTop + 'px'
					});
					break;
					// End of CR17591
			}

			currentThumb.removeClass('active');
			currentThumb.find('.showing_text').remove();
			element.parent('li').addClass('active');

			mainImageElement.find('img').removeClass('active');
			getImage(element.attr('href')).last().addClass('active');

			// if caption is open close it
			if (galleryPhotoDescriptionElement.hasClass('open_caption'))
				jQuery('a', captionToggleElement).trigger('click');

			// if caption text is empty
			element.parent('li').find('.title').text() == '' ? galleryPhotoDescriptionElement.fadeOut() : galleryPhotoDescriptionElement.fadeIn();

			if (0 < extraContentElement.length && settings.displayExtraContent && (isInit || getThumbIndex(currentThumb) != getThumbIndex(element.parent())))
				showExtraContent(element, isInit, extraContentCallback);
			if (0 < counterElement.length && settings.displayCounter)
				counterElement.children('.active').html((getActiveThumbIndex() + 1) + ' ');

			if (!settings.imageCarouselIsCircular && (settings.displayImageNavigation || settings.displayImageNavigationOnHover || settings.displayImageNavigationOnHoverNear)) {
				canShowPrevButton() ? settings.displayImageNavigationOnHover ? showButton(prevImageButtonElement) :
				void (0) : hideButton(prevImageButtonElement);
				canShowNextButton() ? settings.displayImageNavigationOnHover ? showButton(nextImageButtonElement) :
				void (0) : hideButton(nextImageButtonElement);

			}

			// add the now showing text
			var showingTextFunction = function() {
				if (global.dockGlossaryFetched) {
					// add now showing text to carousel image (dot or thumbnail)
					if (element.parent('li').find('a .image_alt').length > 0) {
						element.parent('li').find('a .image_alt').first().prepend('<div class="hidden showing_text">' + global.glossary.hhonorsDock_showing + '</div>');
					} else {
						element.parent('li').find('a').first().prepend('<div class="hidden showing_text">' + global.glossary.hhonorsDock_showing + '</div>');
					}

					// this is needed because the fade transition does not append the new image to the DOM until the new image is loaded
					var mainImageShowingTextFunction = function() {
						if (0 <= getActiveImage().length) {
							// remove current now showing text from main image
							mainImageElement.find('.showing_text').remove();
							// add now showing text to main image
							getActiveImage().before('<div class="hidden showing_text">' + global.glossary.hhonorsDock_showing + '</div>');
						} else {
							// run again
							setTimeout(mainImageShowingTextFunction, 500);
						}
					}
					mainImageShowingTextFunction();

				} else {
					// run again
					setTimeout(showingTextFunction, 500);
				}
			};
			showingTextFunction();

		}
	};

	//Actually inserts (clones) gallery copy in the DOM and displays it.
	var insertExtraContent = function(element, emptyFirst, extraContentCallback) {
		// set extraContentCallback to an empty function if not set
		if ('function' !== typeof (extraContentCallback)) {
			extraContentCallback = jQuery.noop;
		}

		if (emptyFirst)
			extraContentElement.empty();
		var extraContent = element.parent().children('div:not(.hidden)').clone();
		if (0 < extraContent.children().length) {
			if (settings.extraContentTitleTagName !== null && settings.extraContentTitleTagName != '')
				jQuery('span.title', extraContent).replaceWith(jQuery(settings.extraContentTitleTagName).html(jQuery('span.title', extraContent).html()));
			extraContentElement.append(extraContent);

			if (settings.displayActiveThumbnailOnly)
				jQuery('a img', getActiveThumb()).clone().appendTo(extraContent);

			if (settings.displayCaptionToggle == false) {

				if (settings.galleryContentTransition == 'fade') {
					if (jQuery('.gallery_content .title').html() == '') {
						extraContentElement.hide();
					} else {
						extraContentElement.fadeIn(extraContentCallback);
					}

					extraContentElement.children('div').fadeIn();
				} else if (settings.galleryContentTransition == 'slide') {
					extraContentElement.show();
					extraContentElement.animate({
						left : '-=' + extraContentElement.outerWidth() + 'px'
					}, 600, extraContentCallback);
				}

			} else {
				extraContentElement.hide();
				extraContentCallback();
			}
		} else {
			extraContentElement.hide();
		}

	};

	//Hides gallery content based on a few factors and then calls the function that will get new content and display it.
	//If it's the first run or re-init of the gallery we do things a little differently to avoid some jumping
	var showExtraContent = function(element, firstRun, extraContentCallback) {
		if (settings.galleryContentTransition == 'fade') {
			if (0 < extraContentElement.children('div:parent').length) {

				firstRun ? insertExtraContent(element, true, extraContentCallback) : jQuery.browser.msie ? extraContentElement.children('div').hide(0, function() {
					insertExtraContent(element, true, extraContentCallback);
				}) : extraContentElement.children('div').fadeOut(function() {
					insertExtraContent(element, true, extraContentCallback);
				});
			} else {

				insertExtraContent(element, false, extraContentCallback);
			}
		} else if (settings.galleryContentTransition == 'slide') {
			extraContentElement.css('display', 'block');
			if (0 < extraContentElement.children('div:parent').length) {
				firstRun ? insertExtraContent(element, true, extraContentCallback) : extraContentElement.animate({
					left : '+=' + extraContentElement.outerWidth() + 'px'
				}, 600, function() {
					insertExtraContent(element, true, extraContentCallback);
				});
			} else
				insertExtraContent(element, false, extraContentCallback);
		}
	};

	var focusOnExtraContent = function() {
		/* START ORG CR #15972 */
		if (!isAutoRotating) {
			if (0 < captionToggleElement.length) {
				// Interior page galleries
				if (jQuery('.gallery_content .title').html() != '') {
					captionToggleElement.eq(0).attr('tabindex', '-1').css({
						outline : 'none'
					}).focus();
				}
			} else {
				// Homepage gallery
				extraContentElement.find('h1, .title').eq(0).attr('tabindex', '-1').css({
					outline : 'none'
				}).focus();
			}
		}
		/* END ORG CR #15972 */
	};

	//Initializes carousel - note that the carousel element is filled in with content whether or not the actual carousel is wired up. In some cases the gallery
	//has a single page of thumbs or bullets. We only bother wiring up the entire carousel if we actually need it.
	var initGalleryDisplay = function(element, firstRun) {

		if (firstRun == undefined)
			firstRun = false;

		if (firstRun) {
			//Create show/hide caption toggle
			var captionToggle = setInterval(function() {
				if (global.dockGlossaryFetched && settings.displayCaptionToggle) {
					clearInterval(captionToggle);
					var anchor = jQuery('<a />', {
						href : '#',
						tabindex : '0',
						text : global.glossary.hhonorsDock_show + ' ' + global.glossary.hhonorsDock_caption
					});
					captionToggleElement.append(anchor);
				}
			}, 500);

			var glossaryReady = setInterval(function() {
				if (global.dockGlossaryFetched) {
					clearInterval(glossaryReady);
					jQuery('.gallery_prev .previous_text').html(global.glossary.hhonorsDock_previousImage);
					jQuery('.gallery_next .next_text').html(global.glossary.hhonorsDock_nextImage);
				}
			}, 500);

			// keep track of prev/next button background images for accessibility
			if (0 < prevImageButtonElement.length) {
				// find current background image
				prevImageButtonElement.data('GalleryButtonBackgroundImage', prevImageButtonElement.css('background-image'));
				prevImageButtonElement.data('GalleryButtonBackgroundColor', prevImageButtonElement.css('background-color'));
				prevImageButtonElement.data('GalleryButtonCursor', prevImageButtonElement.css('cursor'));
				if (0 < prevImageButtonElement.children().first().length) {
					prevImageButtonElement.data('GalleryButtonChildBackgroundImage', prevImageButtonElement.children().first().css('background-image'));
					prevImageButtonElement.data('GalleryButtonChildBackgroundColor', prevImageButtonElement.children().first().css('background-color'));
					prevImageButtonElement.data('GalleryButtonChildCursor', prevImageButtonElement.children().first().css('cursor'));
				} else {
					prevImageButtonElement.data('GalleryButtonChildBackgroundImage', 'none');
					prevImageButtonElement.data('GalleryButtonChildBackgroundColor', 'transparent');
					prevImageButtonElement.data('GalleryButtonChildCursor', 'auto');
				}

				// initialize display of button
				if (settings.displayImageNavigationOnHover || settings.displayImageNavigationOnHoverNear) {
					hideButton(prevImageButtonElement);
				}

				// if not displaying button, make sure it is not accessible
				if (!(settings.displayImageNavigation || settings.displayImageNavigationOnHover || settings.displayImageNavigationOnHoverNear)) {
					prevImageButtonElement.hide();
				}
			}

			if (0 < nextImageButtonElement.length) {
				// find current background image
				nextImageButtonElement.data('GalleryButtonBackgroundImage', nextImageButtonElement.css('background-image'));
				nextImageButtonElement.data('GalleryButtonBackgroundColor', nextImageButtonElement.css('background-color'));
				nextImageButtonElement.data('GalleryButtonCursor', nextImageButtonElement.css('cursor'));
				if (0 < nextImageButtonElement.children().first().length) {
					nextImageButtonElement.data('GalleryButtonChildBackgroundImage', nextImageButtonElement.children().first().css('background-image'));
					nextImageButtonElement.data('GalleryButtonChildBackgroundColor', nextImageButtonElement.children().first().css('background-color'));
					nextImageButtonElement.data('GalleryButtonChildCursor', nextImageButtonElement.children().first().css('cursor'));
				} else {
					nextImageButtonElement.data('GalleryButtonChildBackgroundImage', 'none');
					nextImageButtonElement.data('GalleryButtonChildBackgroundColor', 'transparent');
					nextImageButtonElement.data('GalleryButtonChildCursor', 'auto');
				}

				// initialize display of button
				if (settings.displayImageNavigationOnHover || settings.displayImageNavigationOnHoverNear) {
					hideButton(nextImageButtonElement);
				}

				// if not displaying button, make sure it is not accessible
				if (!(settings.displayImageNavigation || settings.displayImageNavigationOnHover || settings.displayImageNavigationOnHoverNear)) {
					nextImageButtonElement.hide();
				}
			}
		}

		//If there are categories then load the first selected category in - otherwise we assume the carousel is pre-loaded and ready to go.
		if (element !== null) {
			thumbCarouselElement.empty();
			element.children('ul').first().clone().fadeIn().appendTo(thumbCarouselElement);
		}

		//Get the number of total items loaded into the gallery
		totalThumbs = thumbCarouselElement.find('li').length;

		//Time to fade if we initally hid the entire gallery
		if (settings.galleryStartsHidden)
			mainImageElement.parent().css('visibility', 'visible');

		//Display the controls for the thumbnail carousel if we need them
		if (settings.displayThumbsAsCarousel && totalThumbs > 1) {
			thumbCarouselElement.fadeIn();
			carouselNextButtonElement.fadeIn();
			carouselPrevButtonElement.fadeIn();
		}

		//Load up the first image
		if (settings.galleryTransition != 'fade')
			initImageCarousel();
		changeImage(thumbCarouselElement.find('li').first().children('a'), 0, true);

		//Center the thumbnail carousel since everythign is loaded now.
		if (settings.thumbCarouselDynamicallyCentered) {
			var thumbCarouselWidth = totalThumbs * (parseInt(thumbCarouselElement.find('li').first().css('margin-left').replace('px', ''), 10) + parseInt(thumbCarouselElement.find('li').first().css('margin-right').replace('px', ''), 10) + parseInt(thumbCarouselElement.find('li').first().outerWidth(), 10));
			var leftOffset = parseInt(controlsElement.width() / 2, 10) - parseInt(thumbCarouselWidth / 2, 10);
			thumbCarouselElement.css({
				width : thumbCarouselWidth + 'px',
				left : leftOffset + 'px'
			});
		}

		//Position the image buttons if desired now that the thumb carousel is positioned
		if (settings.imageButtonsDynamicallyPositioned) {
			var leftOffset = jQuery.browser.webkit ? thumbCarouselElement.position().left + parseInt(thumbCarouselElement.css('margin-left').replace('px', ''), 10) : thumbCarouselElement.position().left;
			prevImageButtonElement.css('left', leftOffset);
			nextImageButtonElement.css('left', leftOffset + thumbCarouselElement.outerWidth() - nextImageButtonElement.outerWidth());
		}

		//If the counter is active display it
		if (0 < counterElement.length && settings.displayCounter && totalThumbs > 1) {
			counterElement.children('.total').html('/ ' + totalThumbs);
			counterElement.fadeIn();

		}

		// Add the counter element if needed
		if (0 == counterElement.length && settings.alwaysDisplayCounter) {
			counterElement = jQuery('<div class="gallery_counter"><span class="active"></span><span class="total"></span></div>');
			counterElement.insertAfter(nextImageButtonElement);
		}

		// if there is only one thumb remove controls
		if (totalThumbs == 1) {
			thumbCarouselElement.css('visibility', 'visible');
			if (settings.alwaysDisplayCounter) {
				counterElement.css('visibility', 'visible');
			} else {
				counterElement.css('visibility', 'hidden');
			}
			prevImageButtonElement.css('visibility', 'hidden');
			nextImageButtonElement.css('visibility', 'hidden');
		} else {
			thumbCarouselElement.css('visibility', 'visible');
			counterElement.css('visibility', 'visible');
			prevImageButtonElement.css('visibility', 'visible');
			nextImageButtonElement.css('visibility', 'visible');
		}

		//If extra content (copy and option thumbnails) is enabled display it
		if (0 < extraContentElement.length && settings.displayExtraContent && settings.galleryContentTransition == 'fade') {
			extraContentElement.fadeIn();
			showExtraContent(thumbCarouselElement.find('li').first().children('a'), true);
		}

		//Display the previous and next image buttons if desired and allowed
		if ((0 < prevImageButtonElement.length || 0 < nextImageButtonElement.length) && settings.displayImageNavigation && totalThumbs > 1) {
			// prevImageButtonElement.fadeIn();
			// jQuery.browser.msie ? prevImageButtonElement.show().css({ visibility: 'visible' }) : prevImageButtonElement.show().css({ visibility: 'visible' }).animate({ opacity: 1 });
			showButton(prevImageButtonElement);

			// nextImageButtonElement.fadeIn();
			// jQuery.browser.msie ? nextImageButtonElement.show().css({ visibility: 'visible' }) : nextImageButtonElement.show().css({ visibility: 'visible' }).animate({ opacity: 1 });
			showButton(nextImageButtonElement);
		}

		//If we should actually bother wiring up the carousel do so.
		if (settings.displayThumbsAsCarousel) {
			var thumbsCarousel = new carousel({
				pageLength : settings.pageLength,
				carouselSelector : thumbCarouselElement.find('ul'),
				nextButtonSelector : settings.thumbCarouselNextButtonSelector,
				prevButtonSelector : settings.thumbCarouselPrevButtonSelector,
				wrap : settings.thumbCarouselIsCircular ? 'circular' : '',
				vertical : settings.thumbCarouselIsVertical
			});
		}

		//If there's an active index set scroll the carousel to it's proper starting position
		if (settings.activeIndex > 0 && totalThumbs > 1) {
			jQuery('.jcarousel-container').ready(function() {
				if (getCarouselObject() !== undefined)
					getCarouselObject().scroll(settings.activeIndex - 1);
				var delay = window.setTimeout(function() {
					bindEvents();
					window.clearTimeout(delay);
				}, 250);
			});
		} else {
			if (firstRun)
				bindEvents();
		}
		// check for one image and if we are on hampton
		if (jQuery('#brand').text() == 'HP' && totalThumbs == 1 && jQuery('.gallery_container').hasClass('standard')) {
			jQuery('.gallery_image ul').append('<li></li>');
			jQuery(jQuery('.gallery_image ul li')[0]).empty();
		}

		// check for one image and if we are on homewood
		if (jQuery('#brand').text() == 'HW' && totalThumbs == 1 && jQuery('.gallery_container').hasClass('standard')) {
			jQuery(jQuery('.gallery_image ul li img')[0]).css('visibility', 'hidden');
		}

	};

	//Looking for an event handler it's down here...
	var bindEvents = function() {
		jQuery('li', thumbCarouselElement).die('click').live('click', function(event) {
			event.preventDefault();
			stopAutoRotate();
			changeImage(jQuery(this).children('a').first(), 500, false, focusOnExtraContent);
		});

		jQuery('li > a:first-child', thumbCarouselElement).die('focus').live('focus', function(event) {
			jQuery(this).parent('li').addClass('focused').siblings('li').removeClass('focused');
		});

		jQuery('li > a:first-child', thumbCarouselElement).die('blur').live('blur', function(event) {
			jQuery(this).parent('li').removeClass('focused');
		});

		jQuery('a', captionToggleElement).die('click keyup').live({
			click : function(event) {

				event.preventDefault();
				var target = jQuery(event.currentTarget);

				//extraContentElement.slideToggle(100, function() {

				//});

				if (galleryPhotoDescriptionElement.hasClass('open_caption')) {
					setTimeout(function() {
						galleryPhotoDescriptionElement.removeClass('open_caption')
					}, 150);
					extraContentElement.css('display', 'none')
					target.text(global.glossary.hhonorsDock_show + ' ' + global.glossary.hhonorsDock_caption);
				} else {
					setTimeout(function() {
						galleryPhotoDescriptionElement.addClass('open_caption')
					}, 150);
					extraContentElement.css('display', 'block')
					target.text(global.glossary.hhonorsDock_hide + ' ' + global.glossary.hhonorsDock_caption);
				}

			},
			keyup : app.accessibility.handleEnterAsClick
		});

		jQuery('.gallery_prev, .gallery_next', baseSelectorElement).unbind('keyup').bind('keyup', app.accessibility.handleEnterAsClick);
		jQuery('.gallery_prev, .gallery_next').attr('tabindex', 0);

		jQuery('.gallery_prev, .gallery_next', baseSelectorElement).unbind('click').bind('click', function(event) {

			width = jQuery('.gallery_image ul li', baseSelectorElement).outerWidth();
			photoUl = jQuery('.gallery_image ul', baseSelectorElement);

			if (parseInt(photoUl.css('left')) != 0) {
				return;
			}

			if (jQuery(this).hasClass('gallery_prev')) {
				the_li = jQuery('.gallery_carousel li.active', baseSelectorElement).prev('li');

				if (the_li.length == 0) {
					the_li = jQuery('.gallery_carousel li:last', baseSelectorElement).prev('li');
				} else {
					the_li = jQuery(the_li).prev('li');
					if (the_li.length == 0) {
						the_li = jQuery('.gallery_carousel li:last', baseSelectorElement);
					}
				}

				the_li = jQuery('<li>').append(createImageForCarousel(the_li));
				photoUl.prepend(the_li);
				photoUl.css('left', parseInt(photoUl.css('left')) - width);

				photoUl.animate({
					'left' : '0px'
				}, 'slow', function() {
					jQuery('li:last', photoUl).remove();
				});

			} else if (jQuery(this).hasClass('gallery_next')) {

				the_li = jQuery('.gallery_carousel li.active', baseSelectorElement).next('li');

				if (the_li.length == 0) {
					the_li = jQuery('.gallery_carousel li:first', baseSelectorElement).next('li');
				} else {
					the_li = jQuery(the_li).next('li');
					if (the_li.length == 0) {
						the_li = jQuery('.gallery_carousel li:first', baseSelectorElement);
					}
				}

				img = jQuery('a', the_li).attr('href');
				the_li = jQuery('<li>').append(createImageForCarousel(the_li));
				photoUl.append(the_li);

				photoUl.animate({
					'left' : '-' + width
				}, 'slow', function() {
					photoUl.css('left', '0px');
					jQuery('li:first', photoUl).remove();
				});

			}
		});

		if (2 < jQuery(settings.categorySelector + ' > li').length && settings.hasCategories) {
			//Calculate how high the category selector will be when it's fully open - we use this to detect whether or not it's open already.
			categoryDrawerOpenHeight = 0;
			categorySelectorElement.attr('tabindex', -1).attr('role', 'menu').attr('aria_label', 'select photo gallery category');
			categorySelectorElement.children('li.list').each(function() {
				categoryDrawerOpenHeight = jQuery(this).outerHeight(true) + categoryDrawerOpenHeight;
			}).attr('tabindex', 0).css({
				display : 'none'
			});
			categorySelectorElement.children('li.list.selected').css({
				display : 'block'
			});
			categoryTopItemHeight = categorySelectorElement.children('.active').outerHeight(true);
			//categoryDrawerOpenHeight = categoryTopItemHeight + categoryDrawerOpenHeight;

			jQuery(settings.categorySelector).unbind('mouseenter').bind('mouseenter', function() {
				if (!categorySelectorElement.data('mouseInside')) {
					categorySelectorElement.data('mouseInside', true);
					//toggleCategoryDrawer('in');
					categoryItemHeight = categorySelectorElement.children('.list.selected').outerHeight(true);

					if ((categoryItemHeight + 2) > categorySelectorElement.outerHeight(true) || !categorySelectorElement.data('animating')) {
						categorySelectorElement.data('animating', true);
						categorySelectorElement.children('li.list').not('.selected').delay(150).slideDown(function() {
							categorySelectorElement.addClass('galleryCategorySelectorOpen').data('animating', false);
						});
					}
				}
			});
			jQuery(settings.categorySelector).unbind('mouseleave').bind('mouseleave', function(event) {
				categorySelectorElement.data('mouseInside', false);

				//toggleCategoryDrawer('out');
				if ((categoryDrawerOpenHeight - 2) > categorySelectorElement.outerHeight() || categorySelectorElement.data('animating')) {
					if (categorySelectorElement.data('animating')) {
						if ((categoryDrawerOpenHeight / 2) > categorySelectorElement.outerHeight(true)) {
							categorySelectorElement.children('li.list').not('.selected').stop(true, true);
						}
					}
					categorySelectorElement.data('animating', true);
					categorySelectorElement.removeClass('galleryCategorySelectorOpen').children('li.list').not('.selected').slideUp(function() {
						categorySelectorElement.data('animating', false);
					});

				}
			});

			categorySelectorElement.children('li.list, li.selected').unbind('focus').bind('focus', function() {

				jQuery(settings.categorySelector).trigger('mouseenter');
			});

			categorySelectorElement.children('li.list, li.selected').unbind('keydown').bind('keydown', function(event) {

				if (event.keyCode == 9) {

					var target = jQuery(event.currentTarget);

					// reverse
					if (event.shiftKey == true) {

						if (event.currentTarget == target.parent().find('li.list, li.selected')[0]) {
							jQuery(settings.categorySelector).trigger('mouseleave');
						}
					} else {

						if (event.currentTarget == target.parent().find('li.list, li.selected').last().get(0)) {
							jQuery(settings.categorySelector).trigger('mouseleave');
						}
					}
				}
				/* Begin ORG - CR #15543, 15335 */
				if (13 == event.keyCode) {
					jQuery(this).trigger('click');
				}
				/* End ORG - CR #15543, 15335 */

			});

			categorySelectorElement.children('li.list').unbind('click').bind('click', function(event) {
				if (!jQuery(this).hasClass('selected') && !categorySelectorElement.data('animating')) {
					categorySelectorElement.data('mouseInside', false);
					categorySelectorElement.data('animating', true);

					categorySelectorElement.children('li.list').removeClass('selected');
					categorySelectorElement.children('li.list').attr('aria-selected', 'false');
					jQuery(this).addClass('selected').attr('aria-selected', 'true');
					/*if(galleryPhotoDescriptionElement.hasClass('open_caption')) {
					 jQuery('a', captionToggleElement).trigger('click');
					 }*/
					initGalleryDisplay(jQuery(this));

					//toggleCategoryDrawer('out');
					categorySelectorElement.children('li.list').not('.selected').slideUp(function() {
						categorySelectorElement.data('animating', false);
					});
				}
			});
			/* Begin ORG - CR #15543, 15335 */
			//categorySelectorElement.children('li.list').unbind('keydown').bind('keydown', app.accessibility.handleEnterAsClick);
			/* End ORG - CR #15543, 15335 */
		} else if (2 >= jQuery(settings.categorySelector + ' > li').length && settings.hasCategories) {
			jQuery(settings.categorySelector).hide();
		}

		if (0 < nextImageButtonElement.length) {
			var nextElement = settings.displayImageNavigationOnHoverNear ? nextImageButtonElement.children().first() : nextImageButtonElement;
			var prevElement = settings.displayImageNavigationOnHoverNear ? prevImageButtonElement.children().first() : prevImageButtonElement;
			
			

			nextElement.click(function() {
				if (canShowNextButton()) {
					stopAutoRotate();
					moveNextImage();
				}
			});

			// set up key event for Home2
			if (settings.displayImageNavigationOnHoverNear) {
				nextImageButtonElement.bind('keyup', function(event) {
					if (13 == event.keyCode && canShowNextButton()) {
						nextImageButtonElement.children().first().trigger('click');
					}
				});
			}

			prevElement.click(function() {
				if (canShowPrevButton()) {
					stopAutoRotate();
					movePreviousImage();
				}
			});

			// set up key event for Home2
			if (settings.displayImageNavigationOnHoverNear) {
				prevImageButtonElement.bind('keyup', function(event) {
					if (13 == event.keyCode && canShowPrevButton()) {
						prevImageButtonElement.children().first().trigger('click');
					}
				});
			}

		}

		if (settings.displayImageNavigationOnHover && totalThumbs > 1) {
			nextImageButtonElement.mouseenter(function() {
				showButton(nextImageButtonElement, true);
				if (canShowPrevButton())
					showButton(prevImageButtonElement, true);
			});

			nextImageButtonElement.focus(function() {
				showButton(nextImageButtonElement, true);
				if (canShowPrevButton())
					showButton(prevImageButtonElement, true);
			});

			prevImageButtonElement.mouseenter(function() {
				showButton(prevImageButtonElement, true);
				if (canShowNextButton())
					showButton(nextImageButtonElement, true);

			});

			prevImageButtonElement.focus(function() {
				showButton(nextImageButtonElement, true);
				if (canShowPrevButton())
					showButton(prevImageButtonElement, true);
			});

			baseSelectorElement.mouseenter(function(event) {
				if (canShowPrevButton())
					showButton(prevImageButtonElement);
				if (canShowNextButton())
					showButton(nextImageButtonElement);
			});

			baseSelectorElement.mouseleave(function() {
				hideButton(prevImageButtonElement);
				hideButton(nextImageButtonElement);
			});
		}

		if (settings.displayImageNavigationOnHoverNear && totalThumbs > 1) {
			nextImageButtonElement.mouseenter(function() {
				if (canShowNextButton())
					showButton(nextImageButtonElement);
			});

			nextImageButtonElement.focus(function() {
				if (canShowNextButton())
					showButton(nextImageButtonElement);
			});

			prevImageButtonElement.mouseenter(function() {
				if (canShowPrevButton())
					showButton(prevImageButtonElement);
			});

			prevImageButtonElement.focus(function() {
				if (canShowPrevButton())
					showButton(prevImageButtonElement);
			});

			nextImageButtonElement.mouseleave(function() {
				hideButton(nextImageButtonElement);
			});

			nextImageButtonElement.blur(function() {
				hideButton(nextImageButtonElement);
			});

			prevImageButtonElement.mouseleave(function() {
				hideButton(prevImageButtonElement);
			});

			prevImageButtonElement.blur(function() {
				hideButton(prevImageButtonElement);
			});

		}
	};

	//This calculates the height and width of image and then applies the proper margins to center the image in the image container
	var centerWithMargins = function(element) {
		var imageWidth = jQuery.browser.msie || jQuery(element).width() != 0 ? jQuery(element).width() : element.width;
		var imageHeight = jQuery.browser.msie || jQuery(element).width() != 0 ? jQuery(element).height() : element.height;

		//This is for webkit
		if (imageWidth == 0 && imageHeight == 0) {
			//Try and find the image in the carousel already...
			getImage(jQuery(element).attr('src')).each(function() {
				if (this.width > 0 && this.height > 0) {
					imageWidth = this.width;
					imageHeight = this.height;
				}
			});
		}

		if (imageWidth < jQuery(element).parent().width())
			jQuery(element).css('margin-left', parseInt((jQuery(element).parent().width() - imageWidth) / 2, 10) + 'px');
		if (imageHeight < jQuery(element).parent().height())
			jQuery(element).css('margin-top', parseInt((jQuery(element).parent().height() - imageHeight) / 2, 10) + 'px');

	};

	//Moves to the next image in the gallery and takes care of paging the thumbnail carousel if necessary
	var moveNextImage = function() {
		var activeImage = getActiveThumb();
		var carousel = getCarouselObject();

		if (carousel != undefined) {

			if (getjCarouselIndex(activeImage) == getjCarouselLastIndex() && totalThumbs > settings.pageLength && settings.thumbCarouselNextButtonSelector != null)
				carousel.next();
		}

		// using nextAll('li').eq(0) because PIE adds css3-container elements in between the li's on some brands
		if (0 < activeImage.nextAll('li').eq(0).children('a').length) {
			changeImage(activeImage.nextAll('li').eq(0).children('a'), 0, false, focusOnExtraContent);

		} else {
			var list = activeImage.siblings('li');
			for (var i = 0; i < list.length; i++) {
				if (jQuery(list[i]).children('a').length > 0) {
					changeImage(jQuery(list[i]).children('a'), 0, false, focusOnExtraContent);
					break;
				}
			}
		}

		// 0 < activeImage.next().children('a').length ? changeImage(activeImage.next().children('a')) : changeImage(activeImage.siblings().first().children('a'));
	};

	//Moves to the previous image in the gallery and takes care of paging the thumbnail carousel if necessary
	var movePreviousImage = function() {

		var activeImage = getActiveThumb();
		var carousel = getCarouselObject();

		if (carousel != undefined) {
			if (getjCarouselIndex(activeImage) == getjCarouselFirstIndex() && totalThumbs > settings.pageLength && settings.thumbCarouselPrevButtonSelector != null)
				carousel.prev();
		}

		// using prevAll('li').eq(0) because PIE adds css3-container elements in between the li's on some brands
		// note that prevAll returns elements in reverse document order, so that eq(0) returns the immediately preceding element, as one might expect
		if (0 < activeImage.prevAll('li').eq(0).children('a').length) {
			changeImage(activeImage.prevAll('li').eq(0).children('a'), 0, false, focusOnExtraContent);
		} else {
			var list = activeImage.siblings('li');
			for (var i = (list.length - 1); i > (-1); i--) {
				if (jQuery(list[i]).children('a').length > 0) {
					changeImage(jQuery(list[i]).children('a'), 0, false, focusOnExtraContent);
					break;
				}
			}
		}

		//0 < activeImage.prev().children('a').length ? changeImage(activeImage.prev().children('a')) : changeImage(activeImage.siblings().last().children('a'));
	};

	/* Utility Functions */
	var getActiveImage = function() {
		return mainImageElement.find('img.active');
	};

	var getImage = function(src) {
		return mainImageElement.find('img[src*="' + src + '"]');
	};

	var getActiveThumb = function() {
		return jQuery('li.active', thumbCarouselElement);
	};

	var getCarouselObject = function(selector, element) {
		if (selector === undefined)
			selector = 'ul';
		if (element === undefined)
			element = thumbCarouselElement;

		return jQuery(selector, element).data('jcarousel');
	};

	var getjCarouselFirstIndex = function() {
		var carousel = getCarouselObject();
		if (carousel)
			return carousel.first;
	};

	var getjCarouselLastIndex = function() {
		var carousel = getCarouselObject();
		if (carousel)
			return carousel.last;
	};

	var getjCarouselIndex = function(element) {
		return element.attr('jcarouselindex');
	};

	//This seems like it would be identical to getjCarouselIndex but it isn't - this will give you the index of the element in source order.
	//jCarousel has it's own index which is um, interesting.
	var getActiveThumbIndex = function() {
		return getThumbIndex(getActiveThumb());
	};

	var getThumbIndex = function(element) {
		return thumbCarouselElement.find('ul').children(':not(css3-container)').index(element);
	};

	var isAutoRotating = false;
	var startAutoRotate = function() {
		isAutoRotating = true;
		autoRotateTimer = window.setInterval(function() {
			moveNextImage();
		}, settings.autoRotateInterval);
	};

	var stopAutoRotate = function() {
		isAutoRotating = false;
		window.clearInterval(autoRotateTimer);
	};

	var canShowPrevButton = function() {
		if (!settings.imageCarouselIsCircular && getActiveThumbIndex() == 0)
			return false;
		return true;
	};

	var canShowNextButton = function() {
		if (!settings.imageCarouselIsCircular && getActiveThumbIndex() == totalThumbs - 1)
			return false;
		return true;
	};

	var showButton = function(element, stopAnimation) {
		var button = settings.displayImageNavigationOnHoverNear ? element.children().first() : element;
		// jQuery.browser.msie ? button.show() : stopAnimation ? button.stop(true).css('opacity',1) : button.fadeIn();
		// jQuery.browser.msie ? button.show().css({ visibility: 'visible' }) : stopAnimation ? button.stop(true).show().css({ opacity: 1, visibility: 'visible' }) : button.show().css({ visibility: 'visible' }).animate({ opacity: 1 });

		if (jQuery.browser.msie) {
			if (settings.displayImageNavigationOnHoverNear) {
				button.show();
			} else {
				button.show().css({
					visibility : 'visible'
				});
				element.css({
					backgroundImage : element.data('GalleryButtonBackgroundImage'),
					backgroundColor : element.data('GalleryButtonBackgroundColor'),
					cursor : element.data('GalleryButtonCursor')
				});
				element.children().first().css({
					backgroundImage : element.data('GalleryButtonChildBackgroundImage'),
					backgroundColor : element.data('GalleryButtonChildBackgroundColor'),
					cursor : element.data('GalleryButtonChildCursor')
				});
			}
		} else {
			stopAnimation ? button.stop(true).show().css({
				opacity : 1,
				visibility : 'visible'
			}) : button.show().css({
				visibility : 'visible'
			}).animate({
				opacity : 1
			});
			element.css({
				cursor : element.data('GalleryButtonCursor')
			});
			element.children().first().css({
				cursor : element.data('GalleryButtonChildCursor')
			});
		}

		if ((jQuery('#brand').text() == 'DT' ) && ( element.is('.home .gallery_prev') ) && (jQuery('#findhotel').css('display') != 'none' )) {
			element.css('visibility', 'hidden');
		}
	};

	var hideButton = function(element, stopAnimation) {
		var button = settings.displayImageNavigationOnHoverNear ? element.children().first() : element;
		// jQuery.browser.msie ? button.hide() : stopAnimation ? button.stop(true).css('opacity',0) : button.fadeOut();
		// jQuery.browser.msie ? button.show().css({ visibility: 'hidden' }) : stopAnimation ? button.stop(true).show().css({ opacity: 0, visibility: 'visible' }) : button.show().css({ visibility: 'visible' }).animate({ opacity: 0 });

		if (jQuery.browser.msie) {
			if (settings.displayImageNavigationOnHoverNear) {
				button.hide();
			} else {
				button.show().css({
					visibility : 'visible'
				});
				element.css({
					backgroundImage : 'none',
					backgroundColor : 'transparent',
					cursor : 'auto'
				});
				element.children().first().css({
					backgroundImage : 'none',
					backgroundColor : 'transparent',
					cursor : 'auto'
				});
			}
		} else {
			stopAnimation ? button.stop(true).show().css({
				opacity : 0,
				visibility : 'visible'
			}) : button.show().css({
				visibility : 'visible'
			}).animate({
				opacity : 0
			});
			element.css({
				cursor : 'auto'
			});
			element.children().first().css({
				cursor : 'auto'
			});
		}

		if ((jQuery('#brand').text() == 'DT' ) && ( element.is('.home .gallery_prev') ) && (jQuery('#findhotel').css('display') != 'none' )) {
			element.css('visibility', 'hidden');
		}
	};

	var showLoadingImage = function() {
		//if (0 == jQuery('.loading', baseSelectorElement).length) jQuery('<div><img src="/skins/common/img/loader.gif" alt="loading"/></div>').addClass('loading').appendTo(jQuery(settings.controlsSelector, baseSelectorElement)).fadeIn(4000);
	};

	var removeLoadingImage = function() {
		//jQuery('.loading', baseSelectorElement).remove();
	};

	/* End Utility Functions */

	//Assign jQuery objects to local variables to prevent traversal for them everytime we need them.
	baseSelectorElement = undefined === settings.baseSelectorElement ? jQuery(settings.baseSelector) : jQuery(settings.baseSelectorElement);

	mainImageElement = jQuery(settings.mainImageSelector, baseSelectorElement);

	controlsElement = jQuery(settings.controlsSelector, baseSelectorElement);
	captionToggleElement = jQuery(settings.captionsSelector, baseSelectorElement);
	galleryPhotoDescriptionElement = jQuery(settings.galleryPhotoDescriptionSelector, baseSelectorElement);
	thumbCarouselElement = jQuery(settings.thumbCarouselContentSelector, baseSelectorElement);
	categorySelectorElement = jQuery(settings.categorySelector, baseSelectorElement);
	counterElement = jQuery(settings.counterSelector, baseSelectorElement);
	nextImageButtonElement = jQuery(settings.nextImageButtonSelector, baseSelectorElement);
	prevImageButtonElement = jQuery(settings.prevImageButtonSelector, baseSelectorElement);
	carouselNextButtonElement = jQuery(settings.thumbCarouselNextButtonSelector, baseSelectorElement);
	carouselPrevButtonElement = jQuery(settings.thumbCarouselPrevButtonSelector, baseSelectorElement);
	extraContentElement = jQuery(settings.extraContentSelector, baseSelectorElement);

	if (settings.addClass != null)
		mainImageElement.parent().addClass(settings.addClass).css('visibility', 'visible');

	//Calculate the height of an individual item in the category drop down.
	if (settings.hasCategories) {
		if (0 < categorySelectorElement.length) {
			categoryItemHeight = categorySelectorElement.children().first().outerHeight();
		}
		//if (!settings.displayCategoryLabel) categorySelectorElement.children().first().detach();
	}

	if (0 < mainImageElement.length) {
		var initialGallery = settings.hasCategories ? categorySelectorElement.children('li.selected').first() : null;
		initGalleryDisplay(initialGallery, true);
		if (settings.autoRotateInterval)
			startAutoRotate();
	}
}; 