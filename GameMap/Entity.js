import TextTiles from "./TextTiles.mjs";
import time from "./Timer.js";

export default class Entity {
  #gameMap;
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
    gameOver,
    gameMap, 
    drawUI,
    deleteChest
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
    this.#gameMap = gameMap;
    this.hp = 2;
    this.drawUI = drawUI
    this.deleteChest = deleteChest;
  }

  set gameMap(map) {
    this.#gameMap = map;
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
    this.ctx.clearRect(this.absX-10, this.absY-10, this.width+10, this.height+20);
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
  // smoothMove(dirX, dirY) {
  //   return new Promise((rs, rj) => {
  //     const velocity = 4 * time.deltaTime;
  //     this.undraw();
  //     let elapsed = 0;
  //     const loop = () => {
  //       this.absX += dirX * velocity;
  //       this.absY += dirY * velocity;
  //       this.draw();
  //       elapsed += time.deltaTime;
  //       if (elapsed > 0.5) {
  //         cancelAnimationFrame(loop)
  //       }
  //       requestAnimationFrame(loop)
  //     }
  //     this.draw();
  //   });
  // }
  async move(dir) {
    const values = {
      up: { x: 0, y: -1, contrary: 'down' },
      down: { x: 0, y: 1, contrary: 'up' },
      left: { x: -1, y: 0, contrary: 'left' },
      right: { x: 1, y: 0, contrary: 'right' },
    };
    const dy = values[dir].y;
    const dx = values[dir].x;

    // console.log(dy, dx);

    // console.log(this.y, this.x);

    // await this.smoothMove(dx, dy);

    
    // // if (this.#gameMap.tiles[this.y][this.x].blocked) {
    // //   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,].forEach(async() => {
    // //     await this.smoothMove(values[dx.contrary].x, values[dy.contrary].y);
    // //   })
    // // }
    if (Entity.gameMap.tiles[this.y + dy][this.x + dx].blocked) return;


    
    // this.x = Math.round(this.absX / this.tileWidth);
    // this.y = Math.round(this.absY / this.tileHeight);
    switch (dir) {
          case 'up':
            // if (Entity.gameMap.tiles[this.y - 1][this.x].blocked) return;
            this.undraw(); 
            this.absY -= this.tileHeight;
            this.y -= 1;
           
            break;
        case 'down':
            // if (Entity.gameMap.tiles[this.y + 1][this.x].blocked) return;
            this.undraw();
            this.absY += this.tileHeight;
            this.y += 1;

            break;
        case 'left':
            // if (Entity.gameMap.tiles[this.y][this.x - 1].blocked) return;
            this.undraw();
            this.absX -= this.tileWidth;
            this.x -= 1;

            break;
        case 'right':
            // if (Entity.gameMap.tiles[this.y][this.x + 1].blocked) return;
            this.undraw();
            this.absX += this.tileWidth;
            this.x += 1;

            break;
        }
    const sfx = new Audio();
    sfx.type = 'audio/ogg';
    sfx.volume = 0.2
    
    const tile = this.#gameMap.tiles[this.y][this.x];
    if (tile.type === TextTiles.stairs) {
      // this.undraw();
      window.globalDifficulty += 0.25;
      this.reset();
      sfx.src = '../TileSet/audio/doorClose_3.ogg';
      sfx.play();
      return;
    }
    if (tile.type === TextTiles.chest) {
      this.hp++;
      sfx.src = '../TileSet/audio/doorOpen_1.ogg'
      this.deleteChest(this.absX, this.absY, this.tileWidth, this.tileHeight)
    }
    if (tile.type === TextTiles.spikes) {
      this.hp--;
      this.drawUI();
      sfx.src = '../TileSet/audio/knifeSlice.ogg'
      if (this.hp <= 0) {
        sfx.src = '../TileSet/audio/knifeSlice2.ogg'
        this.hp = 2;
        this.gameOver();
      }
    }
    if (tile.type === TextTiles.floor) {
      sfx.src = `../TileSet/audio/footstep0${Math.ceil(Math.random()*3)}.ogg`;
    }
    sfx.play();
    this.draw()
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
