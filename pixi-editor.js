
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
			graphics.lineStyle(lineWidth, lineColor, 1);
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
		liveGraphics.lineStyle(lineWidth, lineDrawingColor, 1);
		liveGraphics.drawPath(path);
	    
	    renderer.render(stage);
	    requestAnimFrame(animate);
	}

	var setLineWidth = function(width){
		lineWidth = width;
	}

	var setLineColor = function(color){
		lineColor = color;
		lineDrawingColor = color;
	}

	var getImage = function(){
		renderer.render(stage);
		return renderer.view.toDataURL();		
	}

	var __construct = function(id, width, height) {
        stage = new PIXI.Stage(0x97c56e, true);
        renderer = new PIXI.autoDetectRenderer(width, height, null, true, true);

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
		setLineColor: setLineColor,
		getImage: getImage,
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
			
			$('<ul />', {id: 'main'}).addClass('dropdown-menu').append([
				$('<li />', {text: 'change line width'}).addClass('dropdown-header'),
				$('<li />').append($('<a/>', {text: '3px', id: 'change3px'})),
				$('<li />').append($('<a/>', {text: '5px', id: 'change5px'})),
				$('<li />').append($('<a/>', {text: '10px', id: 'change10px'})),
				$('<li />', {text: 'change line color'}).addClass('dropdown-header'),
				$('<li />').append(
					$('<span/>')
						.addClass('col-md-offset-2')
						.append(
							$('<input/>', {id: 'changeColorInput'})
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

		text: [
			$('<button />', {id: 'text'})
				.addClass('btn btn-default')
				.prepend([
					$('<span />').addClass('glyphicon glyphicon-font')
					])			
				.attr('type','button'),
			]
		};

	var menu = [];
	menu.push($('<div />', {id:'submenu1'}).addClass('btn-group').append(buttons.edit));
	menu.push('&nbsp;');
	menu.push($('<div />', {id:'submenu2'}).addClass('btn-group').append(buttons.save));
	menu.push('&nbsp;');
	menu.push($('<div />', {id:'submenu2'}).addClass('btn-group').append(buttons.text));


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

		$("#save").click(function(){
			var data = canvas2.getImage();
			var win = window.open();
			win.document.write("<img src='" + data + "'/>");			
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
	 	   		//$('#main').dropdown('toggle');
			}
		});

	}();

}



