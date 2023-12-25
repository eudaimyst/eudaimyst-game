import * as GameCanvas from "./game/game_canvas";
import * as Debug from "./game/debug";

const game = GameCanvas.Init(
  window.innerWidth,
  document.body.clientHeight,
  "#ffffff"
);
document.body.style.margin = "0px";
document.body.appendChild(game);
document.body.appendChild(Debug.Init());

GameCanvas.AddBunny();
