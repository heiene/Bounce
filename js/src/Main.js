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
    b2Joints: Box2D.Dynamics.Joints,
    b2ContactListener: Box2D.Dynamics.b2ContactListener
};


var manifest = [
	{id:"birdImg",src: "assets/pics/bird/bird_small.png"}
]


/*

	Defining the global variables

*/
var SCALE = 30;
var world, game, stage, clouds, debug, cloudIMG, contentManager;
function preInit(){
			world = game = debug = contentManager = stage = null;

			stage = new createjs.Stage(document.getElementById("bouncer"));
			
			contentManager = new ContentManager(stage);
			contentManager.setDownloadCompleted(init);
			contentManager.startDownload(manifest)



	
}

function init() {

	game = {
		score: [0,0],
		cloudX1: 0,
		cloudX2: 800,
		pauseSky: false,
		tickCounter: 0
	};
	
	debug = document.getElementById("debug");
	console.log("Stage: ",stage)
	console.log("debug: ",debug)
	setupPhysics();
	clouds = new createjs.Stage(document.getElementById("bg_clouds"))
	cloudIMG1 = new createjs.Bitmap("assets/pics/background/Set_of_soft_clouds.png")
	cloudIMG2 = new createjs.Bitmap("assets/pics/background/Set_of_soft_clouds.png")
	clouds.addChild(cloudIMG1);
	clouds.addChild(cloudIMG2);

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
		stage.addChild(b.view)
		
	};
	
	

 };

function setupPhysics(){

	
/*

	setting up the box2d world
	
*/

	world 		= new b.b2World(new b.b2Vec2(0,20), true);
	// world.contactBodies = [];	
	var listener = new b.b2ContactListener();


	listener.BeginContact = function(contact) {
		
		var a = contact.GetFixtureA().GetBody();
		var b = contact.GetFixtureB().GetBody();
		var temp = {};

		if (a.GetUserData() === "Ball" || b.GetUserData() === "Ball") {
			temp[a.GetUserData()] = a;
			temp[b.GetUserData()] = b;
			game.contactBodies = temp;
			console.log(game.contactBodies, "inne i listener")
		}
		


	}

	world.SetContactListener(listener);
	
	
/*

	Adding the static elements to the world
	
*/
	game.wallLeft 	= new StaticElement("wallLeft");
	game.wallRight 	= new StaticElement("wallRight");
	game.groundLeft 	= new StaticElement("groundLeft");
	stage.addChild(game.groundLeft.view)
	game.groundRight 	= new StaticElement("groundRight");
	stage.addChild(game.groundRight.view)
	game.roof 		= new StaticElement("roof")
	game.net			= new StaticElement("net")
	stage.addChild(game.net.view)


	console.log("Static elements: ",world);
/*	

	Adding Players to the world, making a joint

*/

	game.player1 = new Player(game.groundLeft.view.body, "left");
	game.player1.linkPlayer();
	game.player2 = new Player(game.groundRight.view.body, "right");
	game.player2.linkPlayer();

	stage.addChild(game.player1.view);
	stage.addChild(game.player2.view);

	console.log(contentManager.assets.birdImg.src)

	game.bird = new Bird(contentManager.assets.birdImg);
	stage.addChild(game.bird)
	// game.bird.alive = false;
	if (!game.bird.alive) {
		setTimeout(spawnBird, 3000)	
	}
	

/*

	Adding a ball to the world

*/

	game.ball = new Ball();
	console.log("worldlist: ", game.ball.view.body.GetPosition().x)
	stage.addChild(game.ball.view)

/*

	Setting up the debugDraw - for debugging

*/
	var debugDraw = new b.b2DebugDraw();
	debugDraw.SetSprite(debug.getContext("2d"));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFlags(b.b2DebugDraw.e_shapeBit | b.b2DebugDraw.e_jointBit | b.b2DebugDraw.e_centerOfMassBit)
	debugDraw.SetFillAlpha(0.5)
	world.SetDebugDraw(debugDraw);

	// window.setInterval(tick,1000/60)
	document.onkeydown = function(e) {
		
		// switch(e.keyCode) {
		// 	case 37:

		// }
		console.log(e.keyCode)

		if (e.keyCode == 37) {
			game.player2.view.moveLeft = true
		} else if  (e.keyCode == 39) {
			game.player2.view.moveRight = true
		}
		if (e.keyCode == 65) {
			game.player1.view.moveLeft = true
		} else if  (e.keyCode == 68) {
			game.player1.view.moveRight = true
		}

		if (e.keyCode == 32) {
			pauseToggle();
		} 
		if (e.keyCode == 27) {
			init();
		}   

		
	};

	document.onkeyup = function(e) {
		if (e.keyCode == 37) {
			game.player2.view.moveLeft = false
		} else if  (e.keyCode == 39) {
			game.player2.view.moveRight = false	
		}

		if (e.keyCode == 65) {
			game.player1.view.moveLeft = false
		} else if  (e.keyCode == 68) {
			// checkContact();
			game.player1.view.moveRight = false	
		} 

		
	};

};

function tick() {

if(game.bird.alive) {
	game.bird.tick();
	console.log("Bird alive!!!!!!!!!!!!!!!!")	
} 



game.tickCounter +=1; 

	if(game.contactBodies) {
		console.log('before check contact', game.contactBodies)
		checkContact();	
		game.contactBodies = null;
		console.log('after check contact',game.contactBodies)

			
	}

	stage.update();
	if (!game.pauseSky) {
		clouds.update();
		moveClouds();
	}
	// world.DrawDebugData();
	world.Step(1/60,20,20);
	world.ClearForces();
	
if (game.tickCounter == 60) {
	console.log("GAMETICKKKER: ",game.tickCounter);
	game.tickCounter = 0;
}

};

function checkContact() {
	console.log(' Begin checking contact', game.contactBodies);

	for (prop in game.contactBodies) {
		if (prop === "groundRight")  {
			console.log("Point to LeftPlayer")
			game.score[0] += 1;
			reset();
			
		}
		if (prop === "groundLeft")  {
			console.log("Point to RightPlayer")
			game.score[1] += 1;
			reset();
			
		}
	

	}

	console.log('checking contact finished');


}

function pauseToggle() {
	var status = createjs.Ticker.getPaused()
	if (status) {
		createjs.Ticker.setPaused(false);
	} else {
		createjs.Ticker.setPaused(true);
		console.log("paused, score is: ", game.score[0], game.score[1]);	
	}
	
}

function reset(){
	game.player1.reset();
	game.player2.reset();
	game.ball.reset();
	console.log(game.score);
	var score = document.getElementById('gameScore');
	score.firstChild.nodeValue='Game Score is: ' + game.score[0] + " - " +game.score[1];

	if (game.score[0] >=7 || game.score[1] >= 7) {
		score.firstChild.nodeValue='Game is over: ' + game.score[0] + " - " +game.score[1];
		init();
	}
	// console.log("The game score div",score)
	pauseToggle();
}

function moveClouds() {
	game.cloudX1 -= 1;
	game.cloudX2 -= 1;

	if (game.cloudX1 <= -800) {
		game.cloudX1 = 800;
	};

	if (game.cloudX2 <= -800) {
		game.cloudX2 = 800;
	};

	drawClouds();
};

function drawClouds() {
	cloudIMG1.x = game.cloudX1;
	cloudIMG1.y = 0;

	cloudIMG2.x = game.cloudX2;
	cloudIMG2.y = 0;
};

function pauseSky() {
	game.pauseSky = !game.pauseSky;
}

function spawnBird() {
	game.bird = new Bird(birdImg);
	stage.addChild(game.bird)
	clearTimeout()

}




