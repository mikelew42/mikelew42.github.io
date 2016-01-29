;(function(){

var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;


var Value = utils.GetSet.clone({
	get: function(){
		return this.value;
	},
	set: function(val){
		if (this.value !== val){
			this.value = val;
		}
		return this.$chain || this;
	}
});

$div = function(c){
	var $d = $("<div></div>").addClass(c), $child, $parent;
	$d.type = c;

	// loop through 2nd+ args
	for (var i = 1; i < arguments.length; i++){
		// each arg is to be appended as a new child
		$child = arguments[i];
		$d.append($child);
		if (!is.str($child)){
			$child.$parent = $d;
			if ($child.type){
				$d["$"+$child.type] = $child;
				$d.$children = $d.$children || [];
				$d.$children.push('$' + $child.type);
			}
			if ($child.$children && $child.$children.length){
				for (var j = 0; j < $child.$children.length; j++){
					$d[$child.$children[j]] = $child[$child.$children[j]];
				}
			}
		}
	}
	return $d;
};

$DIV = function(c){
	return function(){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift(c);
		return $div.apply(this, args);
	};
};

$preview = $DIV('preview'); // this probably isn't necessary... just make a class

var $span = function(c){
	return $("<span></span>").addClass(c);
};

var expandable = function(view){

	view.$el.addClass('collapsed');

	view.$preview.click(function(){
		view.toggle();
	});

	view.toggle = function(){
		var view = this;
		if (view.$el.hasClass('collapsed') || view.$el.hasClass('collapsing'))
			this.expand();
		else 
			this.collapse();
	};

	view.expand = function(){
		var view = this;
		this.$el.addClass('expanding').removeClass('collapsed');
		this.$content.slideDown(function(){
			view.$el.removeClass('expanding').addClass('expanded');
		});
	};
	
	view.collapse = function(){
		var view = this;
		this.$el.addClass('collapsing').removeClass('expanded');
		this.$content.slideUp(function(){
			view.$el.removeClass('collapsing').addClass('collapsed');
		});
	};

};

var $expandable = function($el, $preview, $content){
	var api = {};

	$el.addClass('collapsed expandable');
	$content.hide();

	$preview.click(function(){
		api.toggleExpand();
	});

	api.toggleExpand = function(){
		if ($el.hasClass('collapsed') || $el.hasClass('collapsing'))
			api.expand();
		else 
			api.collapse();
	}

	api.expand = function(){
		$el.addClass('expanding').removeClass('collapsed');
		$content.slideDown(function(){
			$el.removeClass('expanding').addClass('expanded');
		});
	};
	
	api.collapse = function(){
		$el.addClass('collapsing').removeClass('expanded');
		$content.slideUp(function(){
			$el.removeClass('collapsing').addClass('collapsed');
		});
	};

	// this can be assigned to the view
	return api;
};

$View = utils.GetSet.clone({
	main: function(){
		this.main = function(){
			if (arguments.length){
				return this.set.apply(this, arguments);
			} else {
				return this.get.call(this);
			}
		};
		return this.clone.apply(this, arguments);
	},
	init: function(){
		// this.set.apply(this, arguments);
		this.render.apply(this, arguments);
	},
	render: function(){},
	get: function(){
		console.log('view get method not set');
	},
	set: function(){
		if (this.append){
			for (var i = 0; i < arguments.length; i++){
				this.append(arguments[i]);
				if (arguments[i].type)
					this["$"+arguments[i].type] = arguments[i];
			}
		}
		return this;
	}
});

var aliasFnToEl = function(fn){
	return function(){
		this.$el[fn].apply(this.$el, arguments);
		return this;
	};
};

[	'append', 'prepend', 'click', 'clickOff', 'show', 'hide', 'appendTo', 'prependTo', 'addClass', 'removeClass', 
	'css', 'attr', 'remove', 'empty', 'hasClass', 'html'].forEach(function(v){
		$View[v] = aliasFnToEl(v);
});


$Value = $View.clone({
	type: "text",
	value: "value",
	render: function(val){
		this.renderValue();
		if (is.str(val))
			this.value = val;
		this.set(this.value);
	},
	renderValue: function(){
		this.$el = $div(this.type);
	},
	get: function(){
		return this.html();
	},
	set: function(val){
		this.html(val);
		return this;
	}
});


$Item = $View.clone({
	text: "Item",
	render: function(text){
		this.renderItem();
		this.renderSimpleItem(text);
	},
	renderSimpleItem: function(text){
		this.$el.addClass('pad-self');
		if (is.str(text))
			this.text = text;
		this.$el.html(this.text);
	},
	renderItem: function(text){
		this.$el = $div('item');
	}
});

$DIV = function(c){
	return function(){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift(c);
		return $div.apply(this, args);
	};
};
$item = $DIV('item');

$item('whateva', 'blah');

// var $myItem = $Item.clone();
// $myItem( // set
// 	$preview( // clone/create
// 		$icon('beer'), // clone/create
// 		$text('This is my beer item'),
// 		$value(123)	
// 	),
// 	$content(
// 		// render children?
// 	)
// );

$ValueItem = $Item.clone({
	text: "ValueItem",
	value: "value",
	render: function(){
		this.renderItem();
		this.renderValueItem();
		this.renderText();
		this.renderValue();
	},
	renderValueItem: function(){
		this.$el.addClass('value-item pad-children ' + typeof this.value);
	},
	renderText: function(){
		this.$text = $div('text').html(this.text).appendTo(this.$el);
	},
	renderValue: function(){
		this.$value = $div('value ' + typeof this.value).html(this.value).appendTo(this.$el);
	}
});

$Icon = $View.clone({
	icon: "circle",
	render: function(icon){
		if (is.str(icon)) this.icon = icon;
		this.renderIcon();
	},
	renderIcon: function(){
		this.$el = $("<i></i>").addClass('icon fa fa-fw '+ 'fa-' + this.icon);
	},
	get: function(){
		return this.icon;
	},
	set: function(icon){
		this.$el.removeClass('fa-' + this.icon).addClass('fa-' + icon);
		this.icon = icon;
		return this.$chain || this;
	}
});


$icon = function(icon){
	var $i = $Icon.clone({icon: icon});
	$i.type = 'icon';
	return $i;
};

$IconItem = $Item.clone({
	icon: "circle",
	text: "IconItem",
	render: function(text){
		if (is.str(text)) this.text = text;
		this.renderItem();
		this.renderIconItem();
		this.renderIcon();
		this.renderText();
	},
	renderIconItem: function(){
		this.$el.addClass('icon-item pad-children');
	},
	renderIcon: function(){
		this.$icon = $Icon.clone( this.icon ).prependTo(this.$el);
	},
	renderText: function(){
		this.$text = $Value.clone( this.text ).appendTo(this.$el);
	}
});

$IconValueItem = $IconItem.clone({
	text: "IconValueItem",
	icon: "cube",
	value: "IconValueItem",
	render: function(){
		this.renderItem();
		this.renderIconItem();
		this.renderIcon();
		this.renderText();
		this.renderValueItem();
		this.renderValue();
	},
	renderValueItem: function(){
		this.$el.addClass('value-item pad-children');
	},
	renderValue: function(){
		this.$value = $div('value ' + typeof this.value).html(this.value).appendTo(this.$el);
	}
});

$ExpandableItem = $Item.clone({
	text: "ExpandableItem",
	render: function(text){
		if (is.str(text)) this.text = text;
		this.renderItem();
		this.renderExpandableItem();
		this.$preview.removeClass('pad-children').addClass('pad-self').html(this.text);
	},
	renderExpandableItem: function(){
		this.$el.addClass('expandable');
		this.renderPreview();
		this.renderContent();
		this.assign($expandable(this.$el, this.$preview, this.$content));
	},
	renderPreview: function(){
		this.$preview = $div('preview pad-children').appendTo(this.$el);
	},
	renderContent: function(){
		this.$content = $div('content pad-self').appendTo(this.$el);
	}
});

$ExpandableIconItem = $ExpandableItem.clone({
	render: function(){
		this.renderItem();
		this.renderExpandableIconItem();
	},
	renderExpandableIconItem: function(){
		this.renderExpandableItem();
		this.renderIconItem();
	},
	renderIconItem: function(){
		this.$el.addClass('icon-item');
		this.renderIcon();
		this.renderText();
	},
	renderText: function(){
		this.$text = $div('text').html(this.text).appendTo(this.$preview);
	},
	renderIcon: function(){
		this.$icon = $Icon.clone({ icon: this.icon }).prependTo(this.$preview);
	}
});

$ExpandableIconValueItem = $ExpandableIconItem.clone({
	render: function(){
		this.renderItem();
		this.renderExpandableItem();
		this.renderIconItem();
		this.renderValueItem();
	},
	renderValueItem: function(){
		this.$el.addClass('value-item');
		this.renderValue();
	},
	renderValue: function(){
		this.$value = $div('value ' + typeof this.value).html(this.value).appendTo(this.$preview);
	}
});

$FnItem = $ExpandableIconValueItem.clone({
	icon: "bolt",
	text: "FnItem()",
	value: "returnVal",
	fnName: "fnName",
	args: ["arg1", "arg2"],
	render: function(){
		this.renderItem();
		this.renderExpandableItem();
		this.renderIconItem();
		this.renderValueItem();
		this.renderFnItem();
	},
	renderFnItem: function(){
		this.$el.addClass('fn-item');
	},
	renderText: function(){
		this.$text = $div('text').appendTo(this.$preview);
		this.$fnName = $span('fn-name').html(this.fnName).appendTo(this.$text);
		this.$fnArgs = $span('fn-args').html('(').appendTo(this.$text);
		for (var i = 0; i < this.args.length; i++){
			if (i !== 0)
				this.$fnArgs.append(', ');
			this.renderArg(this.args[i]);
		}
		this.$fnArgs.append(');');
	},
	renderArg: function(arg){
		this.$fnArgs.append($span('fn-arg').html(arg));
	}
});

var getIconName = function(value){
	if (is.bool(value)){
		return value ? 'circle' : 'circle-thin';
	} else if (is.num(value)){
		return 'hashtag';
	} else if (is.str(value)){
		return 'quote-left';
	} else if (is.fn(value)){
		return 'bolt';
	} else if (is.obj(value)){
		return 'cube';
	} else if (is.arr(value)){
		return 'ellipsis-v';
	}
};

var getObjLength = function(obj){
	var count = 0;
	for (var i in obj){
		count++;
	}
	return count;
}

$viewer = function(value, name){
	var $view;
	if (is.simple(value)){
		$view = $IconValueItem.clone({
			value: value,
			icon: getIconName(value),
			text: name ? name : ""
		});
	} else if (is.obj(value)){
		$view = $ExpandableIconValueItem.clone({
			icon: 'cube',
			text: name ? name : '',
			value: "object {" + getObjLength + "}"
		});

		for (var i in value){
			if (i[0] !== "$")
				$viewer(value[i], i).appendTo($view.$content);
		}
	} else if (is.arr(value)){
		$view = $ExpandableIconValueItem.clone({
			icon: 'ellipsis-v',
			text: name ? name : '',
			value: "array [" + value.length + "]"
		});

		for (var i = 0; i < value.length; i++){
			$viewer(value[i], i).appendTo($view.$content);
		}
	} else if (is.sfn(value)){
		$view = $FnItem.clone({
			fnName: name ? name : "",
			value: "sfn"
		});

		for (var i in value){
			if (i[0] !== "$")
				$viewer(value[i], i).appendTo($view.$content);
			else {
				if (value[i] instanceof jQuery){
					var $v = $ExpandableIconValueItem.clone({
						icon: "code",
						value: "jQuery",
						text: i
					}).appendTo($view.$content).$content.html("<pre><code>" + value[i][0].outerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></pre>");
					// console.log(value[i][0].outerHTML);
				} else {
					$viewer("reference", i).appendTo($view.$content).$icon('circle');
				}
			}
		}
	} else if (is.fn(value)){
		$view = $FnItem.clone({
			fnName: name ? name : "",
			args: []
		});

		$view.$content.html("<pre>" + value.toString() + "</pre>")
	}
	return $view;
}

})();