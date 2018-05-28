function ViewerGL() {
    this.cube = new Cube();
    this.cube.initMesh();
    this.cube.initPosition(0, 0, 0);
}

ViewerGL.prototype.run = function (){
    this.update();
    this.draw();
}

ViewerGL.prototype.update = function (){
    this.cube.updatePosition();
}

ViewerGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.cube.draw();
}
