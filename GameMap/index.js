import GameMap from "./GameMap.mjs";
import MapTiles from './MapTiles.mjs';
import Tiler from "./Tiler.mjs";

const width = 60;
const height = 37;
const roomMaxSize = 10;
const roomMinSize = 3;
const tileSize = 16;

const gameMap = new GameMap(width, height);
gameMap.makeMap(20, roomMinSize, roomMaxSize, width, height, .5);
gameMap.renderToConsole();

const canvas = document.createElement('canvas');
canvas.width = width * tileSize;
canvas.height = height * tileSize;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const tiler = new Tiler(ctx, gameMap, MapTiles, tileSize, tileSize);
tiler.tile();


