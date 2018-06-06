function Obj() {
	this.objVerticesBuffer;
	this.objVerticesTextCoorBuffer;
    this.obj_Face1
	this.objVerticesIndexBuffer;
	this.objVerticesNormalBuffer;
	this.iXCurrentPos = canvas.width;
	this.iYCurrentPos = canvas.height;
	this.absXCurrentPos;
	this.absYCurrentPos;
	this.absZCurrentPos;
    this.xRotation = 0;
    this.yRotation = 0;
    this.zTranslation = 0.1;
    this.rotMatX = [];
    this.rotMatY = [];
    this.trans = [];
    this.vertices = [];
    this.vnormals = [];
    this.faces = [];
    this.normalfaces = [];
    this.bObjLoaded = false;
}

Obj.prototype.loadData = function (data, that){
    var asFile = data.split('\n');
    for (var i=0; i<asFile.length; i++) {
        var sLine = asFile[i];
        if (sLine.match("v .*")) {
            var asLine = sLine.split(" ");
            that.vertices.push([asLine[1], asLine[2], asLine[3]]);
        }

        if (sLine.match("vn .*")) {
            var asLine = sLine.split(" ");
            that.vnormals.push([asLine[1], asLine[2], asLine[3]]);
        }

        if (sLine.match("f .*")) {
            var asLine = sLine.split(" ");
            that.faces.push([asLine[1].split("/")[0], asLine[2].split("/")[0], asLine[3].split("/")[0]]);
            that.normalfaces.push([asLine[1].split("/")[2], asLine[2].split("/")[2], asLine[3].split("/")[2]]);
        }
    }
    this.initMesh();
}

Obj.prototype.loadObjFile = function (){
    var file = null;
    var request = new XMLHttpRequest();
    var that = this;
    request.open("GET", "obj/test2.obj");
    request.responseType = "text";
    request.onreadystatechange = function () {
        if (request.readyState==4) {
            file = request.response;
            if (that.loadData) {
                that.loadData(file, that);
            }
        }
    };
    request.send(null);
}

Obj.prototype.initMesh = function (){
    

	this.objVerticesBuffer = gl.createBuffer();
    var vertex = [];
    var normal = [];
    var textCoord = [];
    var indices = [];

    for (var i=0; i<this.faces.length; i++) {
        vertex.push(this.vertices[this.faces[i][0]-1][0]);
        vertex.push(this.vertices[this.faces[i][0]-1][1]);
        vertex.push(this.vertices[this.faces[i][0]-1][2]);
        vertex.push(this.vertices[this.faces[i][1]-1][0]);
        vertex.push(this.vertices[this.faces[i][1]-1][1]);
        vertex.push(this.vertices[this.faces[i][1]-1][2]);
        vertex.push(this.vertices[this.faces[i][2]-1][0]);
        vertex.push(this.vertices[this.faces[i][2]-1][1]);
        vertex.push(this.vertices[this.faces[i][2]-1][2]);
        normal.push(this.vnormals[this.normalfaces[i][0]-1][0]);
        normal.push(this.vnormals[this.normalfaces[i][1]-1][1]);
        normal.push(this.vnormals[this.normalfaces[i][2]-1][2]);
        normal.push(this.vnormals[this.normalfaces[i][0]-1][0]);
        normal.push(this.vnormals[this.normalfaces[i][1]-1][1]);
        normal.push(this.vnormals[this.normalfaces[i][2]-1][2]);
        normal.push(this.vnormals[this.normalfaces[i][0]-1][0]);
        normal.push(this.vnormals[this.normalfaces[i][1]-1][1]);
        normal.push(this.vnormals[this.normalfaces[i][2]-1][2]);
        textCoord.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
        indices.push(3*i);
        indices.push(3*i+1);
        indices.push(3*i+2);
    }

	this.objVerticesBuffer.itemSize = 3;
	this.objVerticesBuffer.numItems = 3 * this.faces.length;

    this.objVerticesNormalBuffer = gl.createBuffer();

    this.objVerticesNormalBuffer.itemSize = 3;
	this.objVerticesNormalBuffer.numItems = 3*this.faces.length;

	this.objVerticesTextCoorBuffer = gl.createBuffer();

	this.objVerticesTextCoorBuffer.itemSize = 2;
	this.objVerticesTextCoorBuffer.numItems = 3 * this.faces.length;

	this.objVerticesIndexBuffer = gl.createBuffer();
	
	this.objVerticesIndexBuffer.numItems = 3 * this.faces.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.objVerticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.rotMatX[0] = 1.0;
    this.rotMatX[1] = 0.0;
    this.rotMatX[2] = 0.0;
    this.rotMatX[3] = 0.0;
    this.rotMatX[4] = 0.0;
    this.rotMatX[5] = Math.cos(this.xRotation);
    this.rotMatX[6] = Math.sin(this.xRotation);
    this.rotMatX[7] = 0.0;
    this.rotMatX[8] = 0.0;
    this.rotMatX[9] = -Math.sin(this.xRotation);
    this.rotMatX[10] = Math.cos(this.xRotation);
    this.rotMatX[11] = 0.0;
    this.rotMatX[12] = 0.0;
    this.rotMatX[13] = 0.0;
    this.rotMatX[14] = 0.0;
    this.rotMatX[15] = 1.0;

    this.rotMatY[0] = Math.cos(this.yRotation);
    this.rotMatY[1] = 0.0;
    this.rotMatY[2] = Math.sin(this.yRotation);
    this.rotMatY[3] = 0.0;
    this.rotMatY[4] = 0.0;
    this.rotMatY[5] = 1.0;
    this.rotMatY[6] = 0.0;
    this.rotMatY[7] = 0.0;
    this.rotMatY[8] = -Math.sin(this.yRotation);
    this.rotMatY[9] = 0.0;
    this.rotMatY[10] = Math.cos(this.yRotation);
    this.rotMatY[11] = 0.0;
    this.rotMatY[12] = 0.0;
    this.rotMatY[13] = 0.0;
    this.rotMatY[14] = 0.0;
    this.rotMatY[15] = 1.0;

    this.trans[0] = 1.0;
    this.trans[1] = 0.0;
    this.trans[2] = 0.0;
    this.trans[3] = 0.0;
    this.trans[4] = 0.0;
    this.trans[5] = 1.0;
    this.trans[6] = 0.0;
    this.trans[7] = 0.0;
    this.trans[8] = 0.0;
    this.trans[9] = 0.0;
    this.trans[10] = 1.0;
    this.trans[11] = -5.0;
    this.trans[12] = 0.0;
    this.trans[13] = 0.0;
    this.trans[14] = 0.0;
    this.trans[15] = 1.0;

    this.initTexture();
}

Obj.prototype.initPosition = function (xInitPos, yInitPos, zInitPos) {
	this.absXCurrentPos = xInitPos;
	this.absYCurrentPos = yInitPos;
	this.absZCurrentPos = zInitPos;
}


Obj.prototype.updatePosition = function (){
    if (keyPressed.indexOf(38) != -1) {
        this.xRotation += 0.1;
        this.rotMatX[0] = 1.0;
        this.rotMatX[1] = 0.0;
        this.rotMatX[2] = 0.0;
        this.rotMatX[3] = 0.0;
        this.rotMatX[4] = 0.0;
        this.rotMatX[5] = Math.cos(this.xRotation);
        this.rotMatX[6] = Math.sin(this.xRotation);
        this.rotMatX[7] = 0.0;
        this.rotMatX[8] = 0.0;
        this.rotMatX[9] = -Math.sin(this.xRotation);
        this.rotMatX[10] = Math.cos(this.xRotation);
        this.rotMatX[11] = 0.0;
        this.rotMatX[12] = 0.0;
        this.rotMatX[13] = 0.0;
        this.rotMatX[14] = 0.0;
        this.rotMatX[15] = 1.0;
	}
    if (keyPressed.indexOf(40) != -1) {
        this.xRotation -= 0.1;
        this.rotMatX[0] = 1.0;
        this.rotMatX[1] = 0.0;
        this.rotMatX[2] = 0.0;
        this.rotMatX[3] = 0.0;
        this.rotMatX[4] = 0.0;
        this.rotMatX[5] = Math.cos(this.xRotation);
        this.rotMatX[6] = Math.sin(this.xRotation);
        this.rotMatX[7] = 0.0;
        this.rotMatX[8] = 0.0;
        this.rotMatX[9] = -Math.sin(this.xRotation);
        this.rotMatX[10] = Math.cos(this.xRotation);
        this.rotMatX[11] = 0.0;
        this.rotMatX[12] = 0.0;
        this.rotMatX[13] = 0.0;
        this.rotMatX[14] = 0.0;
        this.rotMatX[15] = 1.0;
	}

    if (keyPressed.indexOf(37) != -1) {
        this.yRotation += 0.1;
        this.rotMatY[0] = Math.cos(this.yRotation);
        this.rotMatY[1] = 0.0;
        this.rotMatY[2] = Math.sin(this.yRotation);
        this.rotMatY[3] = 0.0;
        this.rotMatY[4] = 0.0;
        this.rotMatY[5] = 1.0;
        this.rotMatY[6] = 0.0;
        this.rotMatY[7] = 0.0;
        this.rotMatY[8] = -Math.sin(this.yRotation);
        this.rotMatY[9] = 0.0;
        this.rotMatY[10] = Math.cos(this.yRotation);
        this.rotMatY[11] = 0.0;
        this.rotMatY[12] = 0.0;
        this.rotMatY[13] = 0.0;
        this.rotMatY[14] = 0.0;
        this.rotMatY[15] = 1.0;
	}
    if (keyPressed.indexOf(39) != -1) {
        this.yRotation -= 0.1;
        this.rotMatY[0] = Math.cos(this.yRotation);
        this.rotMatY[1] = 0.0;
        this.rotMatY[2] = Math.sin(this.yRotation);
        this.rotMatY[3] = 0.0;
        this.rotMatY[4] = 0.0;
        this.rotMatY[5] = 1.0;
        this.rotMatY[6] = 0.0;
        this.rotMatY[7] = 0.0;
        this.rotMatY[8] = -Math.sin(this.yRotation);
        this.rotMatY[9] = 0.0;
        this.rotMatY[10] = Math.cos(this.yRotation);
        this.rotMatY[11] = 0.0;
        this.rotMatY[12] = 0.0;
        this.rotMatY[13] = 0.0;
        this.rotMatY[14] = 0.0;
        this.rotMatY[15] = 1.0;
	}

    if (keyPressed.indexOf(107) != -1) {
        this.trans[11] += this.zTranslation;
	}
    if (keyPressed.indexOf(109) != -1) {
        this.trans[11] -= this.zTranslation;
	}
}

Obj.prototype.draw = function (){
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    gl.disable(gl.CULL_FACE);

    var mvMatrix = [ 1.0, 0.0, 0.0, 0.0,
                     0.0, 1.0, 0.0, 0.0,
                     0.0, 0.0, 1.0, 0.0,
                     0.0, 0.0, 0.0, 1.0 ];

    var normalMatrix = [ 0.0, 0.0, 0.0, 0.0,
                         0.0, 0.0, 0.0, 0.0,
                         0.0, 0.0, 0.0, 0.0,
                         0.0, 0.0, 0.0, 0.0 ];

    mvMatrix = multiply(this.rotMatX, mvMatrix);
    mvMatrix = multiply(this.rotMatY, mvMatrix);
    mvMatrix = multiply(this.trans, mvMatrix);

    inverse(mvMatrix,normalMatrix);
    transpose(normalMatrix,normalMatrix);    

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.objVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.objVerticesNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.objVerticesTextCoorBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.objVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.obj_Face1);
    gl.uniform1i(samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.objVerticesIndexBuffer);

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1, 1, 1, 1);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix);

	gl.drawElements(gl.TRIANGLES, this.objVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    gl.disable(gl.BLEND);
}

Obj.prototype.handleLoadedTexture = function (texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

Obj.prototype.initTexture = function() {
	this.obj_Face1 = this.loadTexture("images/cube_face1.png");
}

Obj.prototype.loadTexture = function(imagePath) {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Obj.prototype.handleLoadedTexture(texture);
	}

	texture.image.src = imagePath;
	return texture;
}
