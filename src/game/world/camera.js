import {Transform} from 'pixi.js';

/**
 *
 *
 * @export
 * @class Camera
 */
export default class Camera extends Transform {

	constructor(x, y) {
		super();
		this.position.set(x, y);

		return this;
	}

	setZoom(zoom) {
		this.zoom = zoom;
	}

	setPos(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	}

	move(x, y) {
		this.pos.x += x;
		this.pos.y += y;
	}
	
}