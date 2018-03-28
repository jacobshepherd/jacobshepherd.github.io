/*
@author: Robert Koch
@date: 03/12/2015

 http://www.htmlgoodies.com/html5/javascript/calling-parent-methods-in-javascript.html#fbid=AI09OeFNmQ6
*/

var camera,
	controls,
	scene,
	renderer,
	stats,
	particles,
	running = false,
	gui,
	text,
	current = 0,
	axes,
	activeMesh,
	particleMesh;


var raycaster = new THREE.Raycaster();
var caster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var container = document.getElementById( 'container' );
var geometry = new THREE.SphereGeometry( 1, 20, 20 );

function onMouseMove(event){
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// define the geometry and material for the electron


var electronGeometry = new THREE.SphereGeometry(1, 20, 20 );
var electronMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
var electronMaterial1 = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});

// define the geometry and material for the electron
var protonGeometry = new THREE.SphereGeometry(1, 20, 20 );
var protonMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});


function Particle(){
	particles.push(this);
	text.nParticles += 1;
	gui.__controllers[1].updateDisplay();
	this.mass = 1;
	this.force =  new THREE.Vector3(0, 0, 0);
	this.acceleration = new THREE.Vector3(0 ,0, 0);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.displacement = new THREE.Vector3(0, 0, 0);
	this.tempForce = new THREE.Vector3(0, 0, 0);
	this.x = new THREE.Vector3(0, 0, 0);
	this.f = new THREE.Vector3(0, 0, 0);
	this.trail = [];
	this.updateForce = function(){
		this.tempForce.set(0, 0, 0);
		var scaleDistance;
		var unitDistance = new THREE.Vector3();
		for (var i=0; i < particles.length; i++){
			if (this === particles[i]){
			}
			else{
				unitDistance.subVectors(this.mesh.position, particles[i].mesh.position);
				unitDistance.normalize();
				scaleDistance = (this.charge*particles[i].charge)/this.mesh.position.distanceToSquared(particles[i].mesh.position);
				this.tempForce.add(unitDistance.multiplyScalar(scaleDistance));
			}
		}
		this.force = this.tempForce;
	};
	this.updatePosition = function(deltaT){
		this.updateForce();

		this.acceleration = this.force.divideScalar(this.mass);
		this.displacement.addVectors(this.velocity.multiplyScalar(deltaT), this.acceleration.multiplyScalar(0.5*Math.pow(deltaT, 2)));
		////console.log(this.displacement);
		this.velocity.addScaledVector(this.acceleration, deltaT);
		this.collision();
		if (this.displacement.length() > 1){
		}
		this.f.copy(this.force);
		this.forceArrow.setDirection(this.f.normalize());
		this.forceArrow.setLength(this.f.length()+1);

		this.x.copy(this.displacement);
		this.displacementArrow.setDirection(this.x.normalize());
		this.displacementArrow.setLength(this.x.length()+1);
	};
	this.setPosition = function(){
		this.mesh.position.add(this.displacement);
		this.forceArrow.position.copy(this.mesh.position);
		this.displacementArrow.position.copy(this.mesh.position);
	};
	this.collision = function(){
	};
	this.forceArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 1, 0xffff00 );
	this.displacementArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 1, 0x00ffff );
	scene.add(this.forceArrow);
	scene.add(this.displacementArrow);
	this.makeTrail = function(color){
		var t;
		for (var i = 0; i < 10; i++){
			t = new THREE.Mesh(
				geometry,
				new THREE.MeshBasicMaterial({color: color, wireframe: true})
			);
			this.trail.push(t);
			scene.add(t);
			t.position.copy(this.mesh.position)
		}

	};
	this.removeTrail = function(){
		for (var i = 0; i < this.trail.length; i++){
			scene.remove(this.trail[i]);
		}
	};
	this.updateTrail = function(){
		var t = this.trail.shift();
		t.position.copy(this.mesh.position);
		this.trail.push(t);
		for (var i = 0; i < this.trail.length; i++){

		}

	};


}


function Electron(x, y, z){
	Particle.call(this);
	this.mesh = new THREE.Mesh(electronGeometry, new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true} ));
	scene.add(this.mesh);
	particleMesh.push(this.mesh);
	this.mesh.position.set(x, y, z);
	this.charge = -1;
    this.setDefaultColor = function(){
        this.mesh.material.color.set(0x0000ff);
    };
}

function Proton(x, y, z){
	Particle.call(this);
	this.mesh = new THREE.Mesh(protonGeometry, new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} ));
	scene.add(this.mesh);
	particleMesh.push(this.mesh);
	this.mesh.position.set(x, y, z);
	this.charge = 1;
    this.setDefaultColor = function(){
        this.mesh.material.color.set(0x00ff00);
    };
}

init();

window.addEventListener('mousemove', onMouseMove, false);

var FizzyText = function() {
	this.message = 'dat.gui';
	this.nParticles = 0;
	this.speed = 1;
	this.step = 1;
	this.showTrail = false;
	this.pause = true;
	this.randomParticles = function(){
		randomParticles(100);
	};
	this.ProtonBlock = function(){
		protonBlock(3);
	};
	this.ElectronBlock = function(){
		ElectronBlock(3);
	};
	this.pattern = function(){
		pattern();
	};
	this.run = function(){
		run(this.step);
	};
	this.reset = function(){
		reset();
	};
};

window.onload = function() {
	text = new FizzyText();
	gui = new dat.GUI();
	gui.add(text, 'message');
	gui.add(text, 'nParticles');
	var speed = gui.add(text, 'speed').min(1).step(1).max(50);
	var step = gui.add(text, 'step').min(-3).step(0.1).max(3);
	gui.add(text, 'showTrail');
	gui.add(text, 'pause');
	gui.add(text, 'randomParticles');
	gui.add(text, 'ProtonBlock');
	gui.add(text, 'ElectronBlock');
	gui.add(text, 'pattern');
	gui.add(text, 'run');
	gui.add(text, 'reset');


	startRun(speed, step);

	//window.addEventListener("dblclick", function(){alert('hai')});


	animate();
};

function startRun(speed, step){
	var stepVal = 1;
	var speedVal = 1;
	var interval = window.setInterval(function(){
		if (!text.pause){
			run(stepVal);
		}
	}, speedVal);
	speed.onChange(function(value) {
		speedVal = value;
		clearInterval(interval);
		interval = window.setInterval(function(){
			if (!text.pause){
				run(stepVal);
			}
		}, speedVal);
	});
	step.onChange(function(value) {
		stepVal = value;
		clearInterval(interval);
		interval = window.setInterval(function(){
			if (!text.pause){
				run(stepVal);
			}
		}, speedVal);
	});

}

function init() {

	//create a scene, can add parameters
	scene = new THREE.Scene();

	//creates a WebGLRenderer to render on the screen the scene
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );



	//defines a div container for the renderer
	container.appendChild( renderer.domElement );

	//creates a new viewpoint camera that will be what the screen displays to the user.
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 100;
	camera.position.y = 100;
	camera.position.x = 100;

	THREEx.WindowResize(renderer, camera);

	//Creates a way of controlling the camera using the orbit controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;

	setup();



	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );


	window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('dblclick', objectClick, false);

	axes = buildAxes();
	scene.add(axes);


	//buildWalls();




}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	stats.update();
	render();
	requestAnimationFrame(animate);
}

function render() {
	renderer.render( scene, camera );
}

function setup(){
	particles = [];
	particleMesh = [];
}

function pattern(){
	new Electron(-15, 0, 0);
	new Electron(15, 0, 0);
	new Proton(0, 5, 0);
	new Proton(2, 5, 2);
	new Proton(-2, 5, -2);
}

function protonBlock(v){
	for (var j = 0; j < v; j++){
		for (var k = 0; k < v; k++){
			for (var l = 0; l < v; l++){
				particles.push(new Proton(2*j+2, 2*k+2, 2*l+2));
			}
		}
	}
}

function ElectronBlock(v){
	for (var j = 0; j < v; j++){
		for (var k = 0; k < v; k++){
			for (var l = 0; l < v; l++){
				particles.push(new Electron(-2*j-2, -2*k-2, -2*l-2));
			}
		}
	}
}


function randomParticles(t){
	for (var i = 0; i < t; i++){
		if (randInteger(t) > 0){
			particles.push(new Electron(randInteger(t), randInteger(t), randInteger(t)))
		}
		else{
			particles.push(new Proton(randInteger(t), randInteger(t), randInteger(t)))
		}
	}
}

function randInteger(x){
	return Math.round(Math.random()*(2*x)-x)
}

function run(step){

	for (var i=0; i<particles.length; i++){
		particles[i].updatePosition(step);
	}
	for (var j=0; j<particles.length; j++){
		particles[j].setPosition();
	}
}

function cameraReset(){
	if (activeMesh){
		activeMesh.remove(camera);
	}
	camera.position.z = 100;
	camera.position.y = 100;
	camera.position.x = 100;
}

function reset(){
	cameraReset();

	for (var i=0; i<particles.length; i++){
		particles[i].removeTrail();
		scene.remove(particles[i].displacementArrow);
		scene.remove(particles[i].forceArrow);
		scene.remove(particles[i].mesh);


	}
	text.nParticles = 0;
	gui.__controllers[1].updateDisplay();

	setup();
}


function buildAxes() {
	var axes = new THREE.Object3D();
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -100, 0, 0 ), 0x800000, true) ); // -X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 100, 0 ), 0x00FF00, false ) ); // +Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -100, 0 ), 0x008000, true ) ); // -Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 100 ), 0x0000FF, false ) ); // +Z
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -100 ), 0x000080, true ) ); // -Z
	return axes;
}

function buildAxis( src, dst, colorHex, dashed ) {
	var geom = new THREE.Geometry(),
		mat;

	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
	} else {
		mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
	}

	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );

	return new THREE.Line( geom, mat );
}

function objectClick(){
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( particleMesh );

	if (intersects.length > 0){
		for (var j = 0; j < particles.length; j++){
			particles[j].setDefaultColor();
		}

		intersects[0].object.material.color.set( 0xff0000 );
		cameraFocus(intersects[0].object);
	}
}

function cameraFocus(particle){
	if (activeMesh){
		activeMesh.remove(camera);
	}
	particle.add(camera);
	activeMesh = particle;

}

function buildWalls(){
	var geometry = new THREE.BoxGeometry( 200, 200, 1 );
	var material = new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe: true} );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	//console.log(cube);
}
