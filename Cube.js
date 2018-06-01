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
    this.yRotation = 0;
    this.xTranslation = 0;
    this.rotMatX = [];
    this.rotMatY = [];
    this.trans = [];
}

Cube.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	var vertices1 = [ -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,

                     -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,

                     -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,

                     CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,

                     -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,

                    CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2,
	                 -CUBE_EDGE_WIDTH/2, -CUBE_EDGE_WIDTH/2, CUBE_EDGE_WIDTH/2 ];

	this.squareVerticesBuffer.itemSize = 3;
	this.squareVerticesBuffer.numItems = 24;

	this.squareVerticesTextCoorBuffer = gl.createBuffer();

	var textCoord = [ 0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,

                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,

                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,

                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,

                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0,
                      
                      0.0, 0.0, 
                      0.0, 1.0,
                      1.0, 1.0,
                      1.0, 0.0 ];

	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 24;

	this.squareVerticesIndexBuffer = gl.createBuffer();
	var indices = [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23 ];
	this.squareVerticesIndexBuffer.numItems = 36;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);

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

Cube.prototype.initPosition = function (xInitPos, yInitPos, zInitPos) {
	this.absXCurrentPos = xInitPos;
	this.absYCurrentPos = yInitPos;
	this.absZCurrentPos = zInitPos;
}


Cube.prototype.updatePosition = function (){
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

Cube.prototype.draw = function (){
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
	gl.bindTexture(gl.TEXTURE_2D, this.Cube_Face1);
    gl.uniform1i(samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 1.0, 1.0, 1.0);

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
