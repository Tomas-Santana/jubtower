import GameMap from "./GameMap.mjs";
import MapTiles from './MapTiles.mjs';
import Tiler from "./Tiler.mjs";
import Entity from "./Entity.mjs";

const width = 60;
const height = 37;
const roomMaxSize = 12;
const roomMinSize = 4;
const tileSize = 16;

export const gameMap = new GameMap(width, height);
gameMap.makeMap(25, roomMinSize, roomMaxSize, width, height, .5);

const canvas = document.createElement('canvas');
canvas.width = width * tileSize;
canvas.height = height * tileSize;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const tiler = new Tiler(ctx, gameMap, MapTiles, tileSize, tileSize);


const player = new Entity(ctx, gameMap.spawnpoint.x, gameMap.spawnpoint.y, tileSize, tileSize, 'player', MapTiles['@'].path, tileSize, tileSize);

tiler.entities.push(player);
const drawLevel = async () => {
    await tiler.tile();
    player.draw();
}
drawLevel();

document.addEventListener('keydown', async (e) => {
    switch (e.key) {
        case 'ArrowUp':
            await player.move('up');
            break;
        case 'ArrowDown':
            await player.move('down');
            break;
        case 'ArrowLeft':
            await player.move('left');
            break;
        case 'ArrowRight':
            await player.move('right');
            break;
        default:
            break;
    }
})




