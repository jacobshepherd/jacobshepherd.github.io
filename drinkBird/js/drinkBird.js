/*
* example use:
* var bird1 = new DrinkBird(true, true);
* bird1.bowTieColor = "0xdd00dd";
*	bird1.createBird();
*	scene.add(bird1.model);
*/


//the drinking bird

function DrinkBird(hasHair, hasBowTie) {
  
	this.hasHair = hasHair;
	this.hasBowTie = hasBowTie;	
	this.bowTieColor = "0x55EE00";
	
	this.waterColor = "0x00AAFF";	
	this.headColor = "0x336FB3";
	this.featherColor1 = "0x330066";
	this.featherColor2 = "0x336FB3";
	this.featherColor3 = "0x33ddff";
	this.tailColor1 = "0x336FB3";
	this.tailColor2 = "0x33ddff";
	this.hipColor1 = "0xDDDDDD";
	this.hipColor2 = "0x336FB3";
	
	this.model = null;
}

DrinkBird.prototype.createEyes = function(pupilSize, eyeSize, eyeSpacing) {
	var mat1 = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.FrontSide});
	var mat2 = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.FrontSide});
	var mat3 = new THREE.MeshLambertMaterial({color: 0x5587C0, side: THREE.FrontSide});		//eyelid material

	
	var sg1 = new THREE.SphereGeometry(eyeSize, 8, 8, 0, Math.PI * 2, 0, Math.PI);		//white part
	var sg2 = new THREE.SphereGeometry(pupilSize, 8, 8, 0, Math.PI, 0, Math.PI);		//pupil						
	//var sg3 = new THREE.SphereGeometry(eyeSize + 2, 8, 8, 0, Math.PI, 0,  Math.PI / 2);	//eyelid					
	var sg3 = new THREE.SphereGeometry(eyeSize + 2, 8, 8, 0, Math.PI * 2, 0,  Math.PI / 2);	//eyelid					
	
	
	var lfEye = new THREE.Object3D();
	var rtEye = new THREE.Object3D();			
			
	for (var i = 0; i < 2; i++) {
		var sclera = new THREE.Mesh(sg1, mat1);
		var pupil = new THREE.Mesh(sg2, mat2);
		var eyelid = new THREE.Mesh(sg3, mat3);
		pupil.position.z = eyeSize - 2;	
		eyelid.position.y =  3;
		eyelid.rotation.x = -10 * Math.PI / 180;
		
		if (i == 0) {
			lfEye.add(sclera);
			lfEye.add(pupil);
			lfEye.add(eyelid);
			
		} else {
			rtEye.add(sclera);
			rtEye.add(pupil);
			rtEye.add(eyelid);	
		}
	}
	
	
	lfEye.position.x = -1 * eyeSpacing / 2;
	rtEye.position.x = eyeSpacing/2;
	lfEye.rotation.y = -20 * Math.PI / 180;
	rtEye.rotation.y = 20 * Math.PI / 180;
	
	var eyePair = new THREE.Object3D();
	eyePair.add(lfEye);
	eyePair.add(rtEye);
	
	return eyePair;
	
}

DrinkBird.prototype.createBeak = function(ubLen, lbLen, beakRadius) {
	var cGeo1 = new THREE.CylinderGeometry(beakRadius, 2, ubLen, rSeg, 4, false);
	var cGeo2 = new THREE.CylinderGeometry(beakRadius, 2, lbLen, rSeg, 4, false);
	
	var cMat = new THREE.MeshLambertMaterial({color: 0xdddd00, side:THREE.FrontSide});
	
	var upBeak = new THREE.Mesh(cGeo1, cMat);
	var lowBeak = new THREE.Mesh(cGeo2, cMat);
	
	upBeak.scale.z = 0.8;
	upBeak.rotation.x = -90 * Math.PI / 180;
		
	lowBeak.scale.z = 0.5;
	lowBeak.rotation.x = -70 * Math.PI / 180;
	lowBeak.position.z = (ubLen - lbLen) / 2 * -1;
	lowBeak.position.y = -1 * (beakRadius * lowBeak.scale.z);	
	
	var beak = new THREE.Object3D();
	beak.add(upBeak);
	beak.add(lowBeak);

	return beak;	
}



DrinkBird.prototype.createHead = function(headRadius,headMaterial) {
		var hGeo = new THREE.SphereGeometry(headRadius, rSeg, rSeg);
			
		var headBase = new THREE.Mesh(hGeo, headMaterial);		
		
		var head = new THREE.Object3D();
		
		
		//making the eyes
		var pupilSize = 5;
		var eyeSize = 8;	
		var eyeSpacing = 35;
		var eyes = this.createEyes(pupilSize, eyeSize, eyeSpacing);
		eyes.position.z = headRadius - eyeSize;
		eyes.position.y = headRadius / 4;
		
			
		//making the beak;
		var upperBeakLen = 45;
		var lowerBeakLen = 25;
		var beakRadius = 15;
	
		var beak = this.createBeak(upperBeakLen, lowerBeakLen, beakRadius);
		beak.position.z = headRadius + (upperBeakLen / 2) - 5;
		beak.position.y = -(headRadius / 3);
		beak.rotation.x = 10 * Math.PI / 180;
		
		
		//add components to head
		head.add(headBase);
		head.add(eyes);
		head.add(beak);
		
		
		if (this.hasHair) {
		
			//decorations for the head
			var hairLen = 15;
			//var hairGeo = new THREE.CylinderGeometry(8, 5, hairLen, rSeg);
			var numHair = 7;
			var hairSet = new THREE.Object3D();
		
			var colorR = parseInt("0x33", 16);
			var colorG = parseInt("0xDD", 16);
			var colorB = parseInt("0xFF", 16);
			
			//console.log("colorNum: " + colorB);
			for (var i = 0; i < numHair; i++) {
				var tmp = new THREE.Object3D();
				var hairGeo = new THREE.CylinderGeometry(hairLen -2, hairLen, 3, rSeg);
				var hairMat = new THREE.MeshLambertMaterial({color: 0x33ddff}); 
				
				var red = colorR - (i * 20);
				var green = colorG - (i * 40);		  
				var blue = colorB - (i * 30);
				if (blue < 100) {
					blue = 100;
				}		  
				hairMat.color.setRGB(red / 255, green / 255, blue / 255);
	
				var hair = new THREE.Mesh(hairGeo, hairMat);
				hair.scale.x= 0.6;
				hair.scale.set = (0.5, 2, 0.5);
				hair.rotation.x = Math.PI / 2;
				hair.position.y = headRadius + hairLen - 1;
				
				tmp.add(hair);
				tmp.rotation.x = (-i * 15 + 50) * Math.PI / 180;	
			
				hairSet.add(tmp);		 
			}	//end for loop
		
			head.add(hairSet);
		}
		
		return head;
}

DrinkBird.prototype.createNeck = function(neckRadius, neckLen, neckMaterial, rodWidth) {

	var neck = new THREE.Object3D();
	
	var neckGeo = new THREE.CylinderGeometry(neckRadius, neckRadius, neckLen, rSeg, hSeg, true, true);
	var neckMesh = new THREE.Mesh(neckGeo, neckMaterial);
	
	//create the neck attachment
	var clampMaterial = new THREE.MeshPhongMaterial({color: 0x666666, shininess: 100});
	var clampHeight = neckLen / 6;
	
	//possibly use tube object	
	var tube = new Tube(neckRadius +3, neckRadius +3, neckRadius + 1, neckRadius + 1, 
		clampHeight, 16, 2, true, true);
	var clampMesh = new THREE.Mesh(tube, clampMaterial);
	
	//var clampGeo = new THREE.CylinderGeometry(neckRadius + 2, neckRadius + 2, clampHeight, rSeg, 2, true, true);
	//var clampMesh = new THREE.Mesh(clampGeo, clampMaterial);
	
	//create the horiz rod through the neck clamp
	var rodRadius = 3;	
	//var rodMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	
	var rodGeo = new THREE.CylinderGeometry(rodRadius, rodRadius, rodWidth, rSeg, 2, true);
	var rodMesh = new THREE.Mesh(rodGeo, clampMaterial);
	rodMesh.scale.z = 0.7;
	rodMesh.rotation.z = 90 * Math.PI / 180;	
	
	neck.add(neckMesh);
	neck.add(clampMesh);
	neck.add(rodMesh);
	
	if (this.hasBowTie) {
		//neck decoration
		var bowMat = new THREE.MeshLambertMaterial({color: 0x55EE00});
		var bow = new THREE.Object3D();	
		//console.log("bowColor: " + this.bowTieColor);
		bowMat.color.setHex(this.bowTieColor);
	
		var bowMid = new THREE.CubeGeometry(8,8,3);
		var bp1 = new THREE.Mesh(bowMid, bowMat);
		var bowSide = new THREE.CylinderGeometry(3, 10, 14);
		var bp2 = new THREE.Mesh(bowSide, bowMat);
		var bp3 = new THREE.Mesh(bowSide, bowMat);
	
		bp2.scale.z = 0.5;
		bp2.rotation.z = Math.PI / 2;
		bp2.position.x = 4 + 7;
	
		bp3.scale.z = 0.5;
		bp3.rotation.z = -Math.PI / 2;
		bp3.position.x = -4 - 7;
	
		bow.add(bp1);
		bow.add(bp2);
		bow.add(bp3);
		bow.position.z = neckRadius + 3 + 1;
	
		neck.add(bow);
	}
		
	return neck;
}


DrinkBird.prototype.createWater = function(bodyRadius, neckRadius, neckLen) {
	//note:do not use material with transparency, else weird sorting issue looks like
	
	var water = new THREE.Object3D();
	var waterMaterial = new THREE.MeshPhongMaterial({shininess: 100, transparent: false});
	waterMaterial.color.setHex(this.waterColor);
	waterMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

	//water in the body
	var waterRadius = bodyRadius - 3;
	var waterGeo = new THREE.SphereGeometry(waterRadius, rSeg, rSeg, 0, Math.PI * 2, Math.PI/2, Math.PI);
	var waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
	
	var waterCap = new THREE.CylinderGeometry(waterRadius, waterRadius, 0, rSeg);
	var waterCapMesh = new THREE.Mesh(waterCap, waterMaterial);
	
	//water in the stem
	var waterCol = new THREE.CylinderGeometry(neckRadius - 2, neckRadius -2, (bodyRadius  + (neckLen / 3)),
		rSeg, 2, true);
	var waterColMesh = new THREE.Mesh(waterCol, waterMaterial);
	waterColMesh.position.y = bodyRadius;
	
	water.add(waterMesh);
	water.add(waterCapMesh);
	water.add(waterColMesh);
	
	return water;
	
}


//negX - true or false, if true then build towards negX direction
DrinkBird.prototype.createWing = function(wingSize, angleSpread, negX) {
	var fWidth1 = 3;
	var fWidth2 = 2;
	var fWidth3 = 2;
	
	var fGeo1 = new THREE.CylinderGeometry(50, 50, fWidth1, rSeg, 1, false);
	var fMat1 = new THREE.MeshLambertMaterial({color: 0x330066});
	
	var fGeo2 = new THREE.CylinderGeometry(30, 30, fWidth2, rSeg, 1, false);
	var fMat2 = new THREE.MeshLambertMaterial({color: 0x336FB3});
	
	var fGeo3 = new THREE.CylinderGeometry(30, 30, fWidth3, rSeg, 1, false);
	var fMat3 = new THREE.MeshLambertMaterial({color: 0x33ddff});
	
	fMat1.color.setHex(this.featherColor1);
	fMat2.color.setHex(this.featherColor2);	
	fMat3.color.setHex(this.featherColor3);
	
	var wing = new THREE.Object3D();
	
	for (var i = 0; i < wingSize; i++) {
		var parentTemp = new THREE.Object3D();
		
		var mesh1 = new THREE.Mesh(fGeo1, fMat1);
		var mesh2 = new THREE.Mesh(fGeo2, fMat2);
	
		mesh1.scale.z = 0.2;
		mesh1.rotation.z = Math.PI / 2;
		mesh1.position.y = 75;
		
		mesh2.scale.z = 0.2;
		mesh2.rotation.z = Math.PI / 2;
		mesh2.position.y = 75;

		if (negX) {
			mesh2.position.x = -fWidth1;
		} else {
			mesh2.position.x = fWidth1;
		}
		
		parentTemp.add(mesh1);
		parentTemp.add(mesh2);
		
		parentTemp.rotation.x = -i * angleSpread *  Math.PI / 180;
		wing.add(parentTemp);
	}
	

	var offset = angleSpread / 2;
	for (var i = 0; i < wingSize - 1; i++) {
		var mesh3 = new THREE.Mesh(fGeo3,fMat3);
		mesh3.rotation.z = Math.PI / 2;
		
		if (negX) {
			mesh3.position.x = (fWidth1 + fWidth2) * -1;
		} else {
			mesh3.position.x = fWidth1 + fWidth2;
		}
		mesh3.position.y = 65;
		mesh3.scale.z = 0.25;
		var parentTemp = new THREE.Object3D();
		
		parentTemp.add(mesh3);
		parentTemp.rotation.x = ((-i * angleSpread) - offset)  * Math.PI / 180;
		
		wing.add(parentTemp);
	}
	
	return wing;
}


DrinkBird.prototype.createHip = function(hipRadius, hipLen) {
	var hip = new THREE.Object3D();
	
	var hipGeo1 = new THREE.CylinderGeometry(hipRadius, hipRadius, hipLen, rSeg, 2, false);
	var hipMat1 = new THREE.MeshLambertMaterial({color: 0xdddddd});
	var hipGeo2 = new THREE.SphereGeometry(hipRadius / 3 * 2, rSeg, rSeg, 0, Math.PI, 0, Math.PI);
	var hipMat2 = new THREE.MeshLambertMaterial({color: 0x336FB3});
	
	hipMat1.color.setHex(this.hipColor1);
	hipMat2.color.setHex(this.hipColor2);
	
	var hipMesh1 = new THREE.Mesh(hipGeo1, hipMat1);
	var hipMesh2 = new THREE.Mesh(hipGeo2, hipMat2);
	
	hipMesh1.rotation.z = Math.PI / 2;
	hipMesh2.scale.z = 0.8;
	hipMesh2.rotation.y = -Math.PI / 2;
	
	hip.add(hipMesh1);
	hip.add(hipMesh2);
	return hip;
	
}


DrinkBird.prototype.createLeg = function(ulRadius, ulLen, blRadius, blLen, ankleRadius, uAngle, bAngle, addRings) {
	
	var leg = new THREE.Object3D();
	
	var legMat = new THREE.MeshLambertMaterial({color: 0xddaa00});
	var ulGeo = new THREE.CylinderGeometry(ulRadius, blRadius, ulLen, 8, 2, false);
	var blGeo = new THREE.CylinderGeometry(blRadius, ankleRadius, blLen, 8, 2, true);	
	
	var ulMesh = new THREE.Mesh(ulGeo, legMat);
	var blMesh = new THREE.Mesh(blGeo, legMat);
	
	var angleRad1 = uAngle * Math.PI / 180;
	var angleRad2 = bAngle * Math.PI / 180;
		
	//upper leg
	ulMesh.rotation.x = angleRad1;
	ulMesh.scale.x = 0.4;
	
	//knee
	var knee = new THREE.SphereGeometry(blRadius + 3);
	var kneeMat = new THREE.MeshLambertMaterial({color: 0xdd9900});
	var kneeMesh = new THREE.Mesh(knee, kneeMat);
	
	kneeMesh.position.y = -ulLen / 2 * Math.cos(angleRad1) - (blRadius / 2);
	kneeMesh.position.z = -ulLen / 2 * Math.sin(angleRad1);
	
	//lower leg
	
	var bottomLeg = new THREE.Object3D();
	
	if (addRings) {
		var ringGeo = new THREE.TorusGeometry(blRadius + 1, 3, 16, 16, Math.PI * 2);
		var ringMat = new THREE.MeshLambertMaterial({color: 0xEEDD00});	
		
		for (var i = 0; i < 3; i++) {
			var ring = new THREE.Mesh(ringGeo, ringMat);
			ring.position.y = -blLen / 3 + ((i + 1) * 7);
			ring.rotation.x = Math.PI / 2;
			bottomLeg.add(ring);
		}
	}
	
	bottomLeg.add(blMesh);		
	bottomLeg.rotation.x = -angleRad2;
	bottomLeg.position.y = ((ulLen / 2 * Math.cos(angleRad1)) + (blLen / 2 * Math.cos(angleRad1))) * -1;
	
	var dist1 = ulLen / 2 * Math.sin(angleRad1);
	var dist2 = blLen / 2 * Math.sin(angleRad2);
	var zDiff = Math.abs((ulLen / 2 * Math.sin(angleRad1)) - (blLen / 2 * Math.sin(angleRad2)));	
	//console.log("dist1: " + dist1 + "  vs dist2: " + dist2);
	//console.log("zDiff: " + zDiff);
	
	bottomLeg.position.z = zDiff;
	
	//feet
	var foot = new THREE.Object3D();
	var footR = 10;
	var footGeo = new THREE.SphereGeometry(footR, rSeg, rSeg, 0, Math.PI * 2, 0, Math.PI / 2);
	var footMat = new THREE.MeshLambertMaterial({color: 0xDDCC00});
	var fyScale = 1;
	
	var footBase = new THREE.Mesh(footGeo, footMat);
	footBase.scale.set (1, 1, 3);
	foot.add(footBase);
	
	var nailR = 5;
	var nailGeo = new THREE.CylinderGeometry(1, nailR, 20, 16, 16);
	var nailMat = new THREE.MeshPhongMaterial({color:0xFFFFdd, shininess:80});
	
	var toeRadian = 30 * Math.PI / 180;
	var tbh = 2;							//toe bottom height
	for (var i = -1; i <= 1; i++) {
		var toe = new THREE.Object3D();
		
		if (i!= 0) {				
			var toeMesh = new THREE.Mesh(footGeo, footMat);	
			var toeBottom = new THREE.CylinderGeometry(footR, footR, tbh);
			var toeBottomMesh = new THREE.Mesh(toeBottom, footMat)
			
			toeMesh.scale.set (0.7, 1, 2);
			toeBottomMesh.scale.set(0.7, 1, 2);
			toeBottomMesh.position.y = -tbh / 2 + 1;
			
			toe.add(toeMesh);					
			toe.add(toeBottomMesh);
		} else {
			var toeBottom = new THREE.CylinderGeometry(footR, footR, tbh);
			var toeBottomMesh = new THREE.Mesh(toeBottom, footMat)
			
			toeBottomMesh.scale.set (1, 1, 3);
			toeBottomMesh.position.y = -tbh / 2 + 1;
			
			toe.add(toeBottomMesh);
		
		}
		
		
		var nailMesh = new THREE.Mesh(nailGeo, nailMat);
		nailMesh.scale.z = 0.7;
		nailMesh.rotation.x = Math.PI / 2;
		nailMesh.position.y = nailR / 2;
		if (i != 0) {
			nailMesh.position.z = footR * 2 + 1;
		} else {
			nailMesh.position.z = footR * 3 + 1;
		}
		toe.add(nailMesh);
		
		
		toe.rotation.y = i * toeRadian;
		toe.position.x = i * 10;
		foot.add(toe);				
	}
	
	
	var backToe = new THREE.Mesh(nailGeo, nailMat);
	backToe.scale.set(0.6, 1.5, 0.6);
	backToe.rotation.x = -Math.PI / 2;
	backToe.position.z = -footR * 3;
	backToe.position.y = nailR / 2 + 1;
	foot.add(backToe);
		
	foot.position.y = -ulLen/ 2 * Math.cos(angleRad1) - (blLen * Math.cos(angleRad2)) - (footR * fyScale);
	foot.position.z = blLen / 2  * Math.sin(angleRad2) + 10;		
	
	
	//add all the leg components
	
	leg.add(ulMesh);
	leg.add(bottomLeg);	
	leg.add(kneeMesh);
	leg.add(foot);
	return leg;
}


DrinkBird.prototype.createBody = function (bodyRadius, bodyMaterial, rodWidth) {
	var body = new THREE.Object3D();
	
	var bodyGeo = new THREE.SphereGeometry(bodyRadius, rSeg, rSeg);
	var bodyMesh = new THREE.Mesh(bodyGeo,bodyMaterial);
	
	
	//wings
	var wings = new THREE.Object3D();
	var wingSize = 5;
	var angleSpread = 20;
	var lfWing = this.createWing(wingSize, angleSpread, true);
	var rtWing = this.createWing(wingSize, angleSpread, false);
	
	//tried to scale lfWing by -1, but then lighting looks off
	
	lfWing.position.x = -1 * (rodWidth / 2);
	rtWing.position.x = (rodWidth / 2);
	
	wings.add(lfWing);
	wings.add(rtWing);
	wings.position.y = wings.position.y - 15;	
	
	//hip
	var hips = new THREE.Object3D();
	var lfHip = this.createHip(20, 8);
	var rtHip = this.createHip(20, 8);

	rtHip.rotation.y = Math.PI;
	rtHip.position.x = rtWing.position.x + 6;
	lfHip.position.x = lfWing.position.x - 6;
	
	hips.add(lfHip);
	hips.add(rtHip);
	
	hips.position.y = -5;
	hips.position.z = -10;
	
	//legs and feet
	var legs = new THREE.Object3D();
	var ulR = 10;
	var ulLen = 65;
	var blR = 5;
	var blLen = 50;
	var ankleR = 3;
	var ang1 = 30;
	var ang2 = 45;
	var lfLeg = this.createLeg(ulR, ulLen, blR, blLen, ankleR, ang1, ang2, true);
	var rtLeg = this.createLeg(ulR, ulLen, blR, blLen, ankleR, ang1, ang2, true);

	lfLeg.position.x = lfHip.position.x;
	rtLeg.position.x = rtHip.position.x;
	
	legs.add(lfLeg);
	legs.add(rtLeg);
	
	legs.position.y = -41;
	legs.position.z = -31;
	
	body.add(wings);
	body.add(hips);
	body.add(legs);
	body.add(bodyMesh);
	
	
	
	return body;
}


DrinkBird.prototype.createTail = function(bodyRadius) {
	//create the rod to hold the tail

	var tail = new THREE.Object3D();
	var rodR = 3;
	var rodLen = 20;
	var rodGeo = new THREE.CylinderGeometry(rodR, rodR, rodLen, rSeg, 2, false);	
	var rodMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});
	var rodMesh = new THREE.Mesh(rodGeo, rodMaterial);
	
	rodMesh.rotation.x = Math.PI / 2;
	rodMesh.position.z = -bodyRadius - rodLen / 2;
	
	tail.add(rodMesh);		
	//create the feathers
	var flen1 = 40;
	var flen2 = 30;
	
	var fGeo1 = new THREE.CylinderGeometry(flen1 - 2, flen1, 3, rSeg, 1, false);
	var fGeo2 = new THREE.CylinderGeometry(flen2 - 2, flen2, 4, rSeg, 1, false);
	var fMat1 = new THREE.MeshLambertMaterial({color: 0x336FB3});
	var fMat2 = new THREE.MeshLambertMaterial({color: 0x33ddff});
	fMat1.color.setHex(this.tailColor1);
	fMat2.color.setHex(this.tailColor2);
	
	var feathers = new THREE.Object3D();
	
	for (var i = -1; i <= 1; i++) {
		var tmpParent = new THREE.Object3D();
		
		var fMesh1 = new THREE.Mesh(fGeo1, fMat1);		
		var fMesh2 = new THREE.Mesh(fGeo2, fMat2);	
		
		fMesh1.scale.x = 0.2;
		fMesh2.scale.x = 0.2;	
	
		if (i == 0) {
			//make the middle feather a little bigger
			fMesh1.scale.set(0.3, 1, 1.2);
			fMesh2.scale.set(0.2, 1, 1);			
		}
	
		fMesh2.position.y = 2;
			
		fMesh1.position.z = -flen1 - bodyRadius -rodLen;
		fMesh2.position.z = -flen2 - bodyRadius -rodLen - 5;						
		
		
		tmpParent.add(fMesh1);
		tmpParent.add(fMesh2);
		tmpParent.rotation.y = 12 * Math.PI / 180 * i;
		
		feathers.add(tmpParent);
				
	}

	tail.add(feathers);
	
	
	return tail;
}


DrinkBird.prototype.createBird = function () {

    var glassMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, shininess: 100, opacity: 0.3, transparent:true} );
	glassMaterial.color.setRGB(0.0, 0.0, 0.0);
    glassMaterial.specular.setRGB(1.0, 1.0, 1.0);

	var headMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, shininess: 90, opacity: 0.7,transparent: true} );
	headMaterial.color.setHex(this.headColor);
	headMaterial.ambient.setRGB(0.0, 0.0, 0.1);
    headMaterial.specular.setRGB(0.5, 0.5, 1.0);
	
	var headRadius = 25;
	var neckRadius = 5;
	var neckLen = 120;
	var bodyRadius = 35;
	var rodWidth = 78;
	
	var head = this.createHead(headRadius, headMaterial);	
	var water = this.createWater(bodyRadius, neckRadius, neckLen);
	var neck = this.createNeck(neckRadius, neckLen, glassMaterial, rodWidth);
    var body = this.createBody(bodyRadius, glassMaterial, rodWidth);
	var tail = this.createTail(bodyRadius);

	head.position.y = neckLen + bodyRadius + headRadius;
	neck.position.y = (neckLen / 2) + bodyRadius;
	
	tail.rotation.x = -30 * Math.PI / 180;
	
	var drinkBird = new THREE.Object3D();
	drinkBird.add(head);
	drinkBird.add(water);
	drinkBird.add(neck);
	drinkBird.add(body);
	drinkBird.add(tail);
	
	drinkBird.position.y = 115;		//roughly place on the plane
	
	this.model = drinkBird;

	return drinkBird;

}



