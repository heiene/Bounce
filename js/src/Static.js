(function(window) {

	function StaticElement(type){
				
		var fixDef 	= new b.b2FixtureDef();
		var bodyDef	= new b.b2BodyDef();
		var height	= stage.canvas.height;
		var width	= stage.canvas.width;
		var groundHeight = 30;
		var posX, posY, boxWidth, boxHeight,url, regX, regY;

		

		switch(type) {
			case "wallLeft":{
				posX 		= 0;
				posY 		= (height -groundHeight)/ 2 / SCALE;
				boxWidth 	= 10 / SCALE;
				boxHeight 	= (height -groundHeight)/ 2 / SCALE;
				url			= "assets/pics/grass.png"
				break;
			};
			case "wallRight":{
				posX 		= width / SCALE;
				posY 		= (height -groundHeight)/ 2 / SCALE;
				boxWidth 	= 10 / SCALE;
				boxHeight 	= (height - groundHeight) / 2/ SCALE;
				url			= "assets/pics/grass_small.gif"
				break;
			};
			case "roof":{
				posX 		= width / 2 / SCALE;
				posY 		= 0;
				boxWidth 	= width / SCALE;
				boxHeight 	= 10 / SCALE;
				url			= "assets/pics/grass_small.gif"
				break;
			};
			case "groundLeft":{
				posX 		= width / 4 / SCALE;
				posY 		= height / SCALE;
				boxWidth 	= width / 4 / SCALE;
				boxHeight 	= groundHeight / SCALE;
				regX		= 200
				regY		= 30
				url			= "assets/pics/super_mario_ground.png"
				break;
			};
			case "groundRight":{
				posX 		= width / 4 * 3 / SCALE;
				posY 		= height / SCALE;
				boxWidth 	= width / 4 / SCALE;
				boxHeight 	= groundHeight / SCALE;
				regX		= 200
				regY		= 30
				url			= "assets/pics/super_mario_ground.png"
				break;
			};
			case "net":{
				var netHeight 	= 100;
				posX 		= width / 2 / SCALE;
				posY 		= (height - netHeight/2 -groundHeight) / SCALE;
				boxWidth 	= 1 / SCALE;
				boxHeight 	= (netHeight/2) / SCALE;
				regX		= 2
				regY		= (netHeight)/2
				url			= "assets/pics/super_mario_pole_noflag_height80.png"
				break;
			};
			default:
				console.log("ERRRROR");
		}

		this.view = new createjs.Bitmap(url)
		this.view.x 	= posX  * SCALE;
		this.view.y 	= posY * SCALE;
		this.view.regX 	= regX;
		this.view.regY	= regY;

		fixDef.restitution 	= 0.8;
		fixDef.density		= 2;
		fixDef.friction		= 0.3;
		bodyDef.type		= b.b2Body.b2_staticBody;
		fixDef.shape		= new b.b2PolygonShape();
		// console.log("Createda: ", type, "posX: ", posX * SCALE, "posY: ", posY * SCALE, "BoxWidt: ", boxWidth*SCALE, "Boxheigth: ", boxHeight*SCALE)
		// console.log("Bitmap: ", this.view.x, this.view.y)
		bodyDef.position.x 	= posX
		bodyDef.position.y 	= posY;
		bodyDef.userData	= type;
		
		fixDef.shape.SetAsBox(boxWidth,boxHeight);
		
		this.view.body = world.CreateBody(bodyDef);
		this.view.body.CreateFixture(fixDef);
		// this.view.onTick = tick;

	}

	/*function tick(e) {
		this.x 	=	this.body.GetPosition().x * SCALE;
		this.y 	=	this.body.GetPosition().y * SCALE;
		console.log(this.y)

	}*/


	window.StaticElement = StaticElement;
})(window);