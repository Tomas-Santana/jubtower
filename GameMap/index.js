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
Entity.gameMap = gameMap;

const background = document.createElement('canvas');
background.style.position = 'absolute';
background.width = width * tileSize;
background.height = height * tileSize;
document.body.appendChild(background);

const backgroundCtx = background.getContext('2d');

// draw black rectancle as background
backgroundCtx.fillStyle = 'black';
backgroundCtx.fillRect(0, 0, width * tileSize, height * tileSize);

const tiler = new Tiler(backgroundCtx, gameMap, MapTiles, tileSize, tileSize);

const foreground = document.createElement('canvas');
foreground.style.position = 'absolute';
foreground.width = width * tileSize;
foreground.height = height * tileSize;
document.body.appendChild(foreground);

const foregroundCtx = foreground.getContext('2d');

const player = new Entity(foregroundCtx, gameMap.spawnpoint.x, gameMap.spawnpoint.y, tileSize, tileSize, 'player', MapTiles['@'].path, tileSize, tileSize);

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




