
function Tube(rTop, rBottom, rTopIn, rBottomIn, height, rSegments, hSegments, capTop, capBottom) {

	this.rTop = rTop;
	this.rBottom = rBottom;
	this.rTopIn = rTopIn;
	this.rBottomIn = rBottomIn;
	this.height = height;
	
	//set defaults for optional arguments
	this.rSegments = rSegments === undefined ? 32 : rSegments;
	this.hSegments = hSegments === undefined ? 2 : hSegments;
	this.capTop = (capTop === undefined) ? true : capTop;
	this.capBottom = (capBottom === undefined) ? true : capBottom;
 
	var tubeGeo = new THREE.CylinderGeometry(rTop, rBottom, height, this.rSegments, this.hSegments, true);
	
	if (rTop <= rTopIn || rBottom <= rBottomIn) {
		var msg = "Please check that the outer radius is greater than inner radius";
		console.error(msg);
		return null;
	}	
	
	//do inner wall
	var wallBase = new THREE.Geometry();
	/*
	for (var i = 0; i < this.rSegments; i++) {
		
		var theta = i * 2 * Math.PI / this.rSegments;	
		var thetaNext = (i+1) * 2 * Math.PI / this.rSegments;	

		var inWallGeo = new THREE.Geometry();

		var t1 = new THREE.Vector3(rTopIn * Math.cos(theta), height/2, rTopIn * Math.sin(theta));
		var t2 = new THREE.Vector3(rTopIn * Math.cos(thetaNext), height/2, rTopIn * Math.sin(thetaNext));
		var b1 = new THREE.Vector3(rBottomIn * Math.cos(theta), -height/2,rBottomIn * Math.sin(theta));
		var b2 = new THREE.Vector3(rBottomIn * Math.cos(thetaNext), -height/2,rBottomIn * Math.sin(thetaNext));
		
		//console.log("t1 :" + t1.x + ", " + t1.y + ", " + t1.z);
		//console.log("t2 :" + t2.x + ", " + t2.y + ", " + t2.z);
		//console.log("b1 :" + b1.x + ", " + b1.y + ", " + b1.z);
		//console.log("b2 :" + b2.x + ", " + b2.y + ", " + b2.z);
		
		
		inWallGeo.vertices.push(t1);
		inWallGeo.vertices.push(b1);
		inWallGeo.vertices.push(b2);
		inWallGeo.vertices.push(t2);
		
		inWallGeo.faces.push(new THREE.Face4(0,1,2,3));
		inWallGeo.computeFaceNormals();
		inWallGeo.computeVertexNormals();
		
		THREE.GeometryUtils.merge(wallBase, inWallGeo);
				
		for (var j = 0; j < this.hSegments; j++) {
		
			var yTop = height / this.hSegments * j;
			var yBottom = height / this.hSegments * (j + 1);
			
			//console.log(j + ":ytopand ybottom:" + yTop + " " + yBottom);
			
		}
	}
	
		
	THREE.GeometryUtils.merge(tubeGeo, wallBase);
	*/
	
	
	var inWallGeo = new THREE.CylinderGeometry(rTopIn, rBottomIn, height, this.rSegments, this.hSegments, true);
	var vertTotal = inWallGeo.vertices.length;
	
	//console.log("inWallGeo vert:" + inWallGeo.vertices.length);
	//console.log("inWallGeo faces:" + inWallGeo.faces.length);
	//console.log("inWallGeo normals:" + inWallGeo.normals.length);
	
	inWallGeo.dynamic = true;
	
	for (var i=0;i < inWallGeo.vertices.length; i++) {
		inWallGeo.vertices[i].x *= -1;
	}
	
	//trying to change the normals doesn't seem to do anything	
	/*	
	for (var i = 0; i < inWallGeo.faces.length; i++) {
		//console.log(i + " normal (x,y,z)" + inWallGeo.faces[i].normal.x +", " + inWallGeo.faces[i].normal.y + ", "+ inWallGeo.faces[i].normal.z);
		inWallGeo.faces[i].normal.x *= -1;
		inWallGeo.faces[i].normal.y *= -1;	
		inWallGeo.faces[i].normal.z *= -1;		
		//console.log(i + " normal after(x,y,z)" + inWallGeo.faces[i].normal.x +", " + inWallGeo.faces[i].normal.y + ", "+ inWallGeo.faces[i].normal.z);
	};	
	*/
	
	inWallGeo.computeFaceNormals();
	inWallGeo.computeVertexNormals();
	
	
	THREE.GeometryUtils.merge(tubeGeo, inWallGeo);
	

	var yTop = height / 2;
	
	//make the top and bottom caps
	
	for (var i = 0; i < this.rSegments && (this.capTop || this.capBottom) ; i++) {
		var topCapGeo = new THREE.Geometry();
		var bottomCapGeo = new THREE.Geometry();
		
		//console.log(i + " of "  + rSegments);

		var theta = i * 2 * Math.PI / this.rSegments;	
		var thetaNext = (i+1) * 2 * Math.PI / this.rSegments;	

		if (this.capTop) {	
			//topCap
			var outerPtPrev = new THREE.Vector3(rTop * Math.cos(theta), yTop, rTop * Math.sin(theta));
			var innerPtPrev = new THREE.Vector3(rTopIn * Math.cos(theta), yTop, rTopIn * Math.sin(theta));	
			var outerPt = new THREE.Vector3(rTop * Math.cos(thetaNext), yTop, rTop * Math.sin(thetaNext));
			var innerPt = new THREE.Vector3(rTopIn * Math.cos(thetaNext), yTop, rTopIn * Math.sin(thetaNext));
		

			//console.log("outerPtPrev:" + outerPtPrev.x + " " + outerPtPrev.z);
			//console.log("outerPt:" + outerPt.x + " " + outerPt.z);
			//console.log("innerPtPrev:" + innerPtPrev.x + " " + innerPtPrev.z);
			//console.log("innerPt:" + innerPt.x + " " + innerPt.z);
	
			topCapGeo.vertices.push(innerPtPrev);
			topCapGeo.vertices.push(outerPtPrev);
			topCapGeo.vertices.push(outerPt);
			topCapGeo.vertices.push(innerPt);
			
			topCapGeo.faces.push(new THREE.Face4(3,2,1,0));		
			topCapGeo.computeFaceNormals();
			THREE.GeometryUtils.merge(tubeGeo, topCapGeo);
		}


		if (this.capBottom) {
			
			//bottom cap
			outerPtPrev = new THREE.Vector3(rBottom * Math.cos(theta), -yTop, rBottom * Math.sin(theta));
			innerPtPrev = new THREE.Vector3(rBottomIn * Math.cos(theta), -yTop, rBottomIn * Math.sin(theta));	
			outerPt = new THREE.Vector3(rBottom * Math.cos(thetaNext), -yTop, rBottom * Math.sin(thetaNext));
			innerPt = new THREE.Vector3(rBottomIn * Math.cos(thetaNext), -yTop, rBottomIn * Math.sin(thetaNext));
			
		
			bottomCapGeo.vertices.push(innerPtPrev);
			bottomCapGeo.vertices.push(outerPtPrev);
			bottomCapGeo.vertices.push(outerPt);
			bottomCapGeo.vertices.push(innerPt);		
		
			bottomCapGeo.faces.push(new THREE.Face4(0,1,2,3));
			bottomCapGeo.computeFaceNormals();
			THREE.GeometryUtils.merge(tubeGeo, bottomCapGeo);
	
		}
	}


	
	return tubeGeo;
}

