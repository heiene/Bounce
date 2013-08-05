/*

	Setting up namespace for box2d

*/
var b = {
	b2Vec2: Box2D.Common.Math.b2Vec2,
   	b2BodyDef: Box2D.Dynamics.b2BodyDef,
    b2Body: Box2D.Dynamics.b2Body,
    b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
    b2Fixture: Box2D.Dynamics.b2Fixture,
    b2World: Box2D.Dynamics.b2World,
    b2MassData: Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
    b2Joints: Box2D.Dynamics.Joints
};

/*

	Defining the global variables

*/
var SCALE = 30;
var world, stage, debug;


function init() {

	stage = new createjs.Stage(document.getElementById("bouncer"));
	debug = document.getElementById("debug");
	console.log("STage: ",stage)
	console.log("debug: ",debug)
	setupPhysics();



/*

	Setting up the Ticker, listenening for the tick() function
	
*/
	createjs.Ticker.addListener(this)
	createjs.Ticker.setFPS(60);
	createjs.Ticker.useRAF = true;

	debug.onmousedown = function () {
		
		var x =	window.event.clientX;
		var y =	window.event.clientY
		console.log("X: ", x, " Y: ", y)
		var b = new Ball(x,y);
		// stage.addChild(b.view)
		
	};


	
	
	

 };

function setupPhysics(){
 	var staticElements = [];
	
/*

	setting up the box2d world
	
*/

	world 		= new b.b2World(new b.b2Vec2(0,10), true);
	
	
/*

	Adding the static elements to the world
	
*/
	staticElements.wallLeft 	= new StaticElement("wallLeft");
	staticElements.wallRight 	= new StaticElement("wallRight");
	staticElements.groundLeft 	= new StaticElement("groundLeft");
	staticElements.groundRight 	= new StaticElement("groundRight");
	staticElements.roof 		= new StaticElement("roof")
	staticElements.net			= new StaticElement("net")

		var fixDef 		= new b.b2FixtureDef();
		var bodyDef 	= new b.b2BodyDef();
		var boxWidth 	= 300 / SCALE;
		var boxHeight 	= 5 / SCALE;
		var posX		= 400 / SCALE;
		var posY 		= 200 / SCALE;
		fixDef.restitution 	= 0.5;
		fixDef.density		= 2;
		fixDef.friction		= 0.5;
		bodyDef.type		= b.b2Body.b2_staticBody;
		fixDef.shape		= new b.b2PolygonShape();
		// console.log("Createda: ", type, "posX: ", posX * SCALE, "posY: ", posY * SCALE, "BoxWidt: ", boxWidth*SCALE, "Boxheigth: ", boxHeight*SCALE)
		// console.log("Bitmap: ", this.view.x, this.view.y)
		bodyDef.position.x 	= posX
		bodyDef.position.y 	= posY;
		
		fixDef.shape.SetAsBox(boxWidth,boxHeight);
		
		var bodyTest = world.CreateBody(bodyDef);
		bodyTest.CreateFixture(fixDef);

		var playerTest = new Ball(400,70);
		var playerBody = playerTest.view.body;

		var joint = new b.b2Joints.b2PrismaticJointDef();

		joint.enableMotor = true;
		joint.motorSpeed = 50
		joint.localAnchorA	= new b.b2Vec2(0,0.3)
		joint.localAnchorB 	= new b.b2Vec2(0,0)

		joint.bodyA = bodyTest;
		joint.bodyB = playerBody;
  
		world.CreateJoint(joint);
	document.onkeydown = function(e) {
		if (e.keyCode == 37) {
			playerBody.SetLinearVelocity(new b.b2Vec2(-10,0))
			console.log("er her",e.keyCode)
		} else if  (e.keyCode == 39) {
			playerBody.ApplyImpulse(new b.b2Vec2(10,0))
		} 

		
	};


/*

	Adding Players to the world, making a joint

*/

/*

	Adding a ball to the world

*/

	// var ball = new Ball();
	// console.log("worldlist: ", ball.view.body.GetPosition().x)

/*

	Setting up the debugDraw - for debugging

*/
	var debugDraw = new b.b2DebugDraw();
	debugDraw.SetSprite(debug.getContext("2d"));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFlags(b.b2DebugDraw.e_shapeBit | b.b2DebugDraw.e_jointBit | b.b2DebugDraw.e_centerOfMassBit)
	debugDraw.SetFillAlpha(0.5)
	world.SetDebugDraw(debugDraw);

	window.setInterval(tick,1000/60)

};

function tick() {

	stage.update();
	world.DrawDebugData();
	world.Step(1/60,10,10);
	world.ClearForces();

	

};

