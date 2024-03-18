import Tile from './Tile.mjs';
import Rectangle from './Rectangle.mjs';
import { randint } from './utility.mjs';
import TextTiles from './TextTiles.mjs';

export default class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = this._generateMap();
    }

    _generateMap() {
        let map = [];
        for (let y = 0; y < this.height; y++) {
            map.push([]);
            for (let x = 0; x < this.width; x++) {
                map[y].push(new Tile(TextTiles.wall, true));
            }
        }

        return map;
    }
    generateCollissionMap() {
        const collissionMap = [];
        
        for (let y = 0; y < this.height; y++) {
            collissionMap.push([]);
            for (let x = 0; x < this.width; x++) {
                collissionMap[y].push(this.tiles[y][x].blocked ? 1 : 0);
            }
        }
        return collissionMap;
    }

    makeMap(maxRooms = 20, roomMinSize = 6, roomMaxSize = 10, mapWidth = 80, mapHeight = 50, difficulty = 1) {
        
        const rooms = [];
        let numRooms = 0;
        const spawnPoint = { x: 0, y: 0 };
        const chestLocation = { x: 0, y: 0 };

        
        const maxEnemiesPerRoom = Math.floor(difficulty * (maxRooms/5))
        const enemyLocations = [];

        for (let i = 0; i < maxRooms; i++) {
            const w = randint(roomMinSize, roomMaxSize);
            const h = randint(roomMinSize, roomMaxSize);
            const x = randint(0, this.width - w - 1);
            const y = randint(0, this.height - h - 1);

            const newRoom = new Rectangle(x, y, w, h);

            let failed = false;

            for (let otherRoom of rooms) {
                if (newRoom.intersects(otherRoom)) {
                    failed = true;
                    break;
                }
            }

            if (!failed) {
                this.createRoom(newRoom);

                const [newX, newY] = newRoom.center();

                chestLocation.x = newX;
                chestLocation.y = newY;

                if (numRooms === 0) {
                    // This is the first room, where the player starts
                    spawnPoint.x = newX;
                    spawnPoint.y = newY;
                    
                } else {
                    // All rooms after the first
                    const [prevX, prevY] = rooms[numRooms - 1].center();

                    const tunnelWidth = randint(0, 2);

                    if (randint(0, 1) === 1) {
                        // First move horizontally, then vertically
                        this.createHTunnel(prevX, newX, prevY, tunnelWidth);
                        this.createVTunnel(prevY, newY, newX, tunnelWidth);
                    } else {
                        // First move vertically, then horizontally
                        this.createVTunnel(prevY, newY, prevX, tunnelWidth);
                        this.createHTunnel(prevX, newX, newY, tunnelWidth);
                    }
                    // Place enemies randomly in the room
                    const enemiesInRoom = randint(0, maxEnemiesPerRoom);
                    for (let i = 0; i < enemiesInRoom; i++) {
                        const enemyX = randint(newRoom.x1 + 1, newRoom.x2 - 1);
                        const enemyY = randint(newRoom.y1 + 1, newRoom.y2 - 1);
                        enemyLocations.push({ x: enemyX, y: enemyY });
                    }
                    
                }

                rooms.push(newRoom);
                numRooms++;
            }

        }
        this.tiles[spawnPoint.y][spawnPoint.x] = new Tile(TextTiles.player, false);
        for (let enemy of enemyLocations) {
            this.tiles[enemy.y][enemy.x] = new Tile(TextTiles.enemy, true);
        }
        this.tiles[chestLocation.y][chestLocation.x] = new Tile(TextTiles.chest, false);

    }

    createRoom(room) {
        for (let x = room.x1 + 1; x < room.x2; x++) {
            for (let y = room.y1 + 1; y < room.y2; y++) {
                this.tiles[y][x] = new Tile(TextTiles.floor, false);
            }
        }
    }

    createHTunnel(x1, x2, y, width = 1) {
        for (let x = Math.min(x1, x2); x < Math.max(x1, x2) + 1; x++) {
            for (let w = Math.floor(width / 2) * -1; w < Math.ceil(width / 2); w++) {
                this.tiles[y + w][x].blocked = false;
                this.tiles[y + w][x].blockSight = false;
                this.tiles[y + w][x].type = TextTiles.floor;
            }
        }
    }

    createVTunnel(y1, y2, x, width=1) {
        for (let y = Math.min(y1, y2); y < Math.max(y1, y2) + 1; y++) {
            for (let w = Math.floor(width / 2) * -1; w < Math.ceil(width / 2); w++) {
                this.tiles[y][x + w].blocked = false;
                this.tiles[y][x + w].blockSight = false;
                this.tiles[y][x + w].type = TextTiles.floor;
            }
        }
    }


    renderToConsole() {
        for (let y = 0; y < this.height; y++) {
            let line = '';
            for (let x = 0; x < this.width; x++) {
                line += this.tiles[y][x].type;
            }
            console.log(line);
        }
    }
    renderCollissionMapToConsole() {
        const collissionMap = this.generateCollissionMap();
        for (let y = 0; y < this.height; y++) {
            let line = '';
            for (let x = 0; x < this.width; x++) {
                line += collissionMap[y][x];
            }
            console.log(line);
        }
    }
}
