import TextTiles from "./TextTiles.mjs";
export default class Entity {
    static gameMap = null;
    constructor(ctx, x, y, width, height, type, path, tileWidth, tileHeight, reset, gameOver) {
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
    }
    async draw() {
        console.log('drawing entity at ', this.x, this.y, this.absX, this.absY)
        const img = {
            src: this.path,
            x: this.absX,
            y: this.absY,
            width: this.width,
            height: this.height
        }
        await this.drawImages([img]);
    }
    async undraw() {
        this.ctx.clearRect(this.absX, this.absY, this.width, this.height);
    }
    drawImages(images) {
        return new Promise((resolve, reject) => {
            if (images.length === 0) {
                resolve();
                return;
            }
    
            const img = images.shift();
            const imgToDraw = new Image();
            imgToDraw.src = img.src;
    
            imgToDraw.onload = () => {
                this.ctx.drawImage(imgToDraw, img.x, img.y, img.width, img.height);
                console.log('drawing images');
                this.drawImages(images).then(resolve);
            };
    
            imgToDraw.onerror = reject;
        });
    }
    async move(direction) {
        switch (direction) {
            case 'up':
                if (Entity.gameMap.tiles[this.y - 1][this.x].blocked) return;
                await this.undraw();
                this.absY -= this.tileHeight;
                this.y -= 1;
                break;
            case 'down':
                if (Entity.gameMap.tiles[this.y + 1][this.x].blocked) return;
                await this.undraw();
                this.absY += this.tileHeight;
                this.y += 1;
                break;
            case 'left':
                if (Entity.gameMap.tiles[this.y][this.x - 1].blocked) return;
                await this.undraw();
                this.absX -= this.tileWidth;
                this.x -= 1;
                break;
            case 'right':
                if (Entity.gameMap.tiles[this.y][this.x + 1].blocked) return;
                await this.undraw();
                this.absX += this.tileWidth;
                this.x += 1;
                break;
            }
        console.log(Entity.gameMap.tiles[this.y][this.x].type)
        const tile = Entity.gameMap.tiles[this.y][this.x];
        if (tile.type === TextTiles.stairs) {
            this.reset()
        }
        if (tile.type === TextTiles.spikes) {
            this.gameOver()
        }
        await this.draw();
    }
    get absPosition() {
        return {
            x: this.absX,
            y: this.absX
        }
    }
    get position() {
        return {
            x: this.x,
            y: this.y 
        }
    }
}