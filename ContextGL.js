var Context;
function initGL(canvas) 
{
    try 
    {
        Context = canvas.getContext("experimental-webgl");
        Context.viewportWidth = canvas.width;
        Context.viewportHeight = canvas.height;
    } 
    catch (e) 
    {
        alert(e);
    }
}

var pMatrix = mat4.create();

var vertexNormalAttribute;
var vertexPositionAttribute;
var textureCoordAttribute;
var pMatrixUniform;
var mvMatrixUniform;
var Color;

function initGLSettings()
{
    Context.clearColor(0.5, 0.5, 0.5, 1.0);
    Context.enable(Context.DEPTH_TEST);
    Context.viewport(0, 0, Context.viewportWidth, Context.viewportHeight);
    mat4.perspective(45, Context.viewportWidth / Context.viewportHeight, 0.1, 1000.0, pMatrix);
    //mat4.ortho(0, Context.viewportWidth, 0, Context.viewportHeight, 1, 100, pMatrix);
}

function initShaders() 
{
    var fragmentShader = getShader(Context, "shader-fs");
    var vertexShader = getShader(Context, "shader-vs");

    shaderProgram = Context.createProgram();
    Context.attachShader(shaderProgram, vertexShader);
    Context.attachShader(shaderProgram, fragmentShader);
    Context.linkProgram(shaderProgram);

    if (!Context.getProgramParameter(shaderProgram, Context.LINK_STATUS)) 
    {
        alert("Could not initialise shaders");
    }

    Context.useProgram(shaderProgram);

    //vertexNormalAttribute = Context.getAttribLocation(shaderProgram, "aVertexNormal");
    //Context.enableVertexAttribArray(vertexNormalAttribute);

    vertexPositionAttribute = Context.getAttribLocation(shaderProgram, "aVertexPosition");
    Context.enableVertexAttribArray(vertexPositionAttribute);

    textureCoordAttribute = Context.getAttribLocation(shaderProgram, "aTexCoord");
    Context.enableVertexAttribArray(textureCoordAttribute);

    pMatrixUniform = Context.getUniformLocation(shaderProgram, "uPMatrix");
    mvMatrixUniform = Context.getUniformLocation(shaderProgram, "uMVMatrix");
    Color = Context.getUniformLocation(shaderProgram, "color");

    Context.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
}

function getShader(context, id) 
{
        var shaderScript = document.getElementById(id);
        if (!shaderScript) 
        {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) 
        {
            if (k.nodeType == 3) 
            {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") 
        {
            shader = context.createShader(context.FRAGMENT_SHADER);
        } 
        else if (shaderScript.type == "x-shader/x-vertex") 
        {
            shader = context.createShader(context.VERTEX_SHADER);
        } 
        else 
        {
            return null;
        }

        context.shaderSource(shader, str);
        context.compileShader(shader);

        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) 
        {
            alert(context.getShaderInfoLog(shader));
            return null;
        }

        return shader;
}

function createSampler2D(data,width,height, dataFormat, texFormat, dataType)
{
    var id = Context.createTexture();

    Context.bindTexture(Context.TEXTURE_2D, id);
    Context.texImage2D(Context.TEXTURE_2D, 0, dataFormat, width,height,0, texFormat, dataType, data);
    Context.texParameteri(Context.TEXTURE_2D, Context.TEXTURE_MAG_FILTER, Context.LINEAR);
    Context.texParameteri(Context.TEXTURE_2D, Context.TEXTURE_MIN_FILTER, Context.LINEAR);
    //Context.generateMipmap(Context.TEXTURE_2D);
    Context.bindTexture(Context.TEXTURE_2D, null);

    return id;
}

function bindSampler2D(samplerID, name, id, texNum)
{
    Context.activeTexture(texNum);
    Context.bindTexture(Context.TEXTURE_2D, samplerID);
    Context.uniform1i(Context.getUniformLocation(shaderProgram, name), id);
}

function createVertexBuffer(vertices)
{
    var id = Context.createBuffer();
    Context.bindBuffer(Context.ARRAY_BUFFER, id);
    Context.bufferData(Context.ARRAY_BUFFER, new Float32Array(vertices), Context.STATIC_DRAW);
    id.itemSize = 3;
    id.numItems = (vertices.length / id.itemSize);
    return id;
}

function createNormalBuffer(normals)
{
    var id = Context.createBuffer();
    Context.bindBuffer(Context.ARRAY_BUFFER, id);
    Context.bufferData(Context.ARRAY_BUFFER, new Float32Array(normals), Context.STATIC_DRAW);
    id.itemSize = 3;
    id.numItems = (normals.length / id.itemSize);
    return id;
}

function createTextureCoordBuffer(coords)
{
    var id = Context.createBuffer();
    Context.bindBuffer(Context.ARRAY_BUFFER, id);
    Context.bufferData(Context.ARRAY_BUFFER, new Float32Array(coords), Context.STATIC_DRAW);
    id.itemSize = 2;
    id.numItems = (coords.length / id.itemSize);
    return id;
}

function createIndexBuffer(indices)
{
    var id = Context.createBuffer();
    Context.bindBuffer(Context.ELEMENT_ARRAY_BUFFER, id);
    Context.bufferData(Context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), Context.STATIC_DRAW);
    id.itemSize = 1;
    id.numItems = (indices.length / id.itemSize);

    return id;
}

function drawBuffer(mvMatrix, color,vertexID, indexID, normalID, textureID)
{
    Context.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat4.create();
    mat4.inverse(mvMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    var nUniform = Context.getUniformLocation(shaderProgram, "uNormalMatrix");
    Context.uniformMatrix4fv(nUniform, false, normalMatrix);

    Context.uniform3fv(Color, color);
    if(vertexID != null)
    {
        Context.bindBuffer(Context.ARRAY_BUFFER, vertexID);    
        Context.vertexAttribPointer(vertexPositionAttribute, vertexID.itemSize, Context.FLOAT, false, 0, 0);
    }
    
    if(indexID != null)
    {
        Context.bindBuffer(Context.ELEMENT_ARRAY_BUFFER, indexID);
        Context.drawElements(Context.TRIANGLE_STRIP, indexID.numItems, Context.UNSIGNED_SHORT, 0) 
    }

    if(normalID != null)
    {
        Context.bindBuffer(Context.ARRAY_BUFFER, normalID);    
        Context.vertexAttribPointer(vertexNormalAttribute, normalID.itemSize, Context.FLOAT, false, 0, 0);
    }

    if(textureID != null)
    {
        Context.bindBuffer(Context.ARRAY_BUFFER, textureID);
        Context.vertexAttribPointer(textureCoordAttribute, textureID.itemSize, Context.FLOAT, false, 0, 0);
    }
    
}

function uploadBuffer()
{

}

function clearCanvas()
{
    Context.clear(Context.COLOR_BUFFER_BIT | Context.DEPTH_BUFFER_BIT);
}
