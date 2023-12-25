import * as PIXI from "pixi.js"; //requires accessing PIXI. (for dev/learning)
import { Application, Container, Ticker, Assets, Sprite } from "pixi.js"; //allows accessing directly, better performance
import { Button } from "@pixi/ui";

import * as Debug from "./debug.js";

let gameCanvas = null;

const MakeGame = (w, h, b) => {
  gameCanvas = new Application({
    width: w,
    height: h,
    backgroundColor: b,
  });
  gameCanvas.ticker.add((delta) => gameLoop(delta));
};

const DebugCallback = {
  AddBunny: () => {
    AddBunny();
  },
};

export /**
 * @param {Number} w = width of the game canvas
 * @param {*} h = height of the game canvas
 * @param {*} b = background color of the game canvas
 * @return {*} the view of the pixijs game canvas
 */
const Init = (w, h, b) => {
  if (!gameCanvas) {
    MakeGame(w || 800, h || 600, b || "#00ff00");
  }
  Debug.Register(DebugCallback);
  return gameCanvas.view;
};

let bunnies = [];
let bunnyCount = 0;
export const AddBunny = () => {
  bunnyCount++;
  const bunny = Sprite.from("./images/bunny.png");
  bunny.anchor.set(0.5);
  let r = () => Math.random() - 0.5;
  bunny.spinrate = r();
  (bunny.xVel = r() * 5), (bunny.yVel = r() * 5);
  bunny.position.set(
    gameCanvas.renderer.width / 2,
    gameCanvas.renderer.height / 2
  );
  bunny.bounceCount = 0;

  bunnies.push(bunny);
  gameCanvas.stage.addChild(bunny);
  Debug.Log("bunny " + bunnyCount + " added");
};

const gameLoop = (delta) => {
  for (let bunny of bunnies) {
    bunny.x = bunny.x + bunny.xVel * delta;
    bunny.y = bunny.y + bunny.yVel * delta;
    //rotate bunny
    bunny.rotation = bunny.rotation + delta * bunny.spinrate;
    if (bunny.x > gameCanvas.renderer.width || bunny.x < 0) {
      bunny.xVel = -bunny.xVel;
      bunny.bounceCount++;
    }
    if (bunny.y > gameCanvas.renderer.height || bunny.y < 0) {
      bunny.yVel = -bunny.yVel;
      bunny.bounceCount++;
    }
  }
};
