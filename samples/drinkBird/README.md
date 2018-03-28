drinkBirdModel
==============

Drinking bird model using three.js

To use the drinkBird.js file:

<pre>var bird = new DrinkBird(true, true);   //pass in hasHair and hasBowTie    
bird.bowTieColor = "0xff00aa";          //optional - set the colors before calling createBird   
bird.createBird();                	    //creates THREE.Object3D, store in model property
  
scene.add(bird.model);                  
</pre>

To run the example bird.html file you will also need : 

<ul>
<li>web browser that supports WebGL (http://get.webgl.org/)</li>
<li>three.js  (get from https://github.com/mrdoob/three.js or http://threejs.org/) </li>
<li>Coordinates.js (get from Udacity cs291 course: https://github.com/udacity/cs291 --see the lib dir) </li>
<li>OrbitAndPanControlsYann.js (using another student's fix), OR OrbitAndPanControls.js (from
  https://github.com/udacity/cs291) if you are using an earlier version of three.js
</li>
<li>tubeTry.js (to create the neck clamp, else comment out code and use the cylinder)</li>
<li>drinkBird.js 
</ul>

In the html file be sure to change the javascript references to point to the right locations.
