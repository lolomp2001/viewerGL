var canvas;
var gl;
var shaderProgram;
var resolutionLocation;
var textureLocation;
var samplerUniform;
var keyPressed = [];
var drawCount = 0;
var mvMatrix;
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

    mvMatrix = [ 1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, 0.0, 1.0 ];
    var n = 0.1;
    var scale = Math.tan(90 * 0.5 * Math.PI / 180) * n;
    var r = (canvas.width/canvas.height) * scale;
    var l = -r;
    var t = scale;
    var b = -t;
    var f = 100;
    pMatrix = [2 * n / (r - l),0.0,0.0,0.0,
               0.0,2 * n / (t - b),0.0,0.0,
               (r + l) / (r - l),(t + b) / (t - b),-(f + n) / (f - n), -1	,
               -0.0,0.0,-2 * f * n / (f - n),0.0];

	initWebGL(canvas); // Initialise le contexte WebGL

	// Continue seulement si le WebGL est disponible et est en train de fonctionner

	if (gl) {

		// Initialize the shaders; this is where all the lighting for the
		// vertices and so forth is established.

		initShaders();
		
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
        
		gl.clearDepth(1);
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
			
			else if (evt.keyCode == 70) {
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
		gl = canvas.getContext("webgl")	|| canvas.getContext("experimental-webgl");
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
	
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform3f(resolutionLocation, gl.viewportHeight, gl.viewportHeight, gl.viewportHeight);
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

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

function multiply(a, b, m) {
    var k=0;
    for (var i=0; i<4; i++) {
        for (var j=0; j<4; j++) {
            m[k] = a[i*4]*b[j] + a[i*4+1]*b[4+j] + a[i*4+2]*b[8+j] + a[i*4+3]*b[12+j];
            k++;
        }
    }
  return m;
}

function resize() {
	var canvas = document.getElementById("viewerGL");

	if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.left = 0 + "px";
		canvas.style.top = 0 + "px";
	}
	
	else {
		canvas.width=0.9*window.innerWidth;
		canvas.height=0.9*window.innerHeight;
		canvas.style.left = 0.08*window.innerWidth/2 +"px";
		canvas.style.top = 0.08*window.innerHeight/2 +"px";
	}
	
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
}
