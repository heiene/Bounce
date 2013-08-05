(function(window) {

	function Player(linkBody,position){
		this.view = new createjs.Bitmap("assets/pics/player1.png")

		this.view.linkBody = linkBody;
		this.view.startingPos = position

		var fixDef 			= new b.b2FixtureDef();
		var bodyDef			= new b.b2BodyDef();
		var height			= stage.canvas.height;
		var width			= stage.canvas.width;
		var playerRadius	= 70;
		var offset 			= 200;
		var x, y;

		this.view.regX = this.view.regY = playerRadius;
		y = height / SCALE;
		

		if(position == "left") {
			x = offset/SCALE;
		};

		if (position == "right") {
			x = (width-offset) / SCALE;
		};

		fixDef.restitution 	= 0.5;
		fixDef.density		= 10;
		fixDef.friction		= 0.5;
		fixDef.shape		= new b.b2CircleShape( playerRadius / SCALE );
		
		bodyDef.type		= b.b2Body.b2_dynamicBody;
		bodyDef.position.x 	= x;
		bodyDef.position.y 	= y;
		bodyDef.allowSleep	= false;
		bodyDef.userData	= "Player_"+position;
		this.view.body 		= world.CreateBody(bodyDef);
		this.view.body.CreateFixture(fixDef);
		this.view.onTick	= tick;
		this.view.moveLeft	= false;
		this.view.moveRight	= false;
		this.view.startX	= x;
		this.view.startx	= y;




	}

	function tick(e) {

		this.x = this.body.GetPosition().x * SCALE;
		this.y = this.body.GetPosition().y * SCALE;
		this.rotation = this.body.GetAngle() * (180/Math.PI)
		this.body.SetLinearVelocity(new b.b2Vec2(0,0))

		if(this.moveLeft) {
			this.body.SetLinearVelocity(new b.b2Vec2(-13,0))
		}
		if(this.moveRight) {
			this.body.SetLinearVelocity(new b.b2Vec2(13,0))
		}
	}

	Player.prototype.linkPlayer = function() {
		var joint = new b.b2Joints.b2PrismaticJointDef();

		joint.enableMotor = true;
		joint.motorSpeed = 50
		joint.localAnchorA	= new b.b2Vec2(0,0.3)
		joint.localAnchorB 	= new b.b2Vec2(0,0)

		joint.bodyA = this.view.linkBody;
		joint.bodyB = this.view.body;
  
		world.CreateJoint(joint);
		console.log(this.view.linkBody, this.view.startingPos);
	}

	Player.prototype.reset = function() {
		console.log("Reset player", this.view.startX)

		this.view.body.SetPosition(new b.b2Vec2(this.view.startX, this.view.startY));
		// this.view.moveLeft	= false;
		// this.view.moveRight	= false;
		// this.view.body.SetPosition().y = 
	}


	window.Player = Player;
})(window);