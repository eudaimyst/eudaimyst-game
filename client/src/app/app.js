//import * as PIXI from "pixi.js"; //requires accessing PIXI. (for dev/learning)
import { Application, Texture, Sprite } from 'pixi.js'; //allows accessing directly, better performance
import World from './world/world.js';
import {SpawnBunny} from './world/objects/bunny.js';
import { io } from "socket.io-client";

import * as Debug from './debug.js';

let bunnies = [];
let currentBunny; //index in bunnies array of bunny assigned to camera
let world;
let app;
let socket;

//for debugging use this line to remove uniqueID in local storage to simulate new client
//localStorage.removeItem('uniqueID');

function establishConnection(callback) {
	socket = io("http://192.168.0.2:3000", { });
	console.log(socket)
	callback ? socket.on("connect", () => {callback()}) : '';

}


export default class App extends Application {
	pointerPosition = { x: 0, y: 0 };

	/**
	 * Initializes a game object with the specified width, height, and background
	 * color, and sets up the game loop and world.
	 * @param w - The width of the game screen.
	 * @param h - The parameter "h" in the constructor represents the height of the game or application.
	 * @param b - The parameter "b" represents the background color of the game.
	 * @returns The constructor is returning the instance of the class.
	 */
	constructor(w, h, b) {
		super({
			width: w,
			height: h,
			backgroundColor: b,
		});

		Debug.RegisterGame(this); //to access game from debug module
		app = this;
		world = new World(this);
		establishConnection(this.PostConnection);
		return this
	}

	PostConnection = () => {
		console.log('socketID for server connection:', socket.id)
		if (!localStorage.getItem("uniqueID")) {
			console.log('client has no uniqueID, using socket id:', socket.id)
			localStorage.setItem("uniqueID", socket.id);
		}
		console.log('connecting using uniqueID: ', localStorage.getItem('uniqueID'))
		
		socket.emit('new client', localStorage.getItem('uniqueID'));
		
		this.ticker.add((delta) => this.gameLoop(delta));

		this.DrawGradient();

		this.stage.addChild(world);
	}

	/* Creates sprite from createGradTexture function which returns texture.
	Colors of gradient are specified in colors array. Sprite positioned at bottom of stage.*/
	DrawGradient = () => {
		const createGradTexture = (colors) => {
			const quality = 32;
			const canvas = document.createElement('canvas');

			canvas.width = 1;
			canvas.height = quality;

			const ctx = canvas.getContext('2d');

			// use canvas2d API to create gradient
			const grd = ctx.createLinearGradient(0, 0, 0, quality);
			grd.addColorStop(0.25, colors[0]);
			grd.addColorStop(0.75, colors[1]);
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, quality, quality);
			return Texture.from(canvas);
		};

		//#region gradient make gradient sprite for bottom of game
		const sprite = new Sprite(createGradTexture(['#3b669700', '#224062']));
		sprite.anchor.set(0, 1);
		sprite.height = this.renderer.height;
		sprite.width = this.renderer.width;
		sprite.position.set(0, this.renderer.height + sprite.height / 4);
		this.stage.addChild(sprite);
		//#endregion
	};

	AddBunny() {
		//let bunny = SpawnBunny( world, world.currentCamera.position.x, world.currentCamera.position.y );
		//console.log(this)
		let bunny = SpawnBunny( world, 0, 0 );
		app.stage.addChild(bunny);
		world.GetCamera().Assign(bunny);
		bunnies.push(bunny);
		currentBunny = bunnies.length - 1;
		Debug.Log(currentBunny);
		console.log('newBunny');
		socket.emit('newBunny', bunnies.length);
		//console.log(world);
	}

	NextBunny() {
		const currentID = bunnies.indexOf(bunnies[currentBunny])
		if (bunnies[currentID+1]) {
			currentBunny = currentBunny+1
			world.GetCamera().Assign(bunnies[currentBunny]);
		}
		Debug.Log(currentBunny)

	}

	PrevBunny() {
		const currentID = bunnies.indexOf(bunnies[currentBunny])
		if (bunnies[currentID-1]) {
			currentBunny = currentBunny-1
			world.GetCamera().Assign(bunnies[currentBunny]);
		}
		Debug.Log(currentBunny)
	}

	Disconnect() {
		console.log('socket disconnecting')
		console.log(socket)
		socket.disconnect()
	}

	Reconnect() {
		establishConnection()
	}

	/* The `gameLoop` function is a callback function that is called on every frame of the game. It takes
	a parameter `delta`, which represents the time elapsed since the last frame. */
	gameLoop = (delta) => {
		world.Tick(delta);
	};
}

/**
export const Init = (w, h, b) => {
	if (!gameCanvas) {
		MakeGame(w || 800, h || 600, b || '#00ff00');
	}
	Debug.Register(debugHandler); //to access game from debug module

	const cam = new Camera();
	console.log(cam);

	//#region background

	//const background = new Sprite(Texture.WHITE);
	const bgSpriteSpacing = 100;
	//background.width = gameCanvas.renderer.width;
	//background.height = gameCanvas.renderer.height;
	let bgDots = [];

	const makeBGDot = (x, y) => {
		const container = new Container();
		const dot = Sprite.from('images/bg.png');
		const dotPos = new Text(x + ',' + y, { fontSize: 8, fill: '#ffffff22' });
		dot.anchor.set(0.5);
		container.addChild(dot);
		container.addChild(dotPos);
		container.position.set(x, y);
		container.scale.set(1);
		return container;
	};
	for (let i = 0; i < gameCanvas.renderer.width / bgSpriteSpacing; i++) {
		for (let j = 0; j < gameCanvas.renderer.height / bgSpriteSpacing; j++) {
			bgDots.push(makeBGDot(i * bgSpriteSpacing, j * bgSpriteSpacing));
		}
	}
	const bgContainer = new Container();
	let bgOverlay = new Sprite(Texture.CLEAR);
	bgOverlay.width = gameCanvas.renderer.width;
	bgOverlay.height = gameCanvas.renderer.height;
	bgOverlay.addEventListener('pointermove', (e) => {
		(pointerPosition.x = e.global.x), (pointerPosition.y = e.global.y);
	});
	bgOverlay.eventMode = 'static';
	bgOverlay.cursor = 'pointer';
	bgOverlay.on('pointerdown', () => {
		console.log('clicked ' + pointerPosition.x + ',' + pointerPosition.y);
	});

	bgContainer.addChild(bgOverlay);
	for (dot of bgDots) {
		bgContainer.addChild(dot);
	}
	gameCanvas.stage.addChild(bgContainer);

	//#endregion


	return gameCanvas.view;
};

**/
