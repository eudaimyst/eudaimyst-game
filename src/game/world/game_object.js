import { Transform, Container, Sprite } from "pixi.js";

export default class GameObject extends Container {

	world;
	sprite;
	worldPosition;

	/**
	 * This is a constructor function that creates a sprite object with a given texture and position, and
	 * adds it to a specified world.
	 * @param world - The "world" parameter is a reference to the game world
	 * @param texture - The texture parameter is the image or texture that will be used to create the
	 * sprite. It can be a path to an image file or a texture object.
	 * @param x - The x-coordinate of the position where the sprite will be placed in the world.
	 * @param y - The parameter "y" represents the y-coordinate of the position where the sprite will be
	 * placed on the screen.
	 * @returns The instance of the class that the constructor is being called on.
	 */
	
	constructor(world, texture, x, y) {
        super();

		this.world = world;

        sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        this.addChild(sprite);

        return this;
    }

	SetPosition = (x, y) => {
		this.worldPosition.set(x, y);
	}

	Move = (x, y) => {
		this.SetPosition(this.worldPosition.x + x, this.worldPosition.y + y);
	}

	Update = () => {

		this.position.set(this.worldPosition.x, this.worldPosition.y);

	}
}
