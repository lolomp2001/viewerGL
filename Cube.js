function Cube() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
    this.Cube_Face1
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = canvas.width;
	this.iYCurrentPos = canvas.height;
	this.absXCurrentPos;
	this.absYCurrentPos;
	this.absZCurrentPos;
    this.xRotation = 0;
    this.xTranslation = 0;
    this.rotMat = [];
    this.trans = [];
}

Cube.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	var vertices1 = [ -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH,
	                 CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH,

                    CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH,
	                 -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH ];

	this.squareVerticesBuffer.itemSize = 3;
	this.squareVerticesBuffer.numItems = 8;

	this.squareVerticesTextCoorBuffer = gl.createBuffer();

	var textCoord = [ 0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,
                      
                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0 ];

	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 8;

	this.squareVerticesIndexBuffer = gl.createBuffer();
	var indices = [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7 ];
	this.squareVerticesIndexBuffer.numItems = 12;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.rotMat[0] = 1.0;
    this.rotMat[1] = 0.0;
    this.rotMat[2] = 0.0;
    this.rotMat[3] = 0.0;
    this.rotMat[4] = 0.0;
    this.rotMat[5] = Math.cos(this.xRotation);
    this.rotMat[6] = Math.sin(this.xRotation);
    this.rotMat[7] = 0.0;
    this.rotMat[8] = 0.0;
    this.rotMat[9] = -Math.sin(this.xRotation);
    this.rotMat[10] = Math.cos(this.xRotation);
    this.rotMat[11] = 0.0;
    this.rotMat[12] = 0.0;
    this.rotMat[13] = 0.0;
    this.rotMat[14] = 0.0;
    this.rotMat[15] = 1.0;

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
    this.trans[11] = 0.0;
    this.trans[12] = 0.0;
    this.trans[13] = 0.0;
    this.trans[14] = -5.0;
    this.trans[15] = 1.0;

    this.initTexture();
}

Cube.prototype.initPosition = function (xInitPos, yInitPos, zInitPos) {
	this.absXCurrentPos = xInitPos;
	this.absYCurrentPos = yInitPos;
	this.absZCurrentPos = zInitPos;
}


Cube.prototype.updatePosition = function (){
    if (keyPressed.indexOf(38) != -1) {
        this.xRotation += 0.1;
        this.rotMat[0] = 1.0;
        this.rotMat[1] = 0.0;
        this.rotMat[2] = 0.0;
        this.rotMat[3] = 0.0;
        this.rotMat[4] = 0.0;
        this.rotMat[5] = Math.cos(this.xRotation);
        this.rotMat[6] = Math.sin(this.xRotation);
        this.rotMat[7] = 0.0;
        this.rotMat[8] = 0.0;
        this.rotMat[9] = -Math.sin(this.xRotation);
        this.rotMat[10] = Math.cos(this.xRotation);
        this.rotMat[11] = 0.0;
        this.rotMat[12] = 0.0;
        this.rotMat[13] = 0.0;
        this.rotMat[14] = 0.0;
        this.rotMat[15] = 1.0;
	}
    if (keyPressed.indexOf(40) != -1) {
        this.xRotation -= 0.1;
        this.rotMat[0] = 1.0;
        this.rotMat[1] = 0.0;
        this.rotMat[2] = 0.0;
        this.rotMat[3] = 0.0;
        this.rotMat[4] = 0.0;
        this.rotMat[5] = Math.cos(this.xRotation);
        this.rotMat[6] = Math.sin(this.xRotation);
        this.rotMat[7] = 0.0;
        this.rotMat[8] = 0.0;
        this.rotMat[9] = -Math.sin(this.xRotation);
        this.rotMat[10] = Math.cos(this.xRotation);
        this.rotMat[11] = 0.0;
        this.rotMat[12] = 0.0;
        this.rotMat[13] = 0.0;
        this.rotMat[14] = 0.0;
        this.rotMat[15] = 1.0;
	}

    if (keyPressed.indexOf(37) != -1) {
        this.trans[14] += 0.1;
	}
    if (keyPressed.indexOf(39) != -1) {
        this.trans[14] -= 0.1;
	}
}

Cube.prototype.draw = function (){
    mvMatrix = [ 1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, 0.0, 1.0 ];
    var mvMatrix2 = [];
    multiply(mvMatrix,this.rotMat,mvMatrix2);
    mvMatrix = mvMatrix2;
    multiply(mvMatrix, this.trans,  mvMatrix2);
    mvMatrix = mvMatrix2;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.Cube_Face1);
    gl.uniform1i(samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1, 1, 1, 1);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

Cube.prototype.handleLoadedTexture = function (texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Cube.prototype.initTexture = function() {
	this.Cube_Face1 = this.loadTexture("images/cube_face1.png");
}

Cube.prototype.loadTexture = function(imagePath) {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Cube.prototype.handleLoadedTexture(texture);
	}

	texture.image.src = imagePath;
	return texture;
}
