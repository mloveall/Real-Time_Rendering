/*
 * Written by Mitchell Loveall.
 * Please let me know if you want to use this source code at
 * somewhere else.
 */

/**
 * This file contains functions that are used to create empty
 * canvas, apply shaders, and randomly generate the fractal
 * tree on the created canvas.
 */
 
// canvas and webGL
var canvas, gl;

// shaders
var spr;

function initFractalTree() {
	glInit();

	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    // Load shaders and initialize attribute buffers
    spr = initShaders( gl, "fractaltree-vertex-shader", "fractaltree-fragment-shader" );
    gl.useProgram( spr );

	glResize();
}

function clearCanvas() {
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
}

function glInit() {
	// init webgl context
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("experimental-webgl");

	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.lineWidth(1);
	gl.enable(gl.DEPTH_TEST);

	// add event listeners
	window.addEventListener('resize', glResize, false);
}

function glResize() {
	// resize canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// reset viewport
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	// reset projection matrix
	gl.useProgram(spr);
}

var deg_to_rad = Math.PI / 180.0;

function glRenderFractalTree() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(spr);
	
	var node = [0, -1];

    fractalTree(node, 90, Math.floor(Math.random()*(10-5+1)+5));
}

function fractalTree(start, angle, depth) {
	// Find the ending vertices
	var end = [0, 0];
	end[0] = start[0] + (Math.cos(angle * deg_to_rad) * depth * 0.03);
	end[1] = start[1] + (Math.sin(angle * deg_to_rad) * depth * 0.03);

	var vertices = new Float32Array([
       start[0], start[1],   end[0], end[1]
    ]);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( spr, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	gl.drawArrays( gl.LINE_STRIP, 0, 2 );

	depth--;
	
	// Use recursion to expand the branches
	if (depth == 0)
		return;
	else
	{
		angle -= Math.floor(Math.random()*(15-5+1)+5);
		fractalTree(end, angle, depth);
		angle += Math.floor(Math.random()*(25-15+1)+15);
		fractalTree(end, angle, depth);
	}
}

// Browser-independent requestAnimationFrame
window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback, element)
		{window.setTimeout(callback, 1000/60);};
}) ();

;
