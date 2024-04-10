import GameMap from "./GameMap.mjs";
import MapTiles from "./MapTiles.mjs";
import TextTiles from "./TextTiles.mjs";

export default class Tiler {
    constructor(ctx, foreGroundCtx, map, tileset, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.foregroundCtx = foreGroundCtx;
        this.map = map;
        this.tileset = tileset;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.entities = [];

    }
    async tile() {
        const sceneImages = [];
        const entityImages = [];
        for (let y = 0; y < this.map.tiles.length; y++) {
            for (let x = 0; x < this.map.tiles[y].length; x++) {
                const tile = this.map.tiles[y][x];
                const tileType = tile.type;
                let tileImage = {
                    src: this.tileset[tileType].path,
                    x: x * this.tileWidth,
                    y: y * this.tileHeight,
                    width: this.tileWidth,
                    height: this.tileHeight
                }
                if (tileType === TextTiles.enemy || tileType === TextTiles.chest || tileType === TextTiles.stairs) {
                    entityImages.push(tileImage);
                    let sceneImage = {
                        src: this.tileset[TextTiles.floor].path,
                        x: x * this.tileWidth,
                        y: y * this.tileHeight,
                        width: this.tileWidth,
                        height: this.tileHeight
                    }
                    sceneImages.push(sceneImage);
                    continue;
                }
                if (tileType === TextTiles.player)  {
                    let sceneImage = {
                        src: this.tileset[TextTiles.floor].path,
                        x: x * this.tileWidth,
                        y: y * this.tileHeight,
                        width: this.tileWidth,
                        height: this.tileHeight
                    }
                    sceneImages.push(sceneImage);
                    continue;
                }
                if (tileType === TextTiles.wall) {
                    continue;
                }

                sceneImages.push(tileImage);
            }
        }
        const images = sceneImages.concat(entityImages);
        await this.drawImages(images);

    }
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    async tileWithFog(player, radius = 10) {
        const sceneImages = [];
        const entityImages = [];
        const playerPosition = {
            x: player.x,
            y: player.y
        }

        for (let y = Math.max(0, playerPosition.y - radius); y <= Math.min(this.map.tiles.length - 1, playerPosition.y + radius); y++){
            for (let x = Math.max(0, playerPosition.x - radius); x <= Math.min(this.map.tiles[y].length - 1, playerPosition.x + radius); x++) {
                const tile = this.map.tiles[y][x];
                const tileType = tile.type;
                let tileImage = {
                    src: this.tileset[tileType].path,
                    x: x * this.tileWidth,
                    y: y * this.tileHeight,
                    width: this.tileWidth,
                    height: this.tileHeight
                }
                if (tileType === TextTiles.enemy || tileType === TextTiles.chest || tileType === TextTiles.stairs) {
                    entityImages.push(tileImage);
                    let sceneImage = {
                        src: this.tileset[TextTiles.floor].path,
                        x: x * this.tileWidth,
                        y: y * this.tileHeight,
                        width: this.tileWidth,
                        height: this.tileHeight
                    }
                    sceneImages.push(sceneImage);
                    continue;
                }
                if (tileType === TextTiles.player)  {
                    let sceneImage = {
                        src: this.tileset[TextTiles.floor].path,
                        x: x * this.tileWidth,
                        y: y * this.tileHeight,
                        width: this.tileWidth,
                        height: this.tileHeight
                    }
                    sceneImages.push(sceneImage);
                    continue;
                }
                if (tileType === TextTiles.wall) {
                    continue;
                }

                sceneImages.push(tileImage);
            }
        }
        const images = sceneImages.concat(entityImages);
        await this.drawImages(images);
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
                this.drawImages(images).then(resolve);
            };
    
            imgToDraw.onerror = reject;
        });
    }
}