import { Transform } from 'pixi.js';

/**
 *
 *
 * @export
 * @class Camera
 */
export default class Camera extends Transform {
	zoom;
	objectTarget;
	width;
	height;
	
	constructor(x, y) {
		super();
		//this.width = w; this.height = h;
		this.position.set(x, y);

		return this;
	}

	Assign(objectTarget) {
		this.objectTarget = objectTarget;
	}

	SetZoom(zoom) {
		this.zoom = zoom;
	}

	MoveBy(x, y) {
		this.position.set(this.position.x+x, this.position.y+y);
	}
	MoveTo(x, y) {
		this.position.set(x, y);
	}

	Tick() {
		if (this.objectTarget) this.MoveTo(this.objectTarget.worldPosition.x, this.objectTarget.worldPosition.y);
	}
}
