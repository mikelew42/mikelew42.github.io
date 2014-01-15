// Requires MPL.Events
;(function($){

	if (typeof MPL !== "object")
		MPL = {};

	// Keep the constructor empty!
	MPL.Item = function(){};

	// Extend the prototype, don't reset it, if possible
	$.extend( MPL.Item.prototype = new MPL.Events(), {
		constructor: MPL.Item,
		initChildren: function(){
			if (!this.children)
				this.children = new MPL.Items();
		}
	});

	// Should be ok with constructor property above.
	// MPL.Item.prototype.constructor = MPL.Item;

	// "Static" properties and methods
	$.extend( MPL.Item, {

	});

	////////////////////////
	//////// ITEMS ///////////
	/////////////////////

	// Keep the constructor empty!
	MPL.Items = function(){};

	// Extend the prototype, don't reset it, if possible
	$.extend( MPL.Items.prototype = new MPL.Events(), {
		initChildren: function(){
			if (!this.children)
				this.children = new MPL.Items();
		}
	});

	MPL.Item.prototype.constructor = MPL.Item;

	// "Static" properties and methods
	$.extend( MPL.Item, {

	});

})(jQuery);
