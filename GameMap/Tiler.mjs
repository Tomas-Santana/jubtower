import GameMap from "./GameMap.mjs";
import MapTiles from "./MapTiles.mjs";
import TextTiles from "./TextTiles.mjs";

export default class Tiler {
    constructor(ctx, map, tileset, tileWidth, tileHeight) {
        this.ctx = ctx;
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
                console.log('drawing images');
                this.drawImages(images).then(resolve);
            };
    
            imgToDraw.onerror = reject;
        });
    }
}