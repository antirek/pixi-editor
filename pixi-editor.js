
var Canvas = function(id, width, height){
	
	var stage = null;
	var renderer = null;

	var mode = 'draw';
	var drawing = false;
	var path = [];

	var graphics = new PIXI.Graphics();
	var liveGraphics = new PIXI.Graphics();

	var lineWidth = '10';
	var lineColor = '0xffd920';
	var lineDrawingColor = '0xffd920';
	var lineAlpha = '1';
	
	var enableDrawMode = function(){
		
		setDrawEvents();
	}

	var disableDrawMode = function(){
		
		dropDrawEvents();
	}

	var setDrawEvents = function(){
		stage.mousedown = stage.touchstart = function(e) {
			path = [];
			var position = e.global;
		    drawing = true;
		};

		stage.mousemove = stage.touchmove = function(e) {
			if(!drawing){return}
			var position = e.global;
			path.push(parseInt(position.x));
			path.push(parseInt(position.y));
		};

		stage.mouseup = stage.touchend = function(e){
			drawing = false;
			graphics.lineStyle(lineWidth, lineColor, lineAlpha);
			graphics.drawPath(path);
			path = [];
		}
	}

	var dropDrawEvents = function(){
		stage.mousedown = stage.touchstart = '';
		stage.mousemove = stage.touchmove = '';
		stage.mouseup = stage.touchend = '';
	}

	var animate = function() {

	    liveGraphics.clear();
		liveGraphics.lineStyle(lineWidth, lineDrawingColor, lineAlpha);
		liveGraphics.drawPath(path);
	    
	    renderer.render(stage);
	    requestAnimFrame(animate);
	}

	var setLineWidth = function(width){
		lineWidth = width;
	}

	var setBackgroundColor = function(color){
		stage.setBackgroundColor(color);
	}

	var setLineColor = function(color){
		lineColor = color;
		lineDrawingColor = color;		
	}

	var setLineAlpha = function(alpha){
		lineAlpha = alpha;
	}

	var getImage = function(){
		renderer.render(stage);
		return renderer.view.toDataURL();		
	}

	var __construct = function(id, width, height) {
        stage = new PIXI.Stage(0x97c56e, true);
        
        renderer = new PIXI.autoDetectRenderer(width, height, null, false, true);
        
        stage.transparent = true;
        document.getElementById(id).appendChild(renderer.view);
        renderer.view.style.position = "relative";
        renderer.render(stage); 

        stage.addChild(graphics);
		stage.addChild(liveGraphics);


		animate();

    }(id, width, height);

	return {
		enableDrawMode: enableDrawMode,
		disableDrawMode: disableDrawMode,
		setLineWidth: setLineWidth,
		setBackgroundColor: setBackgroundColor,
		setLineColor: setLineColor,
		setLineAlpha: setLineAlpha,
		getImage: getImage,
		stage: stage,
	};
};

var Menu = function (id) {

	var buttons = {
		edit:[
			$('<button />')
				.addClass('btn btn-default')
				.prepend([
					$('<span />').addClass('glyphicon glyphicon-pencil')
					])
				.attr('type','button'),

			$('<button />')
				.addClass('btn btn-default dropdown-toggle')
				.attr('data-toggle', 'dropdown')
				.attr('type', 'button')
				.append([
					$('<span />').addClass('caret'),
					$('<span />', {text: 'Toggle Dropdown'}).addClass('sr-only')
				]),
			
			$('<ul />', {id: 'group-edit-dropdown'}).addClass('dropdown-menu').append([
				$('<li />', {text: 'Width'}).addClass('dropdown-header'),
				$('<li />').append($('<a/>', {text: '3px', id: 'change3px'})),
				$('<li />').append($('<a/>', {text: '5px', id: 'change5px'})),
				$('<li />').append($('<a/>', {text: '10px', id: 'change10px'})),
				
				$('<li />').addClass('divider'),
				$('<li />', {text: 'Color'}).addClass('dropdown-header'),
				$('<li />').append(
					$('<span/>')
						.addClass('col-md-offset-2')
						.append(
							$('<input/>', {id: 'changeColorInput'})
							.attr('style', 'display:none;'))
					),
				
				$('<li />').addClass('divider'),
				$('<li />', {text: 'Alpha'}).addClass('dropdown-header'),
				$('<li />').append($('<a/>', {text: '0.2', id: 'change02'})),
				$('<li />').append($('<a/>', {text: '0.5', id: 'change05'})),
				$('<li />').append($('<a/>', {text: '1', id: 'change1'})),

				$('<li />').addClass('divider'),
				$('<li />', {text: 'Background Color'}).addClass('dropdown-header'),
				$('<li />').append(
					$('<span/>')
						.addClass('col-md-offset-2')
						.append(
							$('<input/>', {id: 'changeBackgroundColorInput'})
							.attr('style', 'display:none;'))
					),
				]),			
			],

		save: [
			$('<button />', {id: 'save'})
				.addClass('btn btn-default')
				.prepend([
					$('<span />').addClass('glyphicon glyphicon-save')
					])			
				.attr('type','button'),
			],		
		};

	var menu = [];
	menu.push($('<div />', {id:'group-edit'}).addClass('btn-group').append(buttons.edit));
	menu.push('&nbsp;');
	menu.push($('<div />', {id:'group-save'}).addClass('btn-group').append(buttons.save));
	


	var _construct = function(id){
		$('#view').prepend(menu);
	}(id);

}


var editor = function(id, width, height){

	var menu_params = {
		width: '100%',
		height: '40'
	}

	var canvas_params = {
		width: width,
		height: height - menu_params.height
	} 

	var canvas_id = id + '_canvas';

	$('#'+id).append($('<div />',{id: canvas_id}));

	var canvas2 = new Canvas(canvas_id, canvas_params.width, canvas_params.height);
	canvas2.enableDrawMode();
	

	var menu = new Menu(id);


	var  initButtons = function(){

		$("#drawButton").click(function(){
			if($(this).hasClass('active')){
				canvas2.disableDrawMode();
				$(this).removeClass('active');
			}else{
				canvas2.enableDrawMode();
				$(this).addClass('active');
			}
		})

		$("#change3px").click(function(){
			canvas2.setLineWidth('3');
		});

		$("#change5px").click(function(){
			canvas2.setLineWidth('5');
		});

		$("#change10px").click(function(){
			canvas2.setLineWidth('10');
		});

		$("#change02").click(function(){
			canvas2.setLineAlpha('0.2');
		});

		$("#change05").click(function(){
			canvas2.setLineAlpha('0.5');
		});

		$("#change1").click(function(){
			canvas2.setLineAlpha('1');
		});

		$("#save").click(function(){
			var data = canvas2.getImage();
			var win = window.open(data);
		});


		$("#changeColorInput").spectrum({
	   		color: "#ffd920",
	   		showPalette: true,
	    	palette: [
	       		['black', 'white', 'red'],
	        	['green', 'yellow', 'purple']
	    	],
	   		change: function(color) {
	 	   		canvas2.setLineColor(color.toHexString().replace('#','0x')); // #ff0000
	 	   		$('#group-edit-dropdown').dropdown('toggle');
			}
		});


		$("#changeBackgroundColorInput").spectrum({
	   		color: "#ffd920",
	   		showPalette: true,
	    	palette: [
	       		['black', 'white', 'red'],
	        	['green', 'yellow', 'purple']
	    	],
	   		change: function(color) {
	 	   		canvas2.setBackgroundColor(color.toHexString().replace('#','0x')); // #ff0000
	 	   		$('#group-edit-dropdown').dropdown('toggle');
			}
		});

	}();

	return {
		getImage: canvas2.getImage
	}
}