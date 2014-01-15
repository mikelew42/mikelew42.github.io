<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Insert title here</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script src="../js/guides.js"></script>
	<script src="../js/boxMath.js"></script>
	<script>




		// parseInt($el.css('padding-' + where).replace('px',''))
		$(document).ready(function(){
			var $box = $('#box'),
			contentBoxTop = pxGuide(),
			contentBoxBottom = pxGuide(),
			contentBoxLeft = pxGuide(),
			contentBoxRight = pxGuide(),

			paddingBoxTop = pxGuide(),
			paddingBoxBottom = pxGuide(),
			paddingBoxLeft = pxGuide(),
			paddingBoxRight = pxGuide(),

			borderBoxTop = pxGuide(),
			borderBoxBottom = pxGuide(),
			borderBoxLeft = pxGuide(),
			borderBoxRight = pxGuide(),

			marginBoxTop = pxGuide(),
			marginBoxBottom = pxGuide(),
			marginBoxLeft = pxGuide(),
			marginBoxRight = pxGuide();

			cross = crosshairs({x: "50%", y: "50%"});
			cross.update()
			updateContentGuides();
			updatePaddingGuides();
			updateBorderGuides();
			updateMarginGuides();

			$(window).resize(function(){
				updateContentGuides();
				updatePaddingGuides();
				updateBorderGuides();
				updateMarginGuides();
			});

			function updateContentGuides(){
				//return false;
				contentBoxTop.update( { y: $box.contentBox().top } );
				contentBoxBottom.update( {y: $box.contentBox().bottom} );
				contentBoxLeft.update( {x:$box.contentBox().left} );
				contentBoxRight.update( {x:$box.contentBox().right} );
			}

			function updatePaddingGuides(){
				return false;
				paddingBoxTop.update( { y: $box.paddingBox().top } );
				paddingBoxBottom.update( {y: $box.paddingBox().bottom} );
				paddingBoxLeft.update( {x:$box.paddingBox().left} );
				paddingBoxRight.update( {x:$box.paddingBox().right} );
			}

			function updateBorderGuides(){
				return false;
				borderBoxTop.update( { y: $box.borderBox().top } );
				borderBoxBottom.update( {y: $box.borderBox().bottom} );
				borderBoxLeft.update( {x:$box.borderBox().left} );
				borderBoxRight.update( {x:$box.borderBox().right} );
			}

			function updateMarginGuides(){
				return false;
				marginBoxTop.update( { y: $box.marginBox().top } );
				marginBoxBottom.update( {y: $box.marginBox().bottom} );
				marginBoxLeft.update( {x:$box.marginBox().left} );
				marginBoxRight.update( {x:$box.marginBox().right} );
			}

			/*
			console.log($box.contentBox().width);
			console.log($box.contentBox().right - $box.contentBox().left);

			console.log($box.contentBox().height);
			console.log($box.contentBox().bottom - $box.contentBox().top);
			*/
		});

	</script>
	<style>
		* { margin: 0; padding: 0; }
		.trans { background: url('transparency.png') repeat transparent; }
	.wrap { position: absolute; left: 15%; top: 10%; right: 15%; bottom: 10%; }
		#box { margin: 20px; border: 10px solid black; padding: 20px; background: #eee; }
		.inner { min-height: 20px; background: #fff;; }

/*
	.px-guide { background: black; font-size: 11px; }
	.h-px-guide { height: 1px; width: 100%; position: absolute; top: 50%; }
	.v-px-guide { width: 1px; height: 100%; position: absolute; left: 50%; } */
	</style>
</head>
<body>
<h1>This file has some box-model math to compute the padding box, </h1>
<div class="wrap trans">
	<div id="box">
		<div class="inner"></div>
	</div>
</div>
</body>
</html>