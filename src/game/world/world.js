import {default as GameObject} from "./world/game_object.js"
import {default as Camera} from "./world/camera.js"

import { Texture } from "./world/texture.js"

export default class World {

	gameObjects = [];
	currentCamera;

	constructor() {
		this.currentCamera = new Camera(0, 0);
	}

	CreateObject(x, y) {
		this.gameObjects.push(new GameObject(x, y, Texture.from('./images/bunny.png')));
	}


}