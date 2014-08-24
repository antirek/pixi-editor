pixi-editor
===========

Pixi.js based simple image editor

Demo: http://antirek.github.io/pixi-editor

Main idea of project: use **pixi-editor** as component in your project


Install
=======
 1. Run command
``````
$ bower install pixi-editor [--save]
//add pixi-editor with dependencies in bower_components folder
``````

 2. Check work
 
  a. Copy file **index.html** from **bower_components/pixi-editor/examples** to folder of your project
  b. Open in browser index.html (you must see editor like demo: http://antirek.github.io/pixi-editor)


How add in your project?
========================
Please, view detail in index.html

1. Add *.js and *.css files to head section of your page (like in index.html)
2. Add `````<div id="view"></div>````` to body section of your page
3. Add init js `````` $(function(){ editor1 = new editor('view', 650, 400);});	``````


API
===

**Constructor**

Create instance of pixi-editor

````` var editor1 = new editor(element_id, width, height); `````

**Get image**

Get current image from canvas element of pixi-editor

````` editor1.getImage(); `````

**On save callback**

Run callback function on click "Save" button

````` 
editor1.onSave(function(image){
  dropbox.save(image);
}); 
`````


