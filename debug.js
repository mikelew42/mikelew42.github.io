;(function($){

	var MPL = window.MPL = {};

	MPL.ItemFactory = {
		rules: [],
		registerItemConstructor: function(ItemConstructor){
			if (!this.rules[ItemConstructor.priority])
				this.rules[ItemConstructor.priority] = [];

			this.rules[ItemConstructor.priority].push(ItemConstructor);
		},
		createItem: function(options){
			for (var priority in this.rules){
				for (var i in this.rules[priority]){
					if ( this.rules[priority][i].validate(options) ){
						return new this.rules[priority][i](options);
					}
				}
			}
			return false;
		}
	};

/* ITEM */
	var itemDefaults = {
		parent: null,
		icon: null,
		title: 'Item Title',
		content: null,
		viewConstructor: 'ItemView'
	};
	MPL.Item = Backbone.Model.extend({
		defaults: itemDefaults,
		initialize: function(){
			if (this.get('parent'))
				this.get('parent').add(this);

			this.children = new MPL.Items();

			if (this.get('backtrace')){
				this.set('line', this.get('backtrace')[0].line);
				this.set('file', this.get('backtrace')[0].file);
			}

			this.itemInit();
		},
		itemInit: function(){},
		render: function(){
			if (this.get('rendered'))
				return this;

			this.view = new MPL[this.get('viewConstructor')]({ model: this });

			if (this.get('draggable')){
				this.view.undelegateEvents().$contentWrap.show();
			}

			this.set('rendered', true);

			return this;
		},
		renderChildren: function(){
			if (this.get('childrenRendered'))
				return this;

			this.children.invoke('render');
			this.set('childrenRendered', true);
			return this;
		},
		add: function(logItem){
			logItem.set('parent', this);

			this.children.add(logItem);

			return this;
		},
		getFileAndLine: function(){
			if (this.get('backtrace'))
				return this.get('backtrace')[0].file + "@" + this.get('backtrace')[0].line;
		}
	});
	$.extend(MPL.Item, {
		type: 'default',
		priority: 100,
		validate: function(options){ return true; }
	});
	MPL.ItemFactory.registerItemConstructor(MPL.Item);

/* GROUP */
	MPL.GroupItem = MPL.Item.extend({
		defaults: $.extend({}, itemDefaults, {
			viewConstructor: "GroupItemView"
		}),
		itemInit: function(){
			this.set('title', this.get('name'));
		}
	});
	$.extend(MPL.GroupItem, {
		type: 'group' // priority and validate shouldn't be necessary
	});
	// MPL.ItemFactory.registerItemConstructor(MPL.GroupItem); // groups won't be part of the dynamic construction, for now

/* FILE */
	MPL.FileItem = MPL.Item.extend({
		defaults: $.extend({}, itemDefaults, {
			viewConstructor: "FileItemView"
		}),
		itemInit: function(){
			this.set('title', this.get('file'));
		}
	});

/* VALUE */
	var valueItemDefaults = {
		parent: null,
		icon: null,
		name: 'valueName',
		value: 'default value',
		content: null,
		viewConstructor: 'ValueItemView'
	};
	MPL.ValueItem = MPL.Item.extend({
		defaults: valueItemDefaults
	});
	$.extend(MPL.ValueItem, {
		type: 'value',
		priority: 55,
		validate: function(options){ return typeof options.value !== "undefined"; }
	});
	MPL.ItemFactory.registerItemConstructor(MPL.ValueItem);

/* BOOLEAN */
	MPL.BooleanItem = MPL.ValueItem.extend({

	});
	$.extend(MPL.BooleanItem, {
		type: 'boolean',
		priority: 50,
		validate: function(options){ return typeof options.value === "boolean"; }
	});
	MPL.ItemFactory.registerItemConstructor(MPL.BooleanItem);

/* STRING */
	MPL.StringItem = MPL.ValueItem.extend({});
	$.extend(MPL.StringItem, {
		type: 'string',
		priority: 50,
		validate: function(options){ return typeof options.value === "string"; }
	});
	MPL.ItemFactory.registerItemConstructor(MPL.StringItem);

/* NUMBER */
	MPL.NumberItem = MPL.ValueItem.extend({});
	$.extend(MPL.NumberItem, {
		type: 'number',
		priority: 50,
		validate: function(options){ return typeof options.value === "number"; }
	});
	MPL.ItemFactory.registerItemConstructor(MPL.NumberItem);

/* OBJECT */
	MPL.ObjectItem = MPL.ValueItem.extend({
		defaults: $.extend({}, valueItemDefaults, {
			viewConstructor: "ObjectItemView"
		})
	});
	$.extend(MPL.ObjectItem, {
		type: 'object',
		priority: 45,
		validate: function(options){
			return typeof options.value === "object";
		}
	});
	MPL.ItemFactory.registerItemConstructor(MPL.ObjectItem);

	var xxcreate = function(options){
		if (typeof options.value === 'object'){
			var type = (options.value && options.value.type) || "Unknown";
			var icon;

			if (options.value instanceof jQuery){
				type = 'jQuery';
				icon = '$()';
			} else if (options.value instanceof Backbone.Model){
				type = 'Backbone.Model';
				icon = options.value.cid;
			} else if (options.value instanceof Backbone.View){
				type = 'Backbone.View';
				icon = options.value.cid;
			} else if (options.value instanceof Backbone.Collection){
				type = 'Backbone.Collection';
				icon = options.value.cid;
			}

			icon && (icon = "{" + icon + "}" );

			var item = new MPL.ObjectItem({
				icon: icon || "{ }",
				title: options.title + " (" + type + ")"
			});
			for (var i in value){
				if (value.hasOwnProperty(i)){
					if (value[i] && value[i].toString()){
						if (limit)
							item.addItem(MPL.CreateValueItem("." + i, value[i].toString()));
						else
							item.addItem(MPL.CreateValueItem("." + i, value[i], true));
					}
				}
			}
		}
		return item || false;
	};

/* jQUERY */
	MPL.jQueryItem = MPL.ObjectItem.extend({
		defaults: $.extend({}, valueItemDefaults, {
			viewConstructor: "ObjectItemView"
		})
	});
	$.extend(MPL.jQueryItem, {
		type: 'jQuery',
		priority: 40,
		validate: function(options){
			return options.value instanceof jQuery;
		}
	});
	MPL.ItemFactory.registerItemConstructor(MPL.jQueryItem);

/* BACKBONE MODEL */
	MPL.BackboneModelItem = MPL.ObjectItem.extend({
		defaults: $.extend({}, valueItemDefaults, {
			viewConstructor: "ObjectItemView"
		})
	});
	$.extend(MPL.BackboneModelItem, {
		type: 'Backbone.Model',
		priority: 40,
		validate: function(options){
			return options.value instanceof Backbone.Model;
		}
	});
	MPL.ItemFactory.registerItemConstructor(MPL.BackboneModelItem);


/*****************/
/**    VIEWS    **/
/*****************/
	MPL.ItemView = Backbone.View.extend({
		initialize: function(){
			this.render();
			/// this.listenTo(this.model, 'change', this.refresh);
		},
		events: {
			"click .mpl-titlebar": "toggle"
		},
		render: function(){
			if (!this.$el.hasClass('mpl-item'))
				this.createElement();

			this.refresh();
		},
		toggle: function(){
			this.model.renderChildren();

			// if no content or children, just stop
			// this could be problematic if children / content is removed after it slidesDown
			if (!$.trim(this.$content.html()) && !$.trim(this.$children.html()))
				return false;

			// slide Toggle
			this.$contentWrap.slideToggle();

			return false;
		},
		refresh: function(){
			this.refreshLine();
			this.refreshIcon();
			this.refreshTitle();
			this.refreshContent();
			this.refreshParent();
			this.refreshFileWrap();
			this.customRefresh();
		},
		refreshLine: function(){
			if (this.model.get('line')){
				this.$line.html(this.model.get('line'));
				this.$el.addClass('mpl-has-line');
			} else {
				this.$line.hide();
				this.$el.removeClass('mpl-has-line');
			}
		},
		refreshIcon: function(){
			if (this.model.get('icon'))
				this.$icon.html(this.model.get('icon')).show();
			else
				this.$icon.hide();
		},
		refreshTitle: function(){
			//if (this.model.get('title'))
				this.$title.html(this.getTitle());
		},
		refreshContent: function(){
			if (this.model.get('content')){
				this.$content.html(this.model.get('content'));
			}

			/*
			if (!this.$consoleLog){
				this.$consoleLog = $('<div></div>').addClass('mpl-console-log-btn').html("> console");
			}
			var view = this;
			this.$consoleLog.off('click.debug.console').on('click.debug.console', function(){
				console.log(view.model.get('value'));
			});
			this.$content.prepend(this.$consoleLog);
			*/
		},
		refreshParent: function(){
			if (this.model.get('parent')){
				this.$el.appendTo(this.model.get('parent').view.$children);
			}
		},
		refreshFileWrap: function(){
			var parent = this.model.get('parent');
			if (parent){
				var index = parent.children.indexOf(this.model),
					previousSibling = parent.children.at(index-1);
				if (this.model.get('file') !== parent.get('file')){


					if (previousSibling && previousSibling.get('file') === this.model.get('file') && previousSibling.view.fileWrap){
						this.$el.appendTo(previousSibling.view.fileWrap.$fileContent);
						this.fileWrap = previousSibling.view.fileWrap;
					} else {
						this.createFileWrap();
					}
				} else if (previousSibling && previousSibling.get('file') !== this.model.get('file')) {
					this.createFileWrap();
				}
			}
		},
		customRefresh: function(){},
		refreshEvents: function(){
			if (!$.trim(this.$content.html()) && !$.trim(this.$children.html()))
			{
				delete this.events["click .mpl-titlebar"];
				this.delegateEvents();
			} else {
				this.events['click .mpl-titlebar'] = 'toggle';
				this.delegateEvents();
			}
		},
		createFileWrap: function(){
			if (!this.fileWrap){
				this.fileWrap = new Backbone.View();
				this.fileWrap.setElement($(  _.template( $('#j-log-file-wrap-template').html())() ));
				this.fileWrap.$fileName = this.fileWrap.$el.children('.j-log-file-title');
				this.fileWrap.$fileContent = this.fileWrap.$el.children('.j-log-file-content');
			}
			this.fileWrap.$fileName.html(this.model.get('file'));

			// check if its already nested properly
			if (!this.fileWrap.$fileContent.find(this.$el).length){
				this.fileWrap.$el.insertBefore(this.$el);
				this.$el.appendTo(this.fileWrap.$fileContent);
			}

			//this.$item = this.$el;
			//this.$el = this.fileWrap.$el;
		},
		createElement: function(){
			this.setElement(    $( _.template( $('#mpl-item-template').html() )() )    );

			// $titlebar is $icon then $title
			this.$titlebar = this.$el.children('.mpl-titlebar');
			this.$line = this.$el.children('.mpl-line');
			this.$icon = this.$titlebar.children('.mpl-icon');
			this.$title = this.$titlebar.children('.mpl-title');

			// $contentWrap is $content then $children
			this.$contentWrap = this.$el.children('.mpl-content-wrap');
			this.$content = this.$contentWrap.children('.mpl-content');
			this.$children = this.$contentWrap.children('.mpl-children');

			this.customCreateElement();
		},
		customCreateElement: function(){},
		getTitle: function(){
			return this.model.get('title');
		}
	});

	MPL.GroupItemView = MPL.ItemView.extend({
		customCreateElement: function(){
			this.$el.addClass('mpl-group');
		}
	});

	MPL.ValueItemView = MPL.ItemView.extend({
		customCreateElement: function(){
			this.$el.addClass('mpl-value-item').addClass('mpl-' + this.model.constructor.type + '-item');
			this.$name = $('<span></span>').addClass('mpl-name').prependTo(this.$title);
			this.$type = $('<span></span>').addClass('mpl-type').insertAfter(this.$name);
			this.$value = $('<span></span>').addClass('mpl-value').appendTo(this.$title);
			//this.$content.html(this.model.cid);

		},
		refreshTitle: function(){ return false; },
		getTitle: function(){
			return this.model.get('name') + ": " + this.model.get('value');
		},
		customRefresh: function(){
			this.$name.html(this.model.get('name'));
			var value = this.model.get('value');

			if (typeof value === "string")
				value = '"' + value + '"';

			if (typeof value === "boolean" && !value)
				value = "false";

			if (typeof value === "object")
				value = value.toString();
			this.$value.html(value);
			this.$type.html(this.model.constructor.type);
		},
		toggle: function(){
			console.log(this.model.get('value'));
			jlog.last = this.model.get('value');
			return false;
		}
	});

	MPL.ObjectItemView = MPL.ValueItemView.extend({

	});

	MPL.Items = Backbone.Collection.extend({
		model: MPL.Item
	});

	MPL.Logger = Backbone.Model.extend({
		defaults: {},
		initialize: function(){

			this.log = new MPL.Item({
				icon: "-><-",
				title: "Logger"
			});
			this.currentItem = this.log;
			var logger = this;

			$(document).ready(function(){
				logger.render();
			});
		},
		render: function(){
			this.view = new Backbone.View({ model: this, id: 'mpl-logger' });
			this.view.$el.appendTo($('body')).draggable().resizable();
			this.view.$content = $('<div></div>').addClass('mpl-logger-content').appendTo(this.view.$el);
			this.log.render();
			this.log.view.$el.appendTo(this.view.$content);
		},
		getBacktrace: function(){
			var stack =
				((new Error).stack + '\n')
					.replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
					.replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
					.replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
					.replace(/^(.+) \((.+)\)$/gm, '$1```$2')
					.split('\n')
					.slice(1, -1);

			var backtrace = [];

			for (var i in stack){
				stack[i] = stack[i].split('```');
				var bt = {
					func: stack[i][0],
					fullPathAndLine: stack[i][1]

				};

				var pathBreakdown = stack[i][1].split(':');
				bt.file = pathBreakdown[1].replace(/^.*[\\\/]/, '');
				bt.line = pathBreakdown[2];
				bt.linePos = pathBreakdown[3];

				backtrace.push(bt);
			}

			return backtrace.slice(3);
		},
		logger: function(values){
			if (typeof values === "string"){
				this.currentItem.add(new MPL.Item({ title: values, parent: this.currentItem, backtrace: this.getBacktrace() }));
				return this;
			}

			if (typeof values === "object"){

				for (var i in values){
					var newItem = MPL.ItemFactory.createItem({
						name: i,
						value: values[i],
						parent: this.currentItem,
						backtrace: this.getBacktrace()
					});
					if (newItem) this.currentItem.add(newItem);
				}
			}
		},
		group: function(options){
			// options.name === "Group Name"
			if (typeof options === "string"){
				options = { name: options };
			}
			options.parent = this.currentItem;
			options.backtrace = this.getBacktrace();
			console.log(options);
			var group = new MPL.GroupItem(options);
			this.currentItem = group;
			return this;
		},
		end: function(){
			if (this.currentItem.get('parent'))
				this.currentItem = this.currentItem.get('parent');
			return this;
		}
	});

	$(document).ready(function(){
		jlog.end();
		var $items = $('#mpl-items');
		jlog('DOCUMENT.READY');
		jlog.group('debug.js doc.ready');
		itemsFunc();
		jlog.end();
	});

	var tLogger = new MPL.Logger();

	window.jlog = $.proxy(tLogger.logger, tLogger);
	window.jlog.group = $.proxy(tLogger.group, tLogger);
	window.jlog.end = $.proxy(tLogger.end, tLogger);
	jlog.group('root group');

	jlog.group('New Group1');
	jlog("some text");
	jlog({ title: 'Hmmm', value: "wtf", tLogger: tLogger });
	//jlog({ myValue: 'This is my value', inGroup: 'This value should be inside the Grrrroup'});
	//jlog('end');
	jlog("some text");
	//jlog("Just log a string quickly, without thinking up a prop name?");
	var myVar = 555;
	jlog({ myVar: myVar, $body: $('body'), thisIsBoolean: true, thisIsBoooolean: false });
	jlog("some text");
	jlog.end();

	var counter = 0;
	window.debugFunction = function(){
		counter++;
		jlog({counter: counter });
	};
})(jQuery);




