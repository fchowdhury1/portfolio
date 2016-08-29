/**
 * jQuery is REQUIRED
 */
try {
	window.jsLoader = window.jsLoader || [];
		(function() {
		// loading will be true if jsLoader is set up or falsey (undefined) beforehand
		jsLoader.loading = true;
	
		var i;
		var syncLoadJSQueue = [];
		var syncLoadJSRunning = false;
		var loadedUrls = [];
		var originalWrite = document.write;
		var originalWriteLn = document.writeln;
		var hiddenDiv = jQuery('<div />').css('display', 'none').appendTo('body');

		/**
		 * item.url is url to script
		 * item.callback is callback (ok if undefined)
		 */
		var asyncLoadJS = function(item) {
			// check for previous load
			if (0 <= jQuery.inArray(item.url, loadedUrls)) {
				// this url was loaded already
				return;
			}
		
			// add url to loaded list because we're going to load it
			loadedUrls.push(item.url);
		
			// ok to load
			jQuery.getScript(item.url, item.callback);
		};

		var _syncLoadJS = function() {
			// end processing if empty queue
			if (0 === syncLoadJSQueue.length) {
				syncLoadJSRunning = false;
				// set write and writeln back to normal
				document.write = originalWrite;
				document.writeln = originalWriteLn;
				// clear loadedUrls for next page load
				// loadedUrls = [];
				return;
			}
		
			// get the item from the queue
			var queueItem = syncLoadJSQueue.shift();
		
			// check for previous load
			if (0 <= jQuery.inArray(queueItem.url, loadedUrls)) {
				// this url was loaded already, so keep processing queue, but return to skip this item
				_syncLoadJS();
				return;
			}
		
			// if queue's not running yet, override write and writeln
			if (!syncLoadJSRunning) {
				document.write = document.writeln = function(html) {
					hiddenDiv.append(html);
				}
			}

			// start processing queue
			syncLoadJSRunning = true;

			// add url to loaded list because we're going to load it
			loadedUrls.push(queueItem.url);
		
			/**
			 * queueItem.url is url to script
			 * queueItem.callback is callback (ok if undefined)
			 */
			jQuery.getScript(queueItem.url, function() {
				// handle user callback function
				if ('function' === jQuery.type(queueItem.callback)) {
					queueItem.callback();
				}

				// continue processing queue
				_syncLoadJS();
			});
		};

		var syncLoadJS = function() {
			if (syncLoadJSRunning) {
				// already processing the queue
				return;
			}

			// process the queue
			_syncLoadJS();
		};

		var processItem = function(item) {
			if (jQuery.isPlainObject(item)) {
				if (undefined === item.type) {
					// set default type
					item.type = 'syncJS';
				}

				switch (item.type)
				{
					case 'asyncJS':
						asyncLoadJS(item);
						break;

					case 'syncJS':
						syncLoadJSQueue.push(item);
						break;

					default:
						// nothing to do
						return;
				}
			}
		};
	
		var _push = function(item) {
			// set up item to be processed as sync or async
			processItem(item);
			// process syncLoadJSQueue
			syncLoadJS();
		};
	
		// reset internal syncJS queue
		jsLoader.resetSyncJSQueue = function() {
			// any current item will still complete loading since we're just clearing the queue
			syncLoadJSQueue = [];
		};
	
		// reset internal duplicate load url list
		jsLoader.resetDupes = function() {
			loadedUrls = [];
		};
	
		// reset jsLoader array
		jsLoader.resetItems = function() {
			// not simply setting to [] since that would kill our added functionality
			try {
				while (0 < jsLoader.length) {
					jsLoader.pop();
				}
			} catch(e) {
				/* no-op */
			}
		};
	
		// reset jsLoader completely
		jsLoader.resetLoader = function() {
			jsLoader.resetSyncJSQueue();
			jsLoader.resetDupes();
			jsLoader.resetItems();
		};
	
		// keep original push function around
		jsLoader.originalPush = jsLoader.push;

		// process outstanding queue
		// IMPORTANT: do not cache length since could be still pushing 
		for (i = 0; i < jsLoader.length; ++i) {
			_push(jsLoader[i]);
		}
	
		// IMPORTANT: override push function after initial queue is processed
	
		// override push function
		jsLoader.push = function(item) {
			// do normal push
			jsLoader.originalPush(item);
		
			// new push function
			_push(item);
		};
	
		// ready will be true if jsLoader is set up or falsey (undefined) beforehand
		jsLoader.ready = true;
		jsLoader.loading = false;
	})();
} catch(e) {
	/* no-op */
}
