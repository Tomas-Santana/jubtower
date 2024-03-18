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
                if (tileType === TextTiles.enemy || tileType === TextTiles.player || tileType === TextTiles.chest) {
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

                sceneImages.push(tileImage);
            }
        }
        console.log(entityImages)
        const images = sceneImages.concat(entityImages);
        await this.drawImages(images);
        

    }
    async drawImages(images) {
        return new Promise((resolve, reject) => {
            const img = images.shift();
            const imgToDraw = new Image();
            imgToDraw.src = img.src;

            imgToDraw.onload = () => {
                this.ctx.drawImage(imgToDraw, img.x, img.y, img.width, img.height);
                if (images.length > 0) {
                    this.drawImages(images)
                } else {
                    resolve();
                }
            }
            imgToDraw.onerror = (err) => {
                reject(err);
            }
        })


    }
}