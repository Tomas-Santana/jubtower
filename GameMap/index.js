import GameMap from "./GameMap.mjs";
import MapTiles from './MapTiles.mjs';
import Tiler from "./Tiler.mjs";
import Entity from "./Entity.js";
import TextTiles from "./TextTiles.mjs";
import time from './Timer.js'
import Player from "./player.js";
time.loop(window)

const width = 50;
const height = 30;
const roomMaxSize = 12;
const roomMinSize = 4;
const tileSize = 16;
const levelTime = 30;
let playing = false;

window.globalDifficulty = 0;

const background = document.createElement('canvas');
background.style.position = 'absolute';
background.width = width * tileSize;
background.height = height * tileSize;
document.body.appendChild(background);

const backgroundCtx = background.getContext('2d');

// draw black rectancle as background
backgroundCtx.fillStyle = 'black';
backgroundCtx.fillRect(0, 0, width * tileSize, height * tileSize);

const playingMusic = new Audio('../TileSet/audio/dungeon.mp3');
playingMusic.loop = true;
playingMusic.volume = 0.4;

const deadMusic = new Audio('../Tileset/audio/death.mp3');
deadMusic.loop = true;
deadMusic.volume = 0.4;

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

const deleteChest = (x, y, w, h) => {
  const floor = new Image()
  floor.src = '../TileSet/frames/floor_1.png';
  floor.onload = () => {
    backgroundCtx.drawImage(floor, x, y, w, h)
  }
}

const drawUI = () => {
  uiCtx.clearRect(0, 0, width * tileSize, height * tileSize);
  uiCtx.fillStyle = 'white';
  uiCtx.font = '20px Arial';
  uiCtx.fillText(`Time: ${remainingTime}`, 700, 50);
  uiCtx.fillText(`Score: ${score}`, 700, 70);
  uiCtx.fillText(`HP: ${player.hp}`, 700, 90);
}

const player = new Entity(foregroundCtx, gameMap.spawnpoint.x, gameMap.spawnpoint.y, tileSize, tileSize, 'player', MapTiles[TextTiles.player].path, tileSize, tileSize, newLevel, gameOver, gameMap, drawUI, deleteChest)

const drawLevel = async () => {
    // add an overlay
    overlayCtx.fillStyle = 'rgba(0, 0, 0)';
    overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    // add text to the overlay
    overlayCtx.fillStyle = 'white';
    overlayCtx.font = '30px Arial';
    overlayCtx.fillText('Generating Level...', 300, 210);
    Entity.gameMap = gameMap;
    tiler.entities.push(player);
    await tiler.tile();
    player.draw();
    overlayCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    drawMask();
}

async function gameOver() {
  playingMusic.pause();
  deadMusic.play();
  uiCtx.clearRect(0, 0, width * tileSize, height * tileSize);
  overlayCtx.fillStyle = 'rgba(0, 0, 0)';
  overlayCtx.fillRect(0, 0, width * tileSize, height * tileSize);
  overlayCtx.fillStyle = 'white';
  overlayCtx.font = '30px Arial';
  overlayCtx.fillText('Game Over', 325, 100);
  overlayCtx.fillText('Click to restart', 310, 140);

  overlay.onclick = async () => {
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    overlay.onclick = null;
    await newLevel();
    remainingTime = levelTime+1;
    score = 0;
    deadMusic.pause()
    deadMusic.currentTime = 0;
    newGame();
  }
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
    maskCtx.arc(
        player.absX + tileSize / 2,
        player.absY + tileSize / 2, 
        tileSize * 50, 0, Math.PI * 2
    );
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

    
    await gameMap.makeMap(25, roomMinSize, roomMaxSize, width, height, .5 + window.globalDifficulty);
    
    backgroundCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    tiler.map = gameMap;
    player.gameMap = gameMap;
    tiler.entities = [];
    tiler.entities.push(player);
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(0, 0, width * tileSize, height * tileSize);
    player.x = gameMap.spawnpoint.x;
    player.absX = gameMap.spawnpoint.x * tileSize;
    player.y = gameMap.spawnpoint.y;
    player.absY = gameMap.spawnpoint.y * tileSize;
    foregroundCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    overlayCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    drawMask();
    await tiler.tile();
    player.draw();

    overlayCtx.clearRect(0, 0, width * tileSize, height * tileSize);
    remainingTime = levelTime;
    score += 100;

}

document.addEventListener('keydown', (e) => {
    if (!playing) return;
    switch (e.key) {
        case 'ArrowUp':
            player.move('up');
            drawMask();
            break;
        case 'ArrowDown':
            player.move('down');
            break;
        case 'ArrowLeft':
            player.move('left');
            break;
        case 'ArrowRight':
            player.move('right');
            break;
        default:
            break;
    }
    drawMask();
})

// add a timer to the ui canvas

const ui = document.createElement('canvas');
ui.style.position = 'absolute';
ui.width = width * tileSize;
ui.height = height * tileSize;
document.body.appendChild(ui);

const uiCtx = ui.getContext('2d');

var remainingTime = 30+1;
var score = 0;



const newGame = () => {
  playingMusic.currentTime = 0;
  playingMusic.play();
  const countDown = setInterval(() => {
    remainingTime -= 1;
    drawUI();

    if (remainingTime === 0) {
        clearInterval(countDown);
        gameOver();
    }
  }, 1000);
}

overlayCtx.fillStyle = 'white'
overlayCtx.font = ' 24px arial'
overlayCtx.fillText('Jubert\'s Tower', 320, 120);
overlayCtx.font = '16px arial'
overlayCtx.fillText('By: Jose Carrillo, Rafael Mata, Tomas Santana y Marlon Urdaneta.', 0, 470);
overlayCtx.fillText('Click to start', 355, 160);

overlay.onclick = () => {
  playingMusic.play();
  playing = true;
  overlay.onclick = null;
  drawLevel();
  newGame();
}
