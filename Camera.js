Camera.prototype = new GameObject();
function Camera()
{
	var restrictions = new Array();

	gameObjects.push(this);
	this.transform = mat4.create();

	var position = new Point(0,0,0);
	this.rotation = new Quaternion(0,0,0,1);

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.xRot = 0;
	this.yRot = 0;
	this.zRot = 0;

	this.rotate = function(axis, w)
	{
		this.rotation.rotate(axis, w);
		if(axis == "X")
			this.xRot = (w + this.xRot + (Math.PI*2)) % (Math.PI*2);
		else if(axis == "Y")
			this.yRot = (w + this.yRot + (Math.PI*2)) % (Math.PI*2);
		else if(axis == "Z")
			this.zRot = (w + this.zRot + (Math.PI*2)) % (Math.PI*2);
	}

	this.getRotation = function(axis)
	{
		//return this.rotation.getRotation(axis);
		if(axis == "X")
			return this.xRot;
		else if(axis == "Y")
			return this.yRot;
		else if(axis == "Z")
			return this.zRot;
	}

	this.zero = function()
	{
		this.xRot = 0;
		this.yRot = 0;
		this.zRot = 0;
	}

	this.reset = function()
	{
		this.rotation = new Quaternion();
	}

	this.translate = function()
	{
		mat4.translate(this.transform, [this.x, this.y, this.z]);
	}

	this.addRestriction = function(func)
	{
		restrictions.push(func);
	}

	this.update = function()
	{
		for(var i=0;i<restrictions.length;i++)
		{
			restrictions[i].apply();
		}

		mat4.identity(this.transform);

		

		mat4.multiply(this.rotation.matrix(),this.transform, this.transform);
		this.translate();
		
	}

	this.matrix = function()
	{
		return this.transform;
	}
};