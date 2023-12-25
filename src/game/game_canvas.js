//import * as PIXI from "pixi.js"; //requires accessing PIXI. (for dev/learning)
import { Application, Text, Texture, Sprite, Color, Container } from "pixi.js"; //allows accessing directly, better performance

import { Button } from "@pixi/ui";

import {default as Camera} from "./world/camera.js"
import * as Debug from "./debug.js";

let gameCanvas = null;
const pointerPosition = {
    x: 0, y: 0 };

/**
 * Create pixi application and adds gameLoop as ticker function
 * @param {Number} w width of the game canvas
 * @param {Number} h height of the game canvas
 * @param {Number} b background color of the game canvas
 */
const MakeGame = (w, h, b) => {
    gameCanvas = new Application({
        width: w,
        height: h,
        backgroundColor: b,
    });
    gameCanvas.ticker.add((delta) => gameLoop(delta));
};

/** @type {*} passed to debug module upon init for callbacks */
const debugHandler = {
    /**
     *Calls the AddBunny function
     */
    AddBunny: () => {
        AddBunny();
    },
};

/**
 * Begin game logic and register the debug canvas
 * @param {Number} w = width of the game canvas
 * @param {Number} h = height of the game canvas
 * @param {Number} b = background color of the game canvas
 * @return {Application.view} the view of the pixijs game canvas
 */
export const Init = (w, h, b) => {
    if (!gameCanvas) {
        MakeGame(w || 800, h || 600, b || "#00ff00");
    }
    Debug.Register(debugHandler); //to access game from debug module


    const cam = new Camera;
    console.log(cam)
    //#region background

    //const background = new Sprite(Texture.WHITE);
    const bgSpriteSpacing = 100;
    //background.width = gameCanvas.renderer.width;
    //background.height = gameCanvas.renderer.height;
    let bgDots = [];

    /**
     * The function `makeBGDot` creates a container with a sprite and text representing the position of
     * a dot on a background image.
     * @param {number} x - The x parameter represents the x-coordinate of the position where the background dot
     * will be placed.
     * @param {number} y - The parameter `y` represents the y-coordinate of the position where the background
     * dot will be placed.
     * @returns The function `makeBGDot` returns a container object that contains a sprite and a text
     * object.
     */
    const makeBGDot = (x, y) => {
        const container = new Container();
        const dot = Sprite.from("images/bg.png");
        const dotPos = new Text(x + "," + y, { fontSize: 8, fill: "#ffffff22" });
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
    bgOverlay.addEventListener("pointermove", (e) => {
        pointerPosition.x = e.global.x, pointerPosition.y = e.global.y;
    });
    bgOverlay.eventMode = "static";
    bgOverlay.cursor = "pointer";
    bgOverlay.on("pointerdown", () => {
        console.log("clicked " + pointerPosition.x + "," +pointerPosition.y);
    });

    bgContainer.addChild(bgOverlay);
    for (dot of bgDots) {
        bgContainer.addChild(dot);
    }
    gameCanvas.stage.addChild(bgContainer);

    //#endregion

    //#region gradient make gradient sprite for bottom of game
    const sprite = new Sprite(createGradTexture(["#3b669700", "#224062"]));
    sprite.anchor.set(0, 1);
    sprite.height = gameCanvas.renderer.height;
    sprite.width = gameCanvas.renderer.width;
    sprite.position.set(0, gameCanvas.renderer.height + sprite.height / 4);
    gameCanvas.stage.addChild(sprite);
    //#endregion

    return gameCanvas.view;
};

//#region Gradient creating gradient texture

/**
 * Builds texture from passed colors
 * @param {Array<Color>} colors contains arrays of colours to build gradient from
 * @return {Texture} vertical gradient texture
 */
function createGradTexture(colors) {
    const quality = 32;
    const canvas = document.createElement("canvas");

    canvas.width = 1;
    canvas.height = quality;

    const ctx = canvas.getContext("2d");

    // use canvas2d API to create gradient
    const grd = ctx.createLinearGradient(0, 0, 0, quality);
    grd.addColorStop(0.25, colors[0]);
    grd.addColorStop(0.75, colors[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, quality, quality);
    return Texture.from(canvas);
}

//#endregion
//#region bunnies

let bunnies = [];
let bunnyCount = 0;

/**
 * Adds a bunny to the game
 */
export const AddBunny = () => {
    const bunny = Sprite.from("./images/bunny.png");
    bunny.anchor.set(0.5);
    bunny.bounceCount = 0;
    let r = () => Math.random() - 0.5;
    bunny.spinrate = r();
    (bunny.xVel = r() * 5), (bunny.yVel = r() * 5);
    bunny.position.set(gameCanvas.renderer.width / 2, gameCanvas.renderer.height / 2);

    bunnies.push(bunny);
    gameCanvas.stage.addChild(bunny);
    Debug.Log("bunny " + bunnies.length + " added");
};

/**
 * Removes a bunny from the game
 */
export const RemoveBunny = (bunny) => {
    bunnies.splice(bunnies.indexOf(bunny), 1);
    gameCanvas.stage.removeChild(bunny);
    Debug.Log("bunny removed, " + bunnies.length + " remain");
};

/**
 * Called each frame to move the bunnies
 */
const MoveBunnies = (delta) => {
    /**
     * Called when bunny reaches edge of screen
     * @param {Sprite} bunny a reference to the bunny
     * @param {String} side the side of the screen the bunny has reached
     */
    const bunnyBounce = (bunny, side) => {
        bunny[side + "Vel"] = -bunny[side + "Vel"];
        bunny.bounceCount++;
        if (bunny.bounceCount > 2) {
            RemoveBunny(bunny);
        }
    };

    for (let bunny of bunnies) {
        bunny.x = bunny.x + bunny.xVel * delta;
        bunny.y = bunny.y + bunny.yVel * delta;
        //rotate bunny
        bunny.rotation = bunny.rotation + delta * bunny.spinrate;
        if (bunny.x > gameCanvas.renderer.width || bunny.x < 0) {
            bunnyBounce(bunny, "x");
        }
        if (bunny.y > gameCanvas.renderer.height || bunny.y < 0) {
            bunnyBounce(bunny, "y");
        }
    }
};

//#endregion

const gameLoop = (delta) => {
    MoveBunnies(delta);
};
