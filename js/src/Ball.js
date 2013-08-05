(function(window) {

	function Ball(xStart,yStart){
		this.view = new createjs.Bitmap("assets/pics/tennis_small.png")

		var fixDef 		= new b.b2FixtureDef();
		var bodyDef		= new b.b2BodyDef();
		var height		= stage.canvas.height;
		var width		= stage.canvas.width;
		var ballRadius	= 20;
		var x 			= xStart / SCALE;
		var y 	 		= yStart / SCALE;

		this.view.regX = this.view.regY = ballRadius;

		

		if(!x) {
			x = (Math.random()*(width-50)+50)/SCALE;
		}

		if(!y) {
			y = height / 4 / SCALE;
		}

		fixDef.restitution 	= 0.7;
		fixDef.density		= 2;
		fixDef.friction		= 0.8;
		fixDef.shape		= new b.b2CircleShape( ballRadius / SCALE );
		
		bodyDef.type		= b.b2Body.b2_dynamicBody;
		bodyDef.position.x 	= x;
		bodyDef.position.y 	= y;
		bodyDef.userData	= "Ball"

		this.view.body 		= world.CreateBody(bodyDef);
		this.view.body.CreateFixture(fixDef);
		this.view.onTick	= tick;

	}

	function tick(e) {

		this.x = this.body.GetPosition().x * SCALE;
		this.y = this.body.GetPosition().y * SCALE;
		this.rotation = this.body.GetAngle() * (180/Math.PI)
	}

	Ball.prototype.reset = function (){
		var height		= stage.canvas.height;
		var width		= stage.canvas.width;
		var x = (Math.random()*(width-50)+50)/SCALE;
		var y = height / 4 / SCALE;
		

		this.view.body.SetLinearVelocity(new b.b2Vec2(0,0))
		this.view.body.SetAngularVelocity(0)
		this.view.body.SetPosition( new b.b2Vec2(x,y))

	}


	window.Ball = Ball;
})(window);