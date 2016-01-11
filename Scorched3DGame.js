var gameObjects = new Array();
var mouse = new Point(0, 0);
var inputHandler = new InputHandler();
var timeElapsed = 0;
var frameNumber = 0;
var camera;


var PI_CONV = 0.05817764173314431923078969228295;
var PI = 3.1415926535897932384626433832795;
var MAX_FPS = 300;
var FRAME_TIME = Math.floor(1000/MAX_FPS);

function Scorched3DGame(container, width, height)
{
	var truavg;
	var avgCount;
	var frameTime;
	this.width = width;
	this.height = height;
	var start;
	

	this.webGLStart = function() 
	{
        var gameCanvas = document.createElement('canvas');
        addListeners(gameCanvas);
        gameCanvas.width = width || 1200;
		gameCanvas.height = height || 700;
		mouse = new Point(width/2,height/2);

        initGL(gameCanvas);
        initGLSettings();
        initShaders();

        container.appendChild(gameCanvas);

        initGame();
    }

    var addListeners = function(gameCanvas)
    {
    	gameCanvas.addEventListener('mousemove', getMouse, false);
		document.addEventListener('keydown', inputHandler.keyPress, false);
		document.addEventListener('keyup', inputHandler.keyRelease, false);
    }

    var initGame = function()
    {
    	terrain = new Terrain(500,500,2,2,256,256);
    	terrain.setPosition(0,0,0);

    	tank = new Tank(terrain);
    	tank.setPosition(0,0,0);

    	camera = new Camera();
    	//DEFAULT CAMERA SETTINGS
    	camera.rotate("X", Math.PI);
    	camera.rotate("Y", Math.PI);

    	camera.zero();
    	camera.xRot = Math.PI/2;
    	//
    	

    	proj = new ProjectileFactory();

    	
    	applyControls();
    	applyFirstPersonRestrictions();


    	//terrain2 = new Terrain(100,100,10,10);
    	//terrain2.setPosition(0,100,0);

		frameTime = new Date().getTime();
		frameCount = 0;
		framePeriod = frameTime;
		start = new Date().getTime();
		gameLoop();


    }

	var gameLoop = function()
	{
		var current = new Date().getTime();
		timeElapsed = (current-start)/1000;
		start = current;

		clearCanvas();

		inputHandler.update();

  		mouseInput();
		// camera.x = tank.position.x;
    //  	camera.z = tank.position.z;
    //  	camera.y = tank.position.y + 10;
		updateAndDraw();

		frameCount++;
		frameNumber++;

		frameTime = (new Date().getTime() - start);
  		gLoop = setTimeout(gameLoop, FRAME_TIME - frameTime);  
	}

	var updateAndDraw = function()
	{
		for(var i=0; i<gameObjects.length; i++)
		{
			gameObjects[i].update();
		}

		for(var i=0; i<gameObjects.length; i++)
		{
			gameObjects[i].draw();
		}
	}

	var mouseInput = function()
	{
		if(Math.abs(mouse.x - width/2) >= 300)
		{
			camera.rotate("Y", 0.005 * (Math.abs(mouse.x - width/2)/(mouse.x - width/2)));
		}

		if(Math.abs(mouse.y - height/2) >= 150)
		{
			camera.rotate("X", 0.005 * (Math.abs(mouse.y - height/2)/(mouse.y - height/2)));
		}
	}

	function getMouse(e) 
	{

		mouse.x = e.offsetX;
		mouse.y = this.height - e.offsetY;
	}

	var toggleDebug = function()
	{
		for(var k = 0; k<gameObjects.length; k++)
		{
			gameObjects[k].setDebug(!gameObjects[k].debug);
		}
	}

	var applyFirstPersonRestrictions = function()
	{
		camera.addRestriction(	function()
								{
									var val = camera.getRotation("X");

									if(val > Math.PI/2 * 3)
									{
										camera.rotate("X", Math.PI*2 - val);
									}
									else if(val > Math.PI)
									{
										camera.rotate("X", Math.PI - val);
									}

								});
	}

	var applyControls = function()
	{
		var speed = 0.5;
		inputHandler.setControl('W'.charCodeAt(0), 	function()
													{
														var angle = camera.getRotation("Y");
														camera.x +=speed * Math.sin(angle);
														camera.z +=speed * Math.cos(angle);
														angle = camera.getRotation("X");
														camera.y +=speed * -Math.cos(angle);
													});

		inputHandler.setControl('A'.charCodeAt(0), function()
													{
														var angle = camera.getRotation("Y");
														camera.x +=speed * Math.sin(angle - Math.PI/2);
														camera.z +=speed * Math.cos(angle - Math.PI/2);
													});

		inputHandler.setControl('S'.charCodeAt(0), function()
													{
														var angle = camera.getRotation("Y");
														camera.x -=speed * Math.sin(angle);
														camera.z -=speed * Math.cos(angle);
														angle = camera.getRotation("X");
														camera.y +=speed * Math.cos(angle);
													});

		inputHandler.setControl('D'.charCodeAt(0), function()
													{
														var angle = camera.getRotation("Y");
														camera.x +=speed * Math.sin(angle + Math.PI/2);
														camera.z +=speed * Math.cos(angle + Math.PI/2);
													});

		inputHandler.setControl(32, function(){tank.fire();});

		inputHandler.setControl('E'.charCodeAt(0), 	function()
													{
														var current = new Date().getTime();
														console.log(frameCount +" "+framePeriod);
														console.log(frameCount / ((current - framePeriod) / 1000)+" "+gameObjects.length);
														frameCount = 0;
														framePeriod = current;
													});
	}
};

