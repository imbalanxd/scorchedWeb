function GameObject()
{
	//gameObjects.push(this);
	this.init();
	this.direction = new Point(1,0);
	this.debug = true;
	this.position = new Point();
	this.mvMatrix = mat4.create();
};

GameObject.prototype.init = function()
{
};

GameObject.prototype.update = function()
{
};

GameObject.prototype.draw = function()
{
};

GameObject.prototype.setPosition = function(x, y, z)
{
	this.position = new Point(x || 0, y || 0, z || 0);
};

GameObject.prototype.getPosition = function()
{
	return this.position;
};

GameObject.prototype.setDirection = function(direction)
{
	this.direction = direction;
};

GameObject.prototype.setImage = function(imageSrc)
{
	this.image.src = imageSrc;
};

GameObject.prototype.setDebug = function(debug)
{
	this.debug = debug;
};

GameObject.prototype.super = function(functionName) 
{
    GameObject.prototype[functionName].call(this);
};