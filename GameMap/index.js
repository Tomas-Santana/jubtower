import GameMap from "./GameMap.mjs";
import MapTiles from './MapTiles.mjs';
import Tiler from "./Tiler.mjs";
import Entity from "./Entity.mjs";
import TextTiles from "./TextTiles.mjs";

const width = 50;
const height = 30;
const roomMaxSize = 12;
const roomMinSize = 4;
const tileSize = 16;



const background = document.createElement('canvas');
background.style.position = 'absolute';
background.width = width * tileSize;
background.height = height * tileSize;
document.body.appendChild(background);

const backgroundCtx = background.getContext('2d');

// draw black rectancle as background
backgroundCtx.fillStyle = 'black';
backgroundCtx.fillRect(0, 0, width * tileSize, height * tileSize);

const foreground = document.createElement('canvas');
foreground.style.position = 'absolute';
foreground.width = width * tileSize;
foreground.height = height * tileSize;
document.body.appendChild(foreground);

const foregroundCtx = foreground.getContext('2d');

// overlay
const overlay = document.createElement('canvas');
overlay.style.position = 'absolute';
overlay.width = width * tileSize;
overlay.height = height * tileSize;
overlay.style.zIndex = 100;
document.body.appendChild(overlay);

const overlayCtx = overlay.getContext('2d');

export const gameMap = new GameMap(width, height);
gameMap.makeMap(25, roomMinSize, roomMaxSize, width, height, .5);
const tiler = new Tiler(backgroundCtx, gameMap, MapTiles, tileSize, tileSize);
const player = new Entity(foregroundCtx, gameMap.spawnpoint.x, gameMap.spawnpoint.y, tileSize, tileSize, 'player', MapTiles[TextTiles.player].path, tileSize, tileSize, newLevel, gameOver)


const drawLevel = async () => {
    // add an overlay
    overlayCtx.fillStyle = 'rgba(0, 0, 0)';
    overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    // add text to the overlay
    overlayCtx.fillStyle = 'white';
    overlayCtx.font = '30px Arial';
    overlayCtx.fillText('Generating Level...', 100, 100);
    Entity.gameMap = gameMap;
    tiler.entities.push(player);
    await tiler.tile();
    player.draw();
    overlayCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    drawMask();
}
drawLevel();

async function gameOver() {
    overlayCtx.fillStyle = 'rgba(0, 0, 0)';
    overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    overlayCtx.fillStyle = 'white';
    overlayCtx.font = '30px Arial';
    overlayCtx.fillText('Game Over', 100, 100);
}

var mask = document.createElement('canvas');
mask.style.position = 'absolute';
mask.width = width * tileSize;
mask.height = height * tileSize;
document.body.appendChild(mask);

var maskCtx = mask.getContext('2d');

function drawMask() {
    maskCtx.save();
    maskCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    maskCtx.fillStyle = 'rgba(0, 0, 0)';
    maskCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    maskCtx.beginPath();
    maskCtx.arc(player.absX + tileSize / 2, player.absY + tileSize / 2, tileSize * 3, 0, Math.PI * 2);
    maskCtx.clip();
    maskCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    maskCtx.restore();
}


async function newLevel() {
    // clear mask
    maskCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    // clear the canvas
    overlayCtx.fillStyle = 'rgba(0, 0, 0)';
    overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    // add text to the overlay
    overlayCtx.fillStyle = 'white';
    overlayCtx.font = '30px Arial';
    overlayCtx.fillText('Generating Level...', 100, 100);

    foregroundCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    backgroundCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    
    await gameMap.makeMap(25, roomMinSize, roomMaxSize, width, height, .5);

    tiler.map = gameMap;
    tiler.entities = [];
    tiler.entities.push(player);
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    player.x = gameMap.spawnpoint.x;
    player.absX = gameMap.spawnpoint.x * tileSize;
    player.y = gameMap.spawnpoint.y;
    player.absY = gameMap.spawnpoint.y * tileSize;
    await tiler.tile();
    player.draw();

    overlayCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    time = 31;
    score += 100;

}

document.addEventListener('keydown', async (e) => {
    if (e.repeat) return;
    switch (e.key) {
        case 'ArrowUp':
            await player.move('up');
            drawMask();
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
    drawMask();
    console.log('player at', player.x, player.y, 'retiling')
})

// add a timer to the ui canvas

const ui = document.createElement('canvas');
ui.style.position = 'absolute';
ui.width = width * tileSize;
ui.height = height * tileSize;
document.body.appendChild(ui);

const uiCtx = ui.getContext('2d');

var time = 31;
var score = 0;

const timer = setInterval(() => {
    time -= 1;
    uiCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    uiCtx.fillStyle = 'white';
    uiCtx.font = '20px Arial';
    uiCtx.fillText(`Time: ${time}`, 700, 50);
    uiCtx.fillText(`score: ${score}`, 700, 70);
    if (time === 0) {
        clearInterval(timer);
        uiCtx.clearRect(0, 0, width * tileSize, height * tileSize);
        overlayCtx.fillStyle = 'rgba(0, 0, 0)';
        overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
        overlayCtx.fillStyle = 'white';
        overlayCtx.font = '30px Arial';
        overlayCtx.fillText('Game Over', 100, 100);
    }
}, 1000);





