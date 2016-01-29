;(function(){
	
	$(function(){

		// $icon = $Icon.clone('beer');
		// $icon.$el.appendTo('body');

		// $iconItem = $IconItem.clone({
		// 	text: "icon item test",
		// 	icon: "plane"
		// }).addClass('flex outlines').appendTo('body');

		function wrap(c){
			var $wrapper = $("<div><h3>" + c + "</h3></div>").addClass(c);
			$wrapper.append($Item.clone('TEst ITem').$el);

			var $valueItem = $ValueItem.clone({
				text: "test value item",
				value: "test value for value item"
			}).appendTo($wrapper);

			// $wrapper.append($Icon.clone().$el);
			$wrapper.append($IconItem.clone().$el);

			var $expandableItem = $ExpandableItem
				.clone({ 
					text: "expandable item test", 
					icon: "spoon"
				})
				.appendTo($wrapper)
				.$content.html("Content Goes Here");

			var $iconValueItem = $IconValueItem.clone({
				text: "icon value item test",
				icon: "cube",
				value: true
			}).appendTo($wrapper);

			var $expandableIconItem = $ExpandableIconItem.clone({
				text: "expandable icon item test",
				icon: "space-shuttle"
			}).appendTo($wrapper).$content.html('Content Goes Here');

			var $expandableIconValueItem = $ExpandableIconValueItem.clone({
				text: "expandable icon value item test",
				icon: "beer",
				value: 123
			}).appendTo($wrapper).$content.html('Content Goes Here');

			var $expandableIconValueItem = $ExpandableIconValueItem.clone({
				text: "objName",
				icon: "cube",
				value: "object {32}"
			}).appendTo($wrapper);

			var $prop1 = $IconValueItem.clone({
				text: "prop1",
				icon: "quote-left",
				value: "this is a string"
			}).appendTo($expandableIconValueItem.$content);		

			var $prop2 = $IconValueItem.clone({
				text: "prop2",
				icon: "hashtag",
				value: 24235
			}).appendTo($expandableIconValueItem.$content);

			var $prop3 = $expandableIconValueItem.clone().appendTo($expandableIconValueItem.$content);

			var $fn = $FnItem.clone({
				fnName: "myFuncName",
				args: ['firstArg', 'b', 'c']
			}).appendTo($wrapper);

			$viewer($ExpandableIconValueItem, "$ExpandableIconValueItem").appendTo($wrapper);

			$myDiv = $div('one', 
				$div('one1', 'one1 content'),
				$div('one2', 'one2 content'),
				$div('one3',
					$div('one3one', 'one3one content'),
					$div('one3two', 'one3two content')
				)
			);

			$preview('this is a preview').prependTo('body');

			return $wrapper;
		}

		// wrap('inline-block').appendTo('body');
		wrap('light').appendTo('body');
		wrap('outlines').appendTo('body');
		wrap('none').appendTo('body');
		// wrap('table').appendTo('body');



	});

})();