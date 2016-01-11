Projectile.prototype = new GameObject();
function Projectile(p)
{
	if(p)
		this.position = p;

	this.index = gameObjects.length;
	gameObjects.push(this);


	this.vertices= [-0.2, -0.2,  0.2,
                0.2, -0.2,  0.2,
                0.2,  0.2,  0.2,
               -0.2,  0.2,  0.2,
 
               -0.2, -0.2, -0.2,
               -0.2,  0.2, -0.2,
                0.2,  0.2, -0.2,
                0.2, -0.2, -0.2,
 
               -0.2,  0.2, -0.2,
               -0.2,  0.2,  0.2,
                0.2,  0.2,  0.2,
                0.2,  0.2, -0.2,
 
               -0.2, -0.2, -0.2,
                0.2, -0.2, -0.2,
                0.2, -0.2,  0.2,
               -0.2, -0.2,  0.2,
 
                0.2, -0.2, -0.2,
                0.2,  0.2, -0.2,
                0.2,  0.2,  0.2,
                0.2, -0.2,  0.2,
 
               -0.2, -0.2, -0.2,
               -0.2, -0.2,  0.2,
               -0.2,  0.2,  0.2,
               -0.2,  0.2, -0.2];



	this.indices= [0, 1, 2, 0, 2, 3,
              4, 5, 6, 4, 6, 7,
              8, 9, 10, 8, 10, 11,
              12, 13, 14, 12, 14, 15,
              16, 17, 18, 16, 18, 19,
              20, 21, 22, 20, 22, 23];

	this.normals = [	0,0,1,
	0,0,1,
	0,0,1,
	0,0,1,
	0,0,-1,
	0,0,-1,
	0,0,-1,
	0,0,-1,
	0,1,0,
	0,1,0,
	0,1,0,
	0,1,0,
	0,-1,0,
	0,-1,0,
	0,-1,0,
	0,-1,0,
	1,0,0,
	1,0,0,
	1,0,0,
	1,0,0,
	-1,0,0,
	-1,0,0,
	-1,0,0,
	-1,0,0];

	var indexBufferID = createIndexBuffer(this.indices);
	var vertexBufferID = createVertexBuffer(this.vertices);
	var normalBufferID = createNormalBuffer(this.normals);

	//this.velocity = new Point(0,7,-50);
	this.acceleration = new Point(0,0,25);

	this.update = function()
	{
		//this.position = this.position.add(this.velocity.multiply(timeElapsed).add(this.acceleration.multiply(0.5*timeElapsed*timeElapsed)));
		this.position = this.position.add(this.velocity.multiply(timeElapsed)).add(this.acceleration.multiply(0.5*timeElapsed*timeElapsed));
		this.velocity = this.velocity.add(this.acceleration.multiply(timeElapsed));

		if(this.position.z >= gameObjects[0].getHeight(this.position) || isNaN(gameObjects[0].getHeight(this.position)))
		{
			gameObjects.splice(gameObjects.indexOf(this),1);
		}
		
		//this.position = this.position.add(this.velocity);
	}

	this.draw = function()
	{
		mat4.identity(this.mvMatrix);
		
		mat4.translate(this.mvMatrix, [this.position.x, this.position.y, this.position.z]);
		mat4.multiply( camera.matrix(),this.mvMatrix,this.mvMatrix);
		

		drawBuffer(this.mvMatrix, [0,0,0], vertexBufferID,indexBufferID,normalBufferID);
	}
}