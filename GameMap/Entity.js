import TextTiles from "./TextTiles.mjs";
import time from "./Timer.js";

export default class Entity {
  #gameMap;
  constructor(
    ctx,
    effectsCtx,
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
    deleteChest,
    drawMask
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
    this.lastDir = "right";
    this.currentAnimation = "idleRight";
    this.#gameMap = gameMap;
    this.hp = 2;
    this.drawUI = drawUI
    this.deleteChest = deleteChest;
    this.image = new Image();
    this.image.src = path;
    this.frames = {
      runRight: [
          {
              x: 0,
              y: 32,
          },
          {
              x: 16,
              y: 32,
          },
          {
              x: 32,
              y: 32,
          },
          {
              x: 48,
              y: 32,
          },
      ],
      runLeft: [
          {
              x: 0,
              y: 48,
          },
          {
              x: 16,
              y: 48,
          },
          {
              x: 32,
              y: 48,
          },
          {
              x: 48,
              y: 48,
          },
      ],
      idleRight: [
          {
              x: 0,
              y: 0,
          },
          {
              x: 16,
              y: 0,
          },
          {
              x: 32,
              y: 0,
          },
          {
              x: 48,
              y: 0,
          },
      ],
      idleLeft: [
          {
              x: 0,
              y: 16,
          },
          {
              x: 16,
              y: 16,
          },
          {
              x: 32,
              y: 16,
          },
          {
              x: 48,
              y: 16,
          },
      ],
  }
    this.stopIdle = false;
    this.moving = false;
    this.idle();
    this.drawMask = drawMask;
    this.effectsCtx = effectsCtx;
  }

  set gameMap(map) {
    this.#gameMap = map;
  }
  draw() {
    this.ctx.drawImage(
      this.image,
      this.frames["idleRight"][0].x,
      this.frames["idleLeft"][0].y,
      16,
      16,
      this.x * this.width,
      this.x * this.height,
      this.width,
      this.height
    );
  }
  undraw() {
    // clear ALL the canvas (window.innerWidth, window.innerHeight)
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  turnRed() {
    // turn red for a second twice
    
    setTimeout(() => {
      this.effectsCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      this.effectsCtx.fillRect((this.x * this.width), (this.y * this.height) , this.width, this.height );
    }, 200);
    setTimeout(() => {
      this.effectsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }, 300);
    setTimeout(() => {
      this.effectsCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      this.effectsCtx.fillRect((this.x * this.width), (this.y * this.height) , this.width, this.height );
    }, 400);
    setTimeout(() => {
      this.effectsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }, 500);
  }


  async move(dir) {

    if (this.moving) {
      return
    };
    this.moving = true;
    const values = {
      up: { x: 0, y: -1, contrary: 'down' },
      down: { x: 0, y: 1, contrary: 'up' },
      left: { x: -1, y: 0, contrary: 'left' },
      right: { x: 1, y: 0, contrary: 'right' },
    };
    const dy = values[dir].y;
    const dx = values[dir].x;
    
    if (Entity.gameMap.tiles[this.y + dy][this.x + dx].blocked) {
      this.moving = false;
      return
    }
    else {
      this.x += dx;
      this.y += dy;
    }
    const sfx = new Audio();
    sfx.type = 'audio/ogg';
    sfx.volume = 0.2

    const tile = this.#gameMap.tiles[this.y][this.x];
    if (tile.type === TextTiles.stairs) {
      window.globalDifficulty += 0.25;
      await this.reset();
      sfx.src = '../TileSet/audio/doorClose_3.ogg';
      sfx.play();
      this.moving = false;
      return;
    }
    if (tile.type === TextTiles.chest) {
      this.hp++;
      sfx.src = '../TileSet/audio/doorOpen_1.ogg'
      this.deleteChest(this.x, this.y, this.tileWidth, this.tileHeight)
    }
    if (tile.type === TextTiles.spikes) {
      this.hp--;
      this.drawUI();
      this.turnRed();
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
    

    const maxPosX = this.absX + this.tileWidth
    const maxPosY = this.absY + this.tileHeight
    const minPosX = this.absX - this.tileWidth
    const minPosY = this.absY - this.tileHeight
    let frame = 0;
    let refreshes = 0;
    this.stopIdle = true;

    const animateRight = () => {

      this.currentAnimation = 'runRight'
      const animationFrames = this.frames[this.currentAnimation];
      this.absX += 1;
      refreshes++;
      if (refreshes % 4 === 0) {
        frame++;
        if (frame > 3) {
          frame = 0;
        }
      }

      // undraw the player
      this.undraw();
      // draw the player
      this.ctx.drawImage(this.image, animationFrames[frame].x, animationFrames[frame].y, 16, 16, this.absX, this.absY, this.width, this.height);

      this.drawMask();

      if (this.absX < maxPosX) {
        requestAnimationFrame(animateRight);
      }
      else {
        this.stopIdle = false;
        this.lastDir = 'right';
        this.idle()
        this.moving = false;
      }
    }

    const animateLeft = () => {

      this.currentAnimation = 'runLeft'
      const animationFrames = this.frames[this.currentAnimation];
      this.absX -= 1;
      refreshes++;
      if (refreshes % 4 === 0) {
        frame++;
        if (frame > 3) {
          frame = 0;
        }
      }
      this.undraw();
      this.ctx.drawImage(this.image, animationFrames[frame].x, animationFrames[frame].y, 16, 16, this.absX, this.absY, this.width, this.height);

      this.drawMask();

      if (this.absX > minPosX) {
        requestAnimationFrame(animateLeft);
      }
      else {
        this.stopIdle = false;
        this.lastDir = 'left';
        this.idle()
        this.moving = false;
      }
    }

    const animateUp = () => {

      if (this.lastDir === 'right') this.currentAnimation = 'runRight';
      else this.currentAnimation = 'runLeft';
      const animationFrames = this.frames[this.currentAnimation];
      this.absY -= 1;
      refreshes++;
      if (refreshes % 4 === 0) {
        frame++;
        if (frame > 3) {
          frame = 0;
        }
      }
      this.undraw();
      this.ctx.drawImage(this.image, animationFrames[frame].x, animationFrames[frame].y, 16, 16, this.absX, this.absY, this.width, this.height);

      this.drawMask();

      if (this.absY > minPosY) {
        requestAnimationFrame(animateUp);
      }
      else {
        this.stopIdle = false;
        this.idle()
        this.moving = false;
      }
    }

    const animateDown = () => {

      if (this.lastDir === 'right') this.currentAnimation = 'runRight';
      else this.currentAnimation = 'runLeft';
      const animationFrames = this.frames[this.currentAnimation];
      this.absY += 1;
      refreshes++;
      if (refreshes % 4 === 0) {
        frame++;
        if (frame > 3) {
          frame = 0;
        }
      }
      this.undraw();
      this.ctx.drawImage(this.image, animationFrames[frame].x, animationFrames[frame].y, 16, 16, this.absX, this.absY, this.width, this.height);

      this.drawMask();

      if (this.absY < maxPosY) {
        requestAnimationFrame(animateDown);
      }
      else {
        this.stopIdle = false;
        this.idle()
        this.moving = false;
      }
    }

    switch (dir) {
      case 'up':
        animateUp();
        break;
      case 'down':
        animateDown();
        break;
      case 'left':
        animateLeft();
        break;
      case 'right':
        animateRight();
        break;
    }

    
    
    if (dir === 'left' || dir === 'right') {
      this.lastDir = dir;
    }
  }

  idle() {
    const animation = this.lastDir === 'right' ? 'idleRight' : 'idleLeft';

    const animationFrames = this.frames[animation];

    let frame = 0;

    const animate = () => {
      if (this.stopIdle) return;
      this.undraw();
      this.ctx.drawImage(this.image, animationFrames[frame].x, animationFrames[frame].y, 16, 16, this.absX, this.absY, this.width, this.height);
      frame++;
      if (frame > 3) {
        frame = 0;
      }
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000/8);
    }
    animate();
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
