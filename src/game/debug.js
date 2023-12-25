let debug = {};
let game;

export const Init = () => {
    debug = document.createElement("div");
    debug.text = document.createElement("p");
    debug.button = document.createElement("button");
    debug.button.onclick = () => {
        game.AddBunny();
    };
    debug.button.innerHTML = "Add Bunny";
    debug.appendChild(debug.text);
    debug.appendChild(debug.button);

    return debug;
};

export const Register = (gameCallback) => {
    game = gameCallback;
};

export const Log = (string) => {
    console.log(string);
    debug.text.innerHTML = string;
};
