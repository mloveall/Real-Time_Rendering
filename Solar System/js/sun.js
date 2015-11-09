/**
 * @author Mitchell Loveall
 */

 /**
 * @fileoverview This class is used to generate the Sun based on
 * its radius.
 */

function Sun (radius)
{
	this.material = new THREE.MeshBasicMaterial ();
	this.material.map = THREE.ImageUtils.loadTexture ('http://i.imgur.com/bN0x1HB.jpg');
	this.radius = radius;
	this.segs = 100;
	this.location = new THREE.Vector3 ( 0, 0, 0 );
	this.mesh = new THREE.Mesh (new THREE.SphereGeometry(this.radius, this.segs, this.segs), this.material);
	this.mesh.overdraw = true;
	this.mesh.position.set (this.location);
	this.children = [];
	
	this.Update = function ()
	{
		this.mesh.position.set ( 0, 0, 0 );
		for(var i =0; i < this.children.length; i++)
		{
			this.children[i].Update ();
		}
	}
	
	this.AddChild = function (child)
	{
		this.children[this.children.length] = child;
	}
}
