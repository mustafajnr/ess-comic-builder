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
	memesURL:'json/memes.json',
	canvasElementId:"canvasElement",
	el:null,
	width:false,
	height:false,
	panelHeight:230,
	rowsNumber:2,
	stage:null,
	/**
	 * init function for assigning events and setting up structure
	 */
	init:function(){
		this.el=jQuery("#"+this.canvasElementId);
		this.width=this.el.width();
		this.height=this.el.height();
		this.stage = new Kinetic.Stage({
			container: this.canvasElementId,
			width: this.width,
			height: this.height
		});
		this.clear();
	},
	/**
	 * clears the canvas
	 * @author Yousif
	 */
	clear:function(){
		this.stage.removeChildren();
		this.stage.clear();
		var layer = new Kinetic.Layer();
		
		/** background **/
		var Background = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: 500,
			height: 500,
			fill: "#FFFFFF",
		});
		layer.add(Background);
		
		/** vertical line **/
		
		var verticalLine=new Kinetic.Line({
			points: [
				{ x: this.width/2, y: 0 },
				{ x: this.width/2, y: this.height }
			],
			stroke: "#000",
			strokeWidth: 1,
			lineCap: 'square'
		});
		layer.add(verticalLine);
		
		/** adding horizontal lines **/
		for(var i=1;i<=this.rowsNumber;i++){
			var verticalLine=new Kinetic.Line({
				points: [
					{ x: 0, y: i*this.panelHeight },
					{ x: this.width, y: i*this.panelHeight }
				],
				stroke: "#000",
				strokeWidth: 1,
				lineCap: 'square'
			});
			layer.add(verticalLine);
		}
		Background.moveToBottom();
		this.stage.add(layer);
	}
	
	
};
jQuery(document).ready(function(){comicBuilder.init();});
