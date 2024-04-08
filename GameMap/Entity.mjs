import TextTiles from "./TextTiles.mjs";
import time from "./Timer.js";

export default class Entity {
  static gameMap = null;
  constructor(
    ctx,
    x,
    y,
    width,
    height,
    type,
    path,
    tileWidth,
    tileHeight,
    reset,
    gameOver
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.absX = x * tileWidth;
    this.absY = y * tileHeight;
    this.width = width;
    this.height = height;
    this.type = type;
    this.path = path;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.reset = reset;
    this.gameOver = gameOver;
    this.lastDir = "up";
  }
  draw() {
    // console.log('drawing entity at ', this.x, this.y, this.absX, this.absY)
    const img = {
      src: this.path,
      x: this.absX,
      y: this.absY,
      width: this.width,
      height: this.height,
    };
    this.drawImages([img]);
  }
  undraw() {
    this.ctx.clearRect(this.absX, this.absY, this.width, this.height);
  }
  drawImages(images) {
    if (images.length === 0) {
      return;
    }

    const img = images.shift();
    const imgToDraw = new Image();
    imgToDraw.src = img.src;

    imgToDraw.onload = () => {
      this.ctx.drawImage(imgToDraw, img.x, img.y, img.width, img.height);
      this.drawImages(images);
    };
  }
  smoothMove(dirX, dirY) {
    return new Promise((rs, rj) => {
      const velocity = 3 * time.deltaTime;
      setTimeout(() => {
        console.log(velocity);
      }, time.deltaTime);
    });
  }
  async move(dir) {
    const values = {
      up: { x: -1, y: 0 },
      down: { x: 1, y: 0 },
      left: { x: 0, y: -1 },
      right: { x: 0, y: 1 },
    };
    const dy = values[dir].y;
    const dx = values[dir].x;

    // console.log(dy, dx);

    console.log(this.y, this.x);

    if (Entity.gameMap.tile[this.y - dy][this.x + dx].blocked) return;
    await this.smoothMove(dx, dy);

    // switch (dir) {
    //     case 'up':
    //         if (Entity.gameMap.tiles[this.y - 1][this.x].blocked) return;
    //         this.undraw();
    //         this.absY -= this.tileHeight;
    //         this.y -= 1;
    //         break;
    //     case 'down':
    //         if (Entity.gameMap.tiles[this.y + 1][this.x].blocked) return;
    //         this.undraw();
    //         this.absY += this.tileHeight;
    //         this.y += 1;
    //         break;
    //     case 'left':
    //         if (Entity.gameMap.tiles[this.y][this.x - 1].blocked) return;
    //         this.undraw();
    //         this.absX -= this.tileWidth;
    //         this.x -= 1;
    //         break;
    //     case 'right':
    //         if (Entity.gameMap.tiles[this.y][this.x + 1].blocked) return;
    //         this.undraw();
    //         this.absX += this.tileWidth;
    //         this.x += 1;
    //         break;
    //     }
    const tile = Entity.gameMap.tiles[this.y][this.x];
    if (tile.type === TextTiles.stairs) {
      this.reset();
    }
    if (tile.type === TextTiles.spikes) {
      this.gameOver();
    }
    this.draw();
    this.lastDir = dir;
  }
  get absPosition() {
    return {
      x: this.absX,
      y: this.absX,
    };
  }
  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
