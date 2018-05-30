function Obj() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
    this.Obj_Face1
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = canvas.width;
	this.iYCurrentPos = canvas.height;
	this.absXCurrentPos;
	this.absYCurrentPos;
	this.absZCurrentPos;
    this.xRotation = 0;
    this.yRotation = 0;
    this.xTranslation = 0;
    this.rotMatX = [];
    this.rotMatY = [];
    this.trans = [];
    this.vertices = [];
    this.faces = [];
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

        if (sLine.match("f .*")) {
            var asLine = sLine.split(" ");
            that.faces.push([asLine[1].split("/")[0], asLine[2].split("/")[0], asLine[3].split("/")[0]]);
        }
    }
    this.initMesh();
}

Obj.prototype.loadObjFile = function (){
    var file = null;
    var request = new XMLHttpRequest();
    var that = this;
    request.open("GET", "obj/test.obj");
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
    

	this.squareVerticesBuffer = gl.createBuffer();
    var vertex = [];
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
        textCoord.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
        indices.push(3*i);
        indices.push(3*i+1);
        indices.push(3*i+2);
    }

	this.squareVerticesBuffer.itemSize = 3;
	this.squareVerticesBuffer.numItems = 3 * this.faces.length;

	this.squareVerticesTextCoorBuffer = gl.createBuffer();

	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 3 * this.faces.length;

	this.squareVerticesIndexBuffer = gl.createBuffer();
	
	this.squareVerticesIndexBuffer.numItems = 3 * this.faces.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
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
}

Obj.prototype.draw = function (){
    mvMatrix = [ 1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, 0.0, 1.0 ];

    
    mvMatrix = multiply(this.rotMatX, mvMatrix);
    mvMatrix = multiply(this.rotMatY, mvMatrix);
    mvMatrix = multiply(this.trans, mvMatrix);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.Obj_Face1);
    gl.uniform1i(samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1, 1, 1, 1);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

Obj.prototype.handleLoadedTexture = function (texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Obj.prototype.initTexture = function() {
	this.Obj_Face1 = this.loadTexture("images/cube_face1.png");
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
