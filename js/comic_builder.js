/**
 * @desc main object for comic builder component
 * @package comicBuilder
 * @author
 * 		Amr Abosree
 * 		Mustafa A. Abdel-Tawwab Jr.
 * 		Youssef Gaber
 * @since 2012-05-14 
 */
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
				console.log(ui.draggable);
				var src = ui.draggable.attr("src");
				var oImg;
				fabric.Image.fromURL(src, function(img) {
					oImg = img.set({ left: ui.position.left - jQuery(cnvs).offset().left + (img.width / 2), top: ui.position.top - jQuery(cnvs).offset().top + (img.height / 2) })
					canvas.add(oImg);
					canvas.renderAll();
				});
			}
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
			selectable: false
		});
		canvas.add(verticalLine);
		
		/** adding horizontal lines **/
		for(var i=1;i<=this.rowsNumber-1;i++){
			var horizontalLine = new fabric.Line([ 0, i*this.panelHeight, this.width, i*this.panelHeight ], {
				fill: 'black',
				strokeWidth: 1,
				selectable: false
			});
			canvas.add(horizontalLine);
		}
		canvas.renderAll();
	},
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
				jQuery(".memeImage").remove();
				var memeImages = new Array();
				for(var i=0;i<res.length;i++){
					var meme=res[i];
					memeImages[i] = new Image();
					memeImages[i].totalI = res.length;
					memeImages[i].i = i;
					memeImages[i].onload = function(){
						jQuery(this).addClass('memeImage')
						.attr('title', meme.title)
						.attr('alt', meme.title)
						.attr('data-width', this.width)
						.attr('data-height', this.height)
						.appendTo(jQuery(".memeList"));
						
						if(this.i == (this.totalI - 1))
						{
							jQuery(".memeImage").tooltip({ placement:'left' })
							.draggable({ helper: 'clone',
								start: function(e, ui){
									$(ui.helper).css({ width: jQuery(this).attr('data-width'), height: jQuery(this).attr('data-width') });
								}
							});
							jQuery(".loadingGif").fadeOut();
						}
					};
					memeImages[i].src = meme.path;
				}
			},
			'error':function(err,msg){
				console.log("ERROR:"+err,msg)
			}
		});
	}
};
jQuery(document).ready(function(){comicBuilder.init();});
