(function() {
	try {
		var promo_horizontal_renderer = (function() {
			var privateVars = {
				settings: {
					output: '#promo_component #promo_content',
					template: '#promo_component #promo_content .promo_item'
				},
				
				init: function() {
					try {
						// send request for appropriate offers data
						if (offers_data.hasOwnProperty('promo_horizontal')) {
							promotionsLoader.getPromotions(offers_data['promo_horizontal'], privateVars.build_horizontal_promos, false, '');
						}
					} catch(e) {
						/* no-op */
					}
				// end init
				},
				
				build_horizontal_promos: function(jsonData) {
					// get max number of offers we can display
					if (jQuery('body').hasClass('home')) {
						var max_numTeasers = app.promoSettings.homeHorizontalPromosMaxNumOffers;
					} else {
						var max_numTeasers = app.promoSettings.propertyBrandHorizontalPromosMaxNumOffers;
					}
					
					// get the offers from the returned JSON and limit to max_numTeasers
					try {
						var offers = jsonData.offers.slice(0, max_numTeasers);
					} catch(e) {
						// array slice error, cannot continue so bail
						return;
					}
					
					var promo_template = jQuery(privateVars.settings.template).eq(0),
						output_target = jQuery(privateVars.settings.output).eq(0);
					
					// check that our selectors exist
					if (!((0 < promo_template.length) && (0 < output_target.length))) {
						// selector(s) missing, so bail
						return;
					}
					
					// get the number of offers
					var numTeasers = offers.length;

					// empty the target
					output_target.empty();
				
					// check if there is at least 1 offer
					if (0 < numTeasers) {
						for (var i = 0; i < numTeasers; ++i) {
							var new_promo = promo_template.clone(),
								offer = offers[i],
								name_length = offer.name.length,
								subheading_length = offer.subheading.length;
							
							// set up classes, add index class
							new_promo.removeClass();
							new_promo.addClass('promo_item promo' + (i + 1).toString());
							
							// evaluate template
							new_promo.find('.promo_image a').attr('href', offer.link);
							new_promo.find('.promo_headline').html(offer.name);
							new_promo.find('.promo_copy a').attr('href', offer.link);
							new_promo.find('.promo_deck').html(offer.subheading);
							new_promo.find('.promo_actionLink a').attr('href', offer.link).text(offer.linkText);
							new_promo.find('.promo_image img').attr({
								src: offer.thumbImageUrl,
								alt: new_promo.find('.promo_headline').html()
							});
							
							// append to the target
							output_target.append(new_promo);
						}
						
						if(numTeasers < max_numTeasers && app.promoSettings.shrink == true)
						{
							// set size of bar
							output_target.parent().width(jQuery(jQuery(output_target).find('li')[0]).width() * numTeasers);
						}
						
						// call carousels init from main.js
						if ('function' === jQuery.type(app.carousels.init)) {
							app.carousels.init();
						}
					}
				}
			};
			
			// items returned here will be publicly accessible.
			// =========================================
			// returns
			// =========================================
			return {
				init: privateVars.init
			};
		})();
		
		// run
		promo_horizontal_renderer.init();
	} catch(e) {
		/* no-op */
	}
})();