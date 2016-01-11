function InputHandler()
{
	var controls = new Array();

	function addControl(id, code)
	{
		var control = new Control(id, code);

		// for (var j = 0; j < controls.length; j++)
		// {
		// 	if(control.code > controls[j].code)
		// }

		controls.push(control);
	}

	function activateControl(code)
	{
		for (var j = 0; j < controls.length; j++)
		{
			if(code == controls[j].code)
			{
				var control = controls[j];
				control.status = true;
				controls.splice(j, 1);
				controls.unshift(control);
				break;
			}	
		}
	}

	function deactivateControl(code)
	{
		for (var j = 0; j < controls.length; j++)
		{
			if(code == controls[j].code)
			{
				var control = controls[j];
				control.status = false;
				controls.splice(j, 1);
				controls.push(control);
				break;
			}	
		}
	}

	this.setControl = function(code, func)
	{
		for (var j = 0; j < controls.length; j++)
		{
			if(code == controls[j].code)
			{
				var control = controls[j];
				control.addFunction(func);
				break;
			}	
		}
	}

	addControl('A');
	addControl('F');
	addControl('W');
	addControl('D');
	addControl('S');
	addControl('E');
	addControl("SPACE", 32);

	function getMouse(e) 
	{

		mouse.x = e.offsetX;
		mouse.y = this.height - e.offsetY;
	}

	this.keyPress = function(e)
	{
		activateControl(e.keyCode);
	}

	this.keyRelease = function(e)
	{
		deactivateControl(e.keyCode);
	}

	this.update = function()
	{
		for (var j = 0; j < controls.length; j++)
		{
			if(!controls[j].status)
				break;
			controls[j].pressed();
		}
	}
}

function Control(id, code)
{
	if(code)
		this.code = code;
	else
		this.code = id.charCodeAt(0)
	this.id = id;
	this.status = false;

	var functions = new Array();

	this.addFunction = function(f)
	{
		//console.log(this.id);
		functions.push(f);
	}

	this.pressed = function()
	{
		//console.log(id);
		for (var j = 0; j < functions.length; j++)
		{
			functions[j].apply(undefined);
		}
	}
}