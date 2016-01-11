Tank.prototype = new GameObject();
function Tank(terr)
{
	gameObjects.push(this);

	var terrain = terr;
	var projectileFactory = new ProjectileFactory();

	this.vertices= [
				-1, -1,  1,
                1, -1,  1,
                1,  1,  1,
               -1,  1,  1,
 
               -1, -1, -1,
               -1,  1, -1,
                1,  1, -1,
                1, -1, -1,
 
               -1,  1, -1,
               -1,  1,  1,
                1,  1,  1,
                1,  1, -1,
 
               -1, -1, -1,
                1, -1, -1,
                1, -1,  1,
               -1, -1,  1,
 
                1, -1, -1,
                1,  1, -1,
                1,  1,  1,
                1, -1,  1,
 
               -1, -1, -1,
               -1, -1,  1,
               -1,  1,  1,
               -1,  1, -1];



	this.indices= [
				0, 1, 2, 0, 2, 3,
              	4, 5, 6, 4, 6, 7,
              	8, 9, 10, 8, 10, 11,
              	12, 13, 14, 12, 14, 15,
              	16, 17, 18, 16, 18, 19,
              	20, 21, 22, 20, 22, 23];

	this.normals = [	
				0,0,1,
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

	this.update = function()
	{
		this.position.y = terrain.getHeight(this.position);
	}

	this.fire = function()
	{
		projectileFactory.spawnProjectile(	this.position, 
									new Point(	-15 +Math.random() * 30,
												-15 +Math.random() * 30,
												-35 - Math.random() * 50));
	}

	this.draw = function()
	{
		mat4.identity(this.mvMatrix);
		
		mat4.multiply( camera.matrix(),this.mvMatrix,this.mvMatrix);
		mat4.translate(this.mvMatrix, [this.position.x, this.position.y, this.position.z]);

		//drawBuffer(this.mvMatrix, [1,0,0], vertexBufferID,indexBufferID,normalBufferID);
	}
}