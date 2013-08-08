(function(window) {
	
	function Bird(img) {
		this.initialize(img);

	};

	var bp = Bird.prototype = new createjs.BitmapAnimation();

	bp.BitmapAnimation_initialize = bp.initialize;

	bp.initialize = function(img) {
		
		var localSpriteSheet = new createjs.SpriteSheet({
            images: [img], //image to use
            frames: {
            	width: 90, 
            	height: 61.5, 
            	count:6, 
            	regX: 45, 
            	regY: 31},
            animations: {
            	 // start, end, next, frequency
                rightFly: [0, 2, "rightFly", 4],
                leftFly: [3, 5, "leftFly", 4]
            }
        });

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.gotoAndPlay("leftFly");

        this.name = "bird1";
		// this.direction = 90;
		this.vX = 2;
		this.alive = true;
		// this.x = 16;
		// this.y = 32;
		this.setupPhysics();
		console.log("Inside bird init function, image is: ", img)

	};

	bp.setupPhysics = function () {
		var fixDef 	= new b.b2FixtureDef();
		var bodyDef	= new b.b2BodyDef();
		var height	= stage.canvas.height;
		var width	= stage.canvas.width;
		var groundHeight = 30;
		var posX, posY, boxWidth, boxHeight,url, regX, regY;

		var dir = Math.floor(Math.random()*2)
		
		fixDef.restitution 	= 0.8;
		fixDef.density		= 10;
		fixDef.friction		= 0.3;
		bodyDef.type		= b.b2Body.b2_kineticBody;
		fixDef.shape		= new b.b2PolygonShape();

		
		posY 				= height/ 2 / SCALE;
		boxWidth 			= 45 / SCALE;
		boxHeight		 	= 2 / SCALE;
		regX				= 45
		regY				= 31


		if (dir == 0) {
			posX = width/ SCALE;
			this.prevX = posX * SCALE + 1
			
		} else {
			posX = 0;
			this.prevX = posX * SCALE - 1
		}

		bodyDef.position.x 	= posX
		bodyDef.position.y 	= posY;
		bodyDef.userData	= this.name;
		
		fixDef.shape.SetAsBox(boxWidth,boxHeight);
		
		this.physicsBody = world.CreateBody(bodyDef);
		this.physicsBody.CreateFixture(fixDef);


		if (dir == 0) {
			this.physicsBody.startDirection = "left";
			console.log("Bird going:", this.physicsBody.startDirection)
		} else {
			this.physicsBody.startDirection = "right";
			this.gotoAndPlay("rightFly");

			console.log("Bird going:", this.physicsBody.startDirection)
		}

		

	}

	

	bp.tick = function(event) {
		this.x = this.physicsBody.GetPosition().x * SCALE;
		this.y = this.physicsBody.GetPosition().y * SCALE;
		this.rotation = this.physicsBody.GetAngle() * (180/Math.PI);

		if (this.x < -1 || this.x > stage.canvas.width) {
			this.kill();
		} else if (this.x <= this.prevX) {
			
			// this.gotoAndPlay("leftFly");
			this.physicsBody.SetPosition(new b.b2Vec2((this.x - this.vX) / SCALE, this.y / SCALE));
		
		} else if (this.x >= this.prevX) {
			// this.gotoAndPlay("rightFly");
			this.physicsBody.SetPosition(new b.b2Vec2((this.x + this.vX) / SCALE, this.y / SCALE));	
		

		}
		console.log("ThisX: ",this.x,"This PREV X: ", this.prevX)

		this.prevX = this.x
		this.prevY = this.y


/*
		  // Hit testing the screen width, otherwise our sprite would disappear
    if (bmpAnimation.x >= screen_width - 16) {
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bmpAnimation.direction = -90;
    }

    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bmpAnimation.direction = 90;
    }

    // Moving the sprite based on the direction & the speed
    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
    }*/


	};

	bp.kill = function(){
		world.DestroyBody(this.physicsBody)
		stage.removeChild(this)
		this.alive = false;
	}

	window.Bird = Bird;

})(window)