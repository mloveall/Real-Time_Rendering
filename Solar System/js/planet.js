/**
 * @author Mitchell Loveall
 */

 /**
 * @fileoverview This class is used to generate a planet based on
 * its name, material, radius, distance from the Sun, speed
 * (based on day/year time), and parent planet (if any).
 */
 
function Planet (pName, mat, radius, distanceToSun, year, day, parent)
{
	this.planetName = pName;
	this.material = new THREE.MeshPhongMaterial ();
	this.material.map = THREE.ImageUtils.loadTexture (mat);
	this.radius = radius;
	this.distToSun = distanceToSun;
	this.year = year;
	this.day = day;
	this.parent = parent;
	this.theta = 0;
	this.segs = 100;
	this.location = new THREE.Vector3 (distanceToSun,0,0);
	this.mesh = new THREE.Mesh (new THREE.SphereGeometry (this.radius, this.segs, this.segs), this.material);
	this.mesh.overdraw = true;
	this.mesh.position.set (this.location);
	this.children = [];
	
	this.Update = function ()
	{
		
		var parentLocation = parent.location;
		
		// Calculate local position accounting for parent position
		var x = this.distToSun * Math.sin (Math.PI*this.theta/this.year) + parentLocation.x;
		var y = this.distToSun * Math.cos (Math.PI*this.theta/this.year) + parentLocation.y;
		var z = parentLocation.z;
		
		// Update and set location and rotation
		// var rotationAxis = new THREE.Vector3(8.4,0,10);
		this.location = new THREE.Vector3( x, y, z );
		this.mesh.position.set( x, y, z );

		// Increment by one 'day' and reset on new year
		this.theta++;
		if ( this.theta > (this.year*2))
		{
			this.theta = 0;
		}
		
		// Update all children
		for(var i =0; i < this.children.length; i++)
		{
			this.children[i].Update ();
		}
	}
	
	this.AddChild = function (child)
	{
		this.children[this.children.length] = child;
	}
	
	function rotateAroundObjectAxis (object, axis, radians)
	{
		rotObjectMatrix = new THREE.Matrix4 ();
		rotObjectMatrix.makeRotationAxis (axis.normalize (), radians);

		object.matrix.multiply (rotObjectMatrix);
		object.rotation.setFromRotationMatrix (object.matrix);
	}
}
