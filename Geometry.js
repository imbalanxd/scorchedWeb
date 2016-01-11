var PI_CONV = 0.05817764173314431923078969228295;

Point = function(X, Y, Z)
{
	this.x = X || 0;
	this.y = Y || 0;
	this.z = Z || 0;

	this.add = function(i, j, k)
	{
		if(j)
			return new Point(this.x + i, this.y + j,this.z + k);
		else
			return new Point(this.x + i.x, this.y + i.y, this.z + i.z);
	}

	this.multiply = function(c)
	{
		return new Point(this.x * c, this.y * c, this.z * c);
	}

	this.normalise = function()
	{
		var magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		return new Point(this.x/magnitude, this.y/magnitude,this.z/magnitude);
	}

	this.magnitude = function()
	{
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	this.findAngle = function(dest)
	{
		if(!dest)
		{
			return Math.atan2(this.y,this.x)/Math.PI * 180 + 90;
		}
		var angle = Math.atan2(dest.y - this.y,dest.x - this.x)/Math.PI * 180;
		return angle+90;
	}

	this.findVector = function(dest)
	{
		var vector = new Point(dest.x - this.x, dest.y - this.y);
		return vector;
	}

	this.distance = function(point)
	{
		return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
	}

	this.dot = function(point)
	{
		return (this.x*point.x + this.y*point.y);
	}

	this.project = function(point)
	{
		var val = this.dot(point) / Math.pow(point.magnitude(),2);
		return new Point(val*point.x, val*point.y);
	}

	this.scalarProject = function(point)
	{
		return (this.dot(point) / point.magnitude());
	}

	this.perpindicularProject = function(point)
	{
		return this.project(point.cross());
	}

	this.cross = function(point)
	{
		if(point)
			return new Point(this.y*point.z - this.z*point.y, this.z*point.x - this.x*point.z, this.x*point.y - this.y*point.x);
		else
			return new Point(-this.y, this.x);
	}

	this.equals = function(p)
	{
		return (this.x == p.x && this.y == p.y);
	}
}

Quaternion = function(x,y,z,w)
{
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w || 1;

	this.matrix = mat4.create();

	this.multiplyQuaternions = function ( a, b ) 
	{
		var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;
	}

	this.rotate = function(axis,w)
	{
		
		var local;

		// if(axis == "X")
		// {
		// 	local = new Quaternion(this.matrix[0] * Math.sin(w/2), this.matrix[1] * Math.sin(w/2), this.matrix[2] * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Y")
		// {
		// 	local = new Quaternion(this.matrix[4] * Math.sin(w/2), this.matrix[5] * Math.sin(w/2), this.matrix[6] * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Z")
		// {
		// 	local = new Quaternion(this.matrix[8] * Math.sin(w/2), this.matrix[9] * Math.sin(w/2), this.matrix[10] * Math.sin(w/2), Math.cos(w/2));
		// }

		
		// if(axis == "X")
		// {
		// 	local = new Quaternion(this.matrix[0] * Math.sin(w/2), this.matrix[4] * Math.sin(w/2), this.matrix[8] * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Y")
		// {
		// 	local = new Quaternion(this.matrix[1] * Math.sin(w/2), this.matrix[5] * Math.sin(w/2), this.matrix[9] * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Z")
		// {
		// 	local = new Quaternion(this.matrix[2] * Math.sin(w/2), this.matrix[6] * Math.sin(w/2), this.matrix[10] * Math.sin(w/2), Math.cos(w/2));
		// }

		// if(axis == "X")
		// {
		// 	local = new Quaternion(1 * Math.sin(w/2), 0 * Math.sin(w/2), 0 * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Y")
		// {
		// 	local = new Quaternion(0 * Math.sin(w/2), 1 * Math.sin(w/2), 0 * Math.sin(w/2), Math.cos(w/2));
		// }
		// else if(axis == "Z")
		// {
		// 	local = new Quaternion(0 * Math.sin(w/2), 0 * Math.sin(w/2), 1 * Math.sin(w/2), Math.cos(w/2));
		// }

		if(axis == "X")
		{
			local = new Quaternion(this.matrix[0] * Math.sin(w/2), this.matrix[4] * Math.sin(w/2), this.matrix[8] * Math.sin(w/2), Math.cos(w/2));
		}
		else if(axis == "Y")
		{
			local = new Quaternion(0 * Math.sin(w/2), 1 * Math.sin(w/2), 0 * Math.sin(w/2), Math.cos(w/2));
		}
		else if(axis == "Z")
		{
			local = new Quaternion(0 * Math.sin(w/2), 0 * Math.sin(w/2), 1 * Math.sin(w/2), Math.cos(w/2));
		}

		this.multiplyQuaternions(local,this);
		this.generateMatrix();
	}

	this.getRotation = function(axis)
	{

	console.log("QUAT"+ this.x+" "+this.y+" "+this.z+" "+this.w);
		var magVal;
		if(axis == "X")
		{
			magVal = this.x / (Math.sqrt(this.x * this.x + this.w * this.w));
			return 2*Math.acos(magVal);
		}
		else if(axis == "Y")
		{
			magVal = this.y / (Math.sqrt(this.y * this.y + this.w * this.w));
			return 2*Math.acos(magVal);
		}
		else if(axis == "Z")
		{
			magVal = this.z / (Math.sqrt(this.z * this.z + this.w * this.w));
			return 2*Math.acos(magVal);
		}
		
	}

	this.set = function(q)
	{
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
	}

	this.generateMatrix = function()
	{
		var mag = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2)+Math.pow(this.w,2));
		//console.log(mag);
		this.x = this.x/mag;
		this.y = this.y/mag;
		this.z = this.z/mag;
		this.w = this.w/mag;

		var x2 = this.x * this.x;
		var y2 = this.y * this.y;
		var z2 = this.z * this.z;
		var xy = this.x * this.y;
		var xz = this.x * this.z;
		var yz = this.y * this.z;
		var wx = this.w * this.x;
		var wy = this.w * this.y;
		var wz = this.w * this.z;

		this.matrix[0] = 1 - 2*(y2 + z2);
		this.matrix[1] = 2 * (xy - wz);
		this.matrix[2] = 2 * (xz + wy);
		this.matrix[3] = 0;

		this.matrix[4] = 2 * (xy + wz);
		this.matrix[5] = 1 - 2*(x2 + z2);
		this.matrix[6] = 2 * (yz - wx);
		this.matrix[7] = 0;

		this.matrix[8] = 2 * (xz - wy);
		this.matrix[9] = 2 * (yz + wx);
		this.matrix[10] = 1 - 2*(x2 + y2);
		this.matrix[11] = 0;

		this.matrix[12] = 0;
		this.matrix[13] = 0;
		this.matrix[14] = 0;
		this.matrix[15] = 1;

		// this.matrix[0] = 1 - 2*(y2 + z2);
		// this.matrix[4] = 2 * (xy - wz);
		// this.matrix[8] = 2 * (xz + wy);
		// this.matrix[12] = 0;

		// this.matrix[1] = 2 * (xy + wz);
		// this.matrix[5] = 1 - 2*(x2 + z2);
		// this.matrix[9] = 2 * (yz - wx);
		// this.matrix[13] = 0;

		// this.matrix[2] = 2 * (xz - wy);
		// this.matrix[6] = 2 * (yz + wx);
		// this.matrix[10] = 1 - 2*(x2 + y2);
		// this.matrix[14] = 0;

		// this.matrix[3] = 0;
		// this.matrix[7] = 0;
		// this.matrix[11] = 0;
		// this.matrix[15] = 1;

		// console.log("COLLUMNS .1. "+this.magnitude(this.matrix[0],this.matrix[4],this.matrix[8],this.matrix[12])
		// 	+" .2. "+this.magnitude(this.matrix[1],this.matrix[5],this.matrix[9],this.matrix[13])
		// 	+" .3. "+this.magnitude(this.matrix[2],this.matrix[6],this.matrix[10],this.matrix[14])
		// 	+" .4. "+this.magnitude(this.matrix[3],this.matrix[7],this.matrix[11],this.matrix[15]));

		// console.log("ROWS .1. "+this.magnitude(this.matrix[0],this.matrix[1],this.matrix[2],this.matrix[3])
		// 	+" .2. "+this.magnitude(this.matrix[4],this.matrix[5],this.matrix[6],this.matrix[7])
		// 	+" .3. "+this.magnitude(this.matrix[8],this.matrix[9],this.matrix[10],this.matrix[11])
		// 	+" .4. "+this.magnitude(this.matrix[12],this.matrix[13],this.matrix[14],this.matrix[15]));
	}

	this.magnitude = function(a,b,c,d)
	{
		return Math.sqrt(Math.pow(a||0,2)+Math.pow(b||0,2)+Math.pow(c||0,2)+Math.pow(d||0,2));
	}

	this.matrix = function()
	{
		
		// var mag = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2)+Math.pow(this.w,2));
		// //console.log(mag);
		// this.x = this.x/mag;
		// this.y = this.y/mag;
		// this.z = this.z/mag;
		// this.w = this.w/mag;
		// this.generateMatrix();

		return this.matrix;
	}
	this.generateMatrix();
}