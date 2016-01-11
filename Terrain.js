Terrain.prototype = new GameObject();
function Terrain(width, height, segmentWidth, segmentHeight, texWidth, texHeight)
{
	gameObjects.push(this);

	this.width = width;
	this.height = height;
	var widthHalf = this.width/2;
	var heightHalf = this.height/2;
	this.widthSegment = segmentWidth || 1;
	this.heightSegment = segmentHeight || 1;

	this.heightScale = 0.4;

	var gridX = this.width/this.widthSegment;
	var gridY = this.height/this.heightSegment;
	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	this.smooth = [	0.11 , 0.11 , 0.11,
					0.11 , 0.11 , 0.11,
					0.11 , 0.11 , 0.11,];

	this.textures = [];
	this.vertices = [];

	for(y = 0; y < gridY1; y++)
	{
		for(x = 0; x < gridX1; x++)
		{
			this.vertices.push(	this.widthSegment * x - widthHalf, 			//GRIDX
								0,//this.data[x+(y*gridY1)]*this.heightScale, 	//HEIGHT
								this.heightSegment * y - heightHalf);		//GRIDY

			this.textures.push(x/(gridX1-1), y/(gridY1-1));
		}
	}

	this.indices = [];

	for(y = 0; y < gridY; y++)
	{
		for(x = 0; x < gridX; x++)
		{
			var a = x + y*gridX1;
			var b = x + (y+1)*gridX1;
			var c = (x+1) + (y+1)*gridX1;
			var d = (x+1) + (y)*gridX1;
			this.indices.push(b,a,c,d);
		}
		y++;
		for(x = gridX-1; x >= 0; x--)
		{
			var a = x + y*gridX1;
			var b = x + (y+1)*gridX1;
			var c = (x+1) + (y+1)*gridX1;
			var d = (x+1) + (y)*gridX1;
			this.indices.push(b,a,c,d);
		}
	}

	this.data = generateHeight( texWidth, texHeight, true);
	applySmoothing(this.data, texWidth,texHeight,this.smooth,3,3);
	applySmoothing(this.data, texWidth,texHeight,this.smooth,3,3);
	

	this.normals = new Uint8Array( texWidth * texHeight * 3);

	for(y = 0; y < texHeight; y++)
	{
		for(x = 0; x < texWidth; x++)
		{
			var one = new Point(1.0, this.data[x + 1 + (y * texWidth)] - this.data[x + (y * texWidth)], 0.0);
			var two = new Point(0.0, this.data[x + ((y+1) * texWidth)] - this.data[x + (y * texWidth)], 1.0);

			var normal = two.cross(one);
			normal = normal.normalise();

			this.normals[3*(x + y * texWidth)] = normal.x * 255;
			this.normals[3*(x + y * texWidth) + 1] = normal.y * 255;
			this.normals[3*(x + y * texWidth) + 2] = normal.z * 255;
		}
	}

	var normalsamplerID = createSampler2D(this.normals,texWidth,texHeight, Context.RGB, Context.RGB, Context.UNSIGNED_BYTE);
	var samplerID = createSampler2D(this.data,texWidth,texHeight, Context.ALPHA, Context.ALPHA, Context.UNSIGNED_BYTE);	
	
	bindSampler2D(normalsamplerID, "normalmap", 1, Context.TEXTURE1);
	bindSampler2D(samplerID, "heightmap", 0,Context.TEXTURE0);

	

	var indexBufferID = createIndexBuffer(this.indices);
	var vertexBufferID = createVertexBuffer(this.vertices);
	var textureBufferID = createTextureCoordBuffer(this.textures);

	

	this.draw = function()
	{
		mat4.identity(this.mvMatrix);

		mat4.multiply( camera.matrix(),this.mvMatrix,this.mvMatrix);
		mat4.translate(this.mvMatrix, [this.position.x, this.position.y, this.position.z]);
		

		drawBuffer(this.mvMatrix, [1,1,1], vertexBufferID,indexBufferID, null,textureBufferID);
	}

	this.getHeight = function(position)
	{
		var localGridX = Math.floor((this.width/2 + position.x) / this.widthSegment);
		var localGridY = Math.floor((this.height/2 + position.z) / this.heightSegment);

		if(localGridX > this.width || localGridX < 0)
			localGridX = Math.max(Math.min(localGridX, this.width-1), 1);
		if(localGridY > this.height || localGridY < 0)
			localGridY = Math.max(Math.min(localGridY, this.height-1), 1);

		var middle = this.data[localGridX + gridX1*(localGridY)]*this.heightScale;
		var forward = this.data[localGridX + 1 + gridX1*(localGridY)]*this.heightScale;
		var backward = this.data[localGridX + (-1) + gridX1*(localGridY)]*this.heightScale;
		var leftSide = this.data[localGridX + gridX1*(localGridY + 1)]*this.heightScale;
		var rightSide = this.data[localGridX + gridX1*(localGridY + (-1))]*this.heightScale;

		var front = middle + (forward - middle)/2;
		var back = middle + (middle - backward)/2;
		var left = middle + (leftSide - middle)/2;
		var right = middle + (rightSide - middle)/2;

		var squareLocX = position.x%this.widthSegment;
		var squareLocY = position.z%this.heightSegment;

		
		return backward + (forward-backward)*(squareLocX/this.widthSegment);
		//return this.data[localGridX + gridX1*(localGridY)]*this.heightScale;
	}

	function generateHeight( width, height, normalise) 
	{

		var size = width * height, data = new Uint8Array( size ),
		perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
		for ( var i = 0; i < size; i ++ ) {

			data[ i ] = 0;

		}
		var max = 0;
		for ( var j = 0; j < 4; j ++ ) {

			for ( var i = 0; i < size; i ++ ) {

				var x = i % width, y = ~~ ( i / width );
				data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
				if(data[i] > max)
					max = data[i];
			}

			quality *= 5;

		}
		if(normalise)
			normaliseData(data, 255, max);
		return data;
	}

	function normaliseData (data, range, max)
	{
		for(var i = 0; i< data.length; i++)
		{
			data[i] = data[i]/max * range;
		}
	}


	function applySmoothing(tar,tw,th, func,fw,fh)
	{
		for(var y=Math.floor(fh/2); y < th - Math.floor(fh/2); y++)
		{
			for(var x=Math.floor(fw/2); x < tw - Math.floor(fw/2); x++)
			{
				var tot = 0;
				for(var j = 0; j < fh; j++)
				{
					for(var i = 0; i < fw; i++)
					{
						tot += tar[y * tw + x + j * tw + i] * func[j * fw + i];
					}
				}
				tar[y * tw + x + Math.floor(fh/2) * tw + Math.floor(fw/2)] = tot;
			}
		}
	}
};