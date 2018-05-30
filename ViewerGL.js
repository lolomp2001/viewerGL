function ViewerGL() {
    this.obj = new Obj();
    this.obj.loadObjFile();
    this.obj.initPosition(0, 0, 0);
}

ViewerGL.prototype.run = function (){
    this.update();
    this.draw();
}

ViewerGL.prototype.update = function (){
    this.obj.updatePosition();
}

ViewerGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.obj.draw();
}
