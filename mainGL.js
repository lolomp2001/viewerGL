var canvas;
var gl;
var shaderProgram;
var resolutionLocation;
var textureLocation;
var samplerUniform;
var keyPressed = [];
var drawCount = 0;
var pMatrix;

function startGameGL() {
	document.documentElement.style.overflow = 'hidden';
	window.addEventListener('resize', resize, false);
	
	canvas = document.getElementById("viewerGL");
	
	canvas.width=1920;
	canvas.height=1080;
	canvas.style.left = 0.08*window.innerWidth/2 +"px";
	canvas.style.top = 0.08*window.innerHeight/2 +"px";
	canvas.style.position = "relative";
	canvas.style.cursor = "none";
	
	canvas.initialWidth = canvas.width;
	canvas.initialHeight = canvas.height;

    var n = 0.1;
    var scale = Math.tan(90 * 0.5 * Math.PI / 180) * n;
    var r = (canvas.width/canvas.height) * scale;
    var l = -r;
    var t = scale;
    var b = -t;
    var f = 100;

    pMatrix = [2 * n / (r - l),0.0,0.0,0.0,
               0.0,2 * n / (t - b),0.0,0.0,
               (r + l) / (r - l),(t + b) / (t - b),-(f + n) / (f - n), -1,
               -0.0,0.0,-2 * f * n / (f - n),0.0];

	initWebGL(canvas); // Initialise le contexte WebGL

	// Continue seulement si le WebGL est disponible et est en train de fonctionner

	if (gl) {

		// Initialize the shaders; this is where all the lighting for the
		// vertices and so forth is established.

		initShaders();
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
		gl.clearDepth(1);
        gl.depthFunc(gl.LESS);
		gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

		var viewerGL = new ViewerGL();
		
		window.addEventListener('keydown', function (evt) {

			if (evt.keyCode == 37 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}

            if (evt.keyCode == 38 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}

            if (evt.keyCode == 39 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}
		
			if (evt.keyCode == 40 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}

            if (evt.keyCode == 107 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}

            if (evt.keyCode == 109 && keyPressed.indexOf(evt.keyCode) == -1) {
				this.keyPressed.push(evt.keyCode);
			}
			
			if (evt.keyCode == 70) {
				var div = document.getElementById("divFullScreen");
                
				if (div.requestFullscreen) {
					div.requestFullscreen();
					
				}
				
				else if (div.mozRequestFullScreen) {
					div.mozRequestFullScreen();
				}

				else if (div.webkitRequestFullScreen) {
					div.webkitRequestFullscreen();
				}
			}
		}, false);
		
		window.addEventListener('keyup', function (evt) {
			if (evt.keyCode == 37) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

			if (evt.keyCode == 38) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

			if (evt.keyCode == 39) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

			if (evt.keyCode == 40) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

            if (evt.keyCode == 70) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

            if (evt.keyCode == 107) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}

            if (evt.keyCode == 109) {
				this.keyPressed.splice(keyPressed.indexOf(evt.keyCode),1);
			}
		}, false);

		//set resolution fit to browser
		resize();
		
		// Set up to draw the scene periodically.
		setInterval(function(){drawCount += 1; viewerGL.run();}, 1000/GAME_FPS);
	}
}

function initWebGL(canvas) {
	// Initialise la variable gloable gl à null
	gl = null;

	try {
		// Essaye de récupérer le contexte standard. En cas d'échec, il teste l'appel experimental
		gl = canvas.getContext("webgl", { premultipliedAlpha: false })	|| canvas.getContext("experimental-webgl", { premultipliedAlpha: false });
		gl.viewportWidth = canvas.width;
	    gl.viewportHeight = canvas.height;
	} catch (e) {
	}

	// Si le contexte GL n'est pas récupéré, on l'indique à l'utilisateur.
	if (!gl) {
		alert("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.");
	}
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// Créer le programme shader

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	// Faire une alerte si le chargement du shader échoue

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Impossible d'initialiser le shader.");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,	"a_position");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "a_normal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "a_textCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");

    gl.uniform3fv(shaderProgram.lightingDirectionUniform, [0.0, 0.0, 1.0]);

	textureLocation = gl.getUniformLocation(shaderProgram, "u_textureSize");
	
	samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function getShader(gl, id) {
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);

	if (!shaderScript) {
		return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;

	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}

	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		// type de shader inconnu
		return null;
	}
	gl.shaderSource(shader, theSource);

	// Compile le programme shader
	gl.compileShader(shader);

	// Vérifie si la compilation s'est bien déroulée
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Une erreur est survenue au cours de la compilation des shaders: "
				+ gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function multiply(a, b) {
    var m = [];
    var k=0;
    for (var j=0; j<4; j++) {
        for (var i=0; i<4; i++) {
            m[k] = a[i*4]*b[j] + a[i*4+1]*b[4+j] + a[i*4+2]*b[8+j] + a[i*4+3]*b[12+j];
            k++;
        }
    }
  return m;
}

function inverse(mat, dest) {
	if(!dest) { dest = mat; }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;
	
	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
	
	dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
	dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
	dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
	dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
	dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
	dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
	dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
	dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
	dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
	dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
	dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
	dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
	dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
	dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
	dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
	dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
	
	return dest;
};

function transpose(mat, dest) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if(!dest || mat == dest) { 
		var a01 = mat[1], a02 = mat[2], a03 = mat[3];
		var a12 = mat[6], a13 = mat[7];
		var a23 = mat[11];
		
		mat[1] = mat[4];
		mat[2] = mat[8];
		mat[3] = mat[12];
		mat[4] = a01;
		mat[6] = mat[9];
		mat[7] = mat[13];
		mat[8] = a02;
		mat[9] = a12;
		mat[11] = mat[14];
		mat[12] = a03;
		mat[13] = a13;
		mat[14] = a23;
		return mat;
	}
	
	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
};

function resize() {
	var canvas = document.getElementById("viewerGL");
    
	if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.left = 0 + "px";
		canvas.style.top = 0 + "px";
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
	}
	
	else {
		canvas.width=0.9*window.innerWidth;
		canvas.height=0.9*window.innerHeight;
		canvas.style.left = 0.08*window.innerWidth/2 +"px";
		canvas.style.top = 0.08*window.innerHeight/2 +"px";
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
	}
	
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
}
