import Sprite from "./Sprite.js";

class Player extends Sprite {
  #gameMap;
  constructor({ position, imageSrc, frameRate, animations, frameBuffer, type, tileWidth, tileHeight, gameMap, reset, gameOver}) {
    super({ imageSrc, frameRate, frameBuffer });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.height = 100;
    this.animations = animations;
    this.lastDirection = "right";
    this.type = type
    this.#gameMap = gameMap;
    this.reset = reset;
    this.gameOver = gameOver;
    this.absX = this.position.x * tileWidth
    this.absY = this.position.y * tileHeight
    this.tileHeight = tileHeight;
    this.tileWidth = tileWidth;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) {
      return;
    }

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  update() {
    this.updateFrames();
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export default Player;

