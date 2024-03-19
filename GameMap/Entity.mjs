export default class Entity {
    constructor(ctx, x, y, width, height, type, path, tileWidth, tileHeight) {
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
        await this.drawImage(img);
    }
    async undraw() {
        this.ctx.clearRect(this.absX, this.absY, this.width, this.height);
    }
    async drawImage(image) {
        return new Promise((resolve, reject) => {
            const imgToDraw = new Image();
            imgToDraw.src = image.src;

            imgToDraw.onload = () => {
                this.ctx.drawImage(imgToDraw, image.x, image.y, image.width, image.height);
                resolve
            }
            imgToDraw.onerror = (err) => {
                reject(err);
            }
        })
    }
    async move(direction) {
        await this.undraw();
        switch (direction) {
            case 'up':
                this.absY -= this.tileHeight;
                this.y -= 1;
                break;
            case 'down':
                this.absY += this.tileHeight;
                this.y += 1;
                break;
            case 'left':
                this.absX -= this.tileWidth;
                this.x -= 1;
                break;
            case 'right':
                this.absX += this.tileWidth;
                this.x += 1;
                break;
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