/**
 * @desc main object for comic builder component
 * @package comicBuilder
 * @author
 * 		Amr Abosree
 * 		Mustafa A. Abdel-Tawwab Jr.
 * 		Youssef Gaber
 * @since 2012-05-14 
 */
var canvas;
var comicBuilder={
	/**
	 * Options 
	 */
	memesURL:'json/memes.json.php',
	canvasElementId:"canvasElement",
	container:null,
	canvasElement: null,
	width:false,
	height:false,
	panelHeight:230,
	rowsNumber:2,
	canvas:null,
	searchXHR:null,
	isTextSelected:false,
	/**
	 * init function for assigning events and setting up structure
	 */
	init:function(){
		/*
		 * setting stuff
		 */
		this.canvasElement = jQuery("#"+this.canvasElementId);
		this.container=this.canvasElement.parent();
		this.width=this.container.width();
		this.height=this.container.height();
		
		this.loadMemes();
		canvas = new fabric.Canvas(this.canvasElementId, {backgroundColor: '#FFFFFF'});
		canvas.setWidth(this.width);
		canvas.setHeight(this.height);
		this.newCanvas();
		
		/**
		 * events 
		 */
		
		//why 3 events? see this: http://fabricjs.com/events/
		canvas.observe('object:selected', function(e) {
			comicBuilder.updateLayers();
			if(e.target instanceof fabric.Text){
				comicBuilder.isTextSelected = true;
				comicBuilder.textTool(true);
			} else {
				comicBuilder.isTextSelected = false;
				comicBuilder.textTool(false);
			}
		});
		canvas.observe('selection:cleared', function(e) {
			comicBuilder.updateLayers();
			comicBuilder.isTextSelected = false;
			comicBuilder.textTool(false);
		});
		canvas.observe('selection:created', function(e) {
			comicBuilder.updateLayers();
		});
		
		
		jQuery("select.categories").change(function(){
			comicBuilder.loadMemes();
		});
		var keyupTimeout=false;
		jQuery(".searchQuery").keyup(function(){
			if(keyupTimeout)window.clearTimeout(keyupTimeout);
			keyupTimeout=window.setTimeout(function(){comicBuilder.loadMemes();},500);
		});
		var cnvs = this.canvasElement;
		this.container.droppable({
			accept: '.memeImage',
			drop: function(event, ui) {
				var src = ui.draggable.attr("src");
				var oImg;
				var memeTitle=ui.draggable.attr("alt");
				fabric.Image.fromURL(src, function(img) {
					oImg = img.set({title: memeTitle, left: ui.position.left - jQuery(cnvs).offset().left + (img.width / 2), top: ui.position.top - jQuery(cnvs).offset().top + (img.height / 2)})
					canvas.add(oImg);
					canvas.renderAll();
					comicBuilder.updateLayers();
				});
			}
		});
		jQuery("#btnDraw").click(function() {
			canvas.isDrawingMode = !canvas.isDrawingMode;
			jQuery("#btnDraw").toggleClass('active');
			
			if(canvas.isDrawingMode)
				canvas.deactivateAll();
		});
		
		jQuery("#btnText").click(function() {
			if($(this).hasClass('active')){
				comicBuilder.resetTools();
			} else {
				comicBuilder.resetTools();
				$('.textTool').show();
				$(this).addClass('active');
			}
		});
		
		jQuery(".textAdd").click(function() {
			var Text = $('.textString').val();
			var Font = $('.fontValue').val();
			var Size = $('.fontSize').val();
			var textObj = new fabric.Text(Text, {
				fontFamily: Font,
				left: comicBuilder.width / 2,
				top: comicBuilder.height / 2,
				fontSize: Size,
				textAlign: "left",
				fill: "#000000"
			});
			textObj.title = Text;
			canvas.add(textObj);
			canvas.renderAll();
			comicBuilder.updateLayers();
		});
		
		jQuery(".textString").keyup(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.setText($(".textString").val());
				canvas.renderAll();
			}
		});
		
		jQuery(".fontSize").keyup(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.fontSize = $(".fontSize").val();
				canvas.renderAll();
			}
		});
		
		jQuery(".fontValue").change(function(){
			if(comicBuilder.isTextSelected){
				var object = canvas.getActiveObject();
				object.fontFamily = $(".fontValue").val();
				canvas.renderAll();
			}
		});
		
		jQuery("#btnLayers").click(function(){
			if($(this).hasClass('active')){
				comicBuilder.resetTools();
			} else {
				comicBuilder.resetTools();
				$('.layesTable').show();
				$(this).addClass('active');
			}
		});
			
		jQuery("#btnDelete").click(function() {
			comicBuilder.removeSelected();
		});
		jQuery(".upper-canvas").attr("tabindex", "0").mousedown(function(){$(this).focus();return false;}).keydown(function(event){
			//Delete button
			if(event.keyCode == 46)
				comicBuilder.removeSelected();
			//Keyboard Arrows Movement
			else if(event.keyCode <= 40 || event.keyCode >= 37){
				if (canvas.getActiveObject()) obj = canvas.getActiveObject();
				else if (canvas.getActiveGroup()) obj = canvas.getActiveGroup();
				else return;
				if (event.ctrlKey) speed = 1;
				else if (event.shiftKey) speed = 10;
				else speed = 5;
				switch (event.keyCode){
					case 37:
						obj.setLeft(obj.getLeft() - speed);
						break;
					case 38:
						obj.setTop(obj.getTop() - speed);
						break;
					case 39:
						obj.setLeft(obj.getLeft() + speed);
						break;
					case 40:
						obj.setTop(obj.getTop() + speed);
						break;
				}
				canvas.renderAll();
			}
		});
		jQuery("#btnClear").click(function(){comicBuilder.newCanvas()});
		jQuery("#btnPicture").click(function(){
			jQuery("#inputFileHandler").trigger("click")
		});
		jQuery("#inputFileHandler").change(function(e){
			if(e.target.files.length>0){
				reader = new FileReader;
			    reader.onload = function(event) {
			        var img = new Image;
			        img.onload = function() {
			        	fabric.Image.fromURL(img.src, function(img) {
							var width = img.width;
							var height = img.height;
							var maxDimensions = 500;

							if(width > maxDimensions || height > maxDimensions){
								var percentage = maxDimensions / Math.max(width, height);
								width *= percentage;
							}

							oImg = img.set({left: 100 , top:100,title:"Local Image"});
							oImg.scaleToWidth(width);
							canvas.add(oImg);
							canvas.renderAll();
							comicBuilder.updateLayers();
						});
			        };
			        img.src = event.target.result;
			    };
			    reader.readAsDataURL(e.target.files[0]);
		   }
		});
		jQuery(".addImageSubmit").click(function(){
			//validating url
			$('.imageURL').popover('hide');
			var url=jQuery(".imageURL").val();
			var imageURLRegex=/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/i;
			if(imageURLRegex.test(url)){
				jQuery(".imageURL").attr("disabled","disabled");
				var img = new Image;
				jQuery(".loadingExternalImage .loadingGif").show();
				img.onload = function() {
		        	fabric.Image.fromURL(img.src, function(img) {
						var width = img.width;
						var height = img.height;
						var maxDimensions = 500;
						
						if(width > maxDimensions || height > maxDimensions){
							var percentage = maxDimensions / Math.max(width, height);
							width *= percentage;
						}
						
						oImg = img.set({left: 100 , top:100,title:"External Image"});
						oImg.scaleToWidth(width);
						canvas.add(oImg);
						canvas.renderAll();
						comicBuilder.updateLayers();
					});
					jQuery(".imageURL").removeAttr("disabled").val("");
					jQuery("#addImageModal").modal("hide");
					jQuery(".loadingExternalImage .loadingGif").hide();
			    };
			    img.onerror=function(){
					jQuery(".imageURL").removeAttr("disabled");
					$('.imageURL').popover('show');
					jQuery(".loadingExternalImage .loadingGif").hide();
			    }
				img.src=url;
			}
		});
		jQuery(".addImageClose").click(function(){
			$('.imageURL').popover('hide');
		});
		jQuery(".removeLayer").live("click",function(){
			var objectIndex=parseInt(jQuery(this).parents("tr:first").attr("rel"));
			var canvasObjects=canvas.getObjects();
			if(canvasObjects[objectIndex]){
				canvas.remove(canvasObjects[objectIndex]);
				comicBuilder.updateLayers();
			}
		});
		
		
		//This is is still buggy, it might be due to a bug with the library itself
		jQuery(".moveLayerUp").live("click",function(){
			var objectIndex=parseInt(jQuery(".selected").attr("rel"));
			var canvasObjects=canvas.getObjects();
			if(canvasObjects[objectIndex]){
				canvas.bringForward(canvasObjects[objectIndex]);
				comicBuilder.updateLayers();
			}
		});
		
		jQuery(".moveLayerDown").live("click",function(){
			var objectIndex=parseInt(jQuery(".selected").attr("rel"));
			if(objectIndex == 2)
				return;
			var canvasObjects=canvas.getObjects();
			if(canvasObjects[objectIndex]){
				canvas.sendBackwards(canvasObjects[objectIndex]);
				comicBuilder.updateLayers();
			}
		});
		/**
		 * Initializations
		 */
		
		$("[rel=tooltip]").tooltip();
		$('.imageURL').popover({
			animation:true,
			title:"Error",
			content:"Couldn't load image, please check if the link is correct and reachable",
			trigger:'manual'
		});
	},
	/**
	 * clears the canvas
	 * @author Yousif
	 */
	newCanvas:function(){
		canvas.clear();
		
		/** vertical line **/
		var verticalLine = new fabric.Line([ this.width/2, 0, this.width/2, this.height ], {
			fill: 'black',
			strokeWidth: 1,
			selectable: false,
			coreItem:true
		});
		verticalLine.set("coreItem",true);
		verticalLine.set("title","vertical Line");
		canvas.add(verticalLine);
		
		/** adding horizontal lines **/
		for(var i=1;i<=this.rowsNumber-1;i++){
			var horizontalLine = new fabric.Line([ 0, i*this.panelHeight, this.width, i*this.panelHeight ], {
				fill: 'black',
				strokeWidth: 1,
				selectable: false,
				coreItem:true
			});
			canvas.add(horizontalLine);
			horizontalLine.set("coreItem",true);
			horizontalLine.set("title","Horizontal Line "+i);
		}
		canvas.renderAll();
		this.updateLayers();
	},
	/**
	 * loads memes images with ajax
	 */
	loadMemes:function(){
		jQuery(".loadingGif").show();
		if(this.searchXHR)this.searchXHR.abort();
		this.searchXHR=jQuery.ajax({
			'url':this.memesURL,
			'data':{
				'category':jQuery("select.categories").val(),
				'q':jQuery(".searchQuery").val()
			},
			'dataType': 'json',
			'success':function(res){
				jQuery(".memeImage").tooltip('hide');
				jQuery(".memeImage").remove();
				var memeImages = new Array();
				for(var i=0;i<res.length;i++){
					var meme=res[i];
					memeImages[i] = new Image();
					memeImages[i].title = meme.title;
					memeImages[i].alt = meme.title;
					memeImages[i].totalI = res.length;
					memeImages[i].i = i;
					memeImages[i].onload = function(){
						jQuery(this).addClass('memeImage')
						.attr('data-width', this.width)
						.attr('data-height', this.height)
						.appendTo(jQuery(".memeList"));
						
						jQuery(this).tooltip({placement:'left'})
						.draggable({helper: 'clone',
							start: function(e, ui){
								$(ui.helper).css({width: jQuery(this).attr('data-width'), height: jQuery(this).attr('data-height')});
							}
						});
						
						if(this.i == (this.totalI - 1))
							jQuery(".loadingGif").fadeOut();
					};
					memeImages[i].src = meme.path;
				}
			},
			'error':function(err,msg){
				console.log("ERROR:"+err,msg)
			}
		});
	},
	/**
	 * updates layers panel 
	 */
	updateLayers:function(){
		var canvasObjects=canvas.getObjects();
		jQuery(".layesTable tbody").html("");
		if(canvasObjects.length>0){
			for(var i=canvasObjects.length - 1;i >= 0;i--){
				var object=canvasObjects[i];
				var title = object.get("title");
				if(title.length > 18){
					title = title.substring(0, 18) + '...';
				}
				jQuery("<tr rel='"+i+"' class='"+(object.isActive()?"selected":"")+"'><td>"+title+"</td><td><button class='tinyButtons btn btn-danger removeLayer' ><i class='icon-remove'></i></button></td></tr>").appendTo(jQuery(".layesTable tbody"));
			}
		}else{
			jQuery(".layesTable tbody").html("<tr><td colspan='2'>No layers added</td></tr>");
		}
	},
	/**
	 * removes selected objects from canvas 
	 */
	removeSelected:function(){
		if(canvas.getActiveObject())
			canvas.remove(canvas.getActiveObject());

		if (canvas.getActiveGroup()) {
			canvas.getActiveGroup().forEachObject(function(o) {
				canvas.remove(o);
			});
		}

		canvas.deactivateAll();
		canvas.renderAll();
		this.updateLayers();
	},
	/**
	 * Deactivates any tools
	 */
	resetTools:function(){
		$('.toolContainer').hide();
		$('.toolButton').removeClass('active');
	},
	/**
	 * Deactivates any tools
	 */
	textTool:function(edit){
		if(edit){
			var object = canvas.getActiveObject();
			$('.textString').val(object.getText());
			$('.fontValue').val(object.fontFamily);
			$('.fontSize').val(object.fontSize);
			$('.textAdd').attr("disabled", true);
		} else {
			$('.textString').val('');
			$('.fontValue').val('Impact');
			$('.fontSize').val(25);
			$('.textAdd').attr("disabled", false);
		}
	}
};
jQuery(document).ready(function(){comicBuilder.init();});
