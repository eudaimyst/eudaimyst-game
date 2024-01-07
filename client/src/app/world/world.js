import { Container, Sprite, Texture } from 'pixi.js';
import { default as GameObject } from './game_object.js';
import { default as Camera } from './camera.js';

import * as Debug from '../debug.js';


/* The World class is a subclass of Container that represents a game world and contains game objects, a
camera, and methods for creating objects and updating the game state. */
export default class World extends Container {
	gameObjects = [];
	currentCamera;
	app; //reference to pixi application object

	/* The constructor function initializes a new instance of the class with a default camera position.
	*/
	constructor(app) {
		super();
		this.app = app;
		this.currentCamera = new Camera(0, 0);
	}

	/* The `CreateObject` method is a function that creates a new game object and adds it to the game
	world. */
	CreateObject = (x, y, texture) => {
		const obj = new GameObject(this, texture, x, y);
		this.gameObjects.push(obj);
		this.addChild(obj);
		return obj
	};

	/* The `Tick` method is a function that updates the game state by calling the `Tick` method of each
	game object in the `gameObjects` array. It takes a `delta` parameter, which represents the time
	elapsed since the last frame. This method is typically called in the game loop to update the game
	state for each frame. */
	Tick = (delta) => {
		//console.log('tick');
		for (let i = 0; i < this.gameObjects.length; i++) {
			this.gameObjects[i].Tick(delta);
		}
		//Debug.Log(this.GetCamPos());
		this.currentCamera.Tick();
	}

	/* The `GetCamPos` method is a function that returns the position of the current camera in the game
	world. It retrieves the `position` property of the `currentCamera` object and returns it. */
	GetCamPos = () => {
		return this.currentCamera.position;
	}

	GetCamPosOffset = () => {
		return this.currentCamera.position.clone().set(this.currentCamera.position.x - this.app.renderer.width/2, this.currentCamera.position.y - this.app.renderer.height/2);
	}

	GetCamera = () => {
		return this.currentCamera;
	}
}