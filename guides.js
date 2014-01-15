(function($){

	$(document).ready(function(){
		initGuideCSS();
	});

	function initGuideCSS(){
		$(document.createElement('style')).html(
			".px-guide { background: black; font-size: 11px; }" +
			".h-px-guide { height: 1px; width: 100%; position: absolute; top: 50%; } " +
			".v-px-guide { width: 1px; height: 100%; position: absolute; left: 50%; } "
			).appendTo('head');
	}

	_pxGuide = {
		init: function(options){
			this.render();
			if (typeof options !== "undefined")
				this.update(options);
			return this;
		},
		render: function(){
			this.$el =
				$(document.createElement('div'))
					.addClass('px-guide')
					.appendTo(
						$("body")
					);
		},
		update: function(options){
			if (!this.$el)
				this.render();

			if (typeof options.x !== "undefined"){
				this.verticalGuide(options.x);
			} else if (typeof options.y !== "undefined"){
				this.horizontalGuide(options.y);
			}
		},
		verticalGuide: function(x){
			this.$el.css('left', x).removeClass('h-px-guide').addClass('v-px-guide');
		},
		horizontalGuide: function(y){
			this.$el.css('top', y).removeClass('v-px-guide').addClass('h-px-guide');
		}
	};

	_crosshairs = {
		init: function(options){
			this.render();
			if (typeof options !== "undefined")
				this.update(options);
			return this;
		},
		render: function(){
			this.hGuide = pxGuide();
			this.vGuide = pxGuide();
			this.hGuide.render();
			this.vGuide.render();
			this.$h = this.hGuide.$el;
			this.$v = this.vGuide.$el;
			this.$both = $([this.hGuide.$el[0], this.vGuide.$el[0]]);
		},
		text: function(text){
			this.$h.html(text);
		},
		update: function(options){
			if (!this.hGuide || !this.vGuide)
				this.render();

			if (typeof options === "undefined")
				return false;

			if (typeof options.x !== "undefined")
				this.vGuide.update({ x: options.x });

			if (typeof options.y !== "undefined")
				this.hGuide.update({ y: options.y });
		}
	};

	window.pxGuide = function(options){
		return Object.create(_pxGuide).init(options);
	};

	window.crosshairs = function(options){
		return Object.create(_crosshairs).init(options);
	};
})(jQuery);