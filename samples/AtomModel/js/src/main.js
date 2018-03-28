var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();


function init()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("body").append(renderer.domElement);
    
    camera.position.z = 100;
    
    var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
    var material = new THREE.MeshLambertMaterial( {color: 0xff0000} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    console.log(scene.children);

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 100 );

    scene.add(spotLight);
    
    for(var i = 0; i < 4; i++)
    {
        var geometry1 = new THREE.SphereBufferGeometry( 2, 32, 32 );
        var material1 = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
        var sphere1 = new THREE.Mesh( geometry1, material1 );
        sphere1.position.x = 10;
        scene.add( sphere1 );
    }
    
    renderer.render(scene, camera);
}

var angle = 0;
var y = 10;
var flag = false;

var update = function()
{
    requestAnimationFrame(update);

    r = 10;
   
    
    scene.children[5].position.y = 10*Math.sin(angle);
    scene.children[5].position.x = 10*Math.cos(angle);
    
    scene.children[4].position.x = 10*Math.sin(angle);
    scene.children[4].position.z = 10*Math.cos(angle);
    
    scene.children[3].position.y = 10*Math.sin(Math.PI/180*90);
    scene.children[3].position.x = 10*Math.cos(Math.PI/180*90);
    
    scene.children[3].position.z = 10*Math.sin(angle);
    scene.children[3].position.y = 10*Math.cos(angle);
    
    
   
    scene.children[2].position.x = 10*Math.sin(angle);
    scene.children[2].position.y = 10*Math.cos(angle);
    
    console.log(flag);
    
    angle += Math.PI/180*3;
    
    renderer.render(scene, camera);
    
};

init();

update();