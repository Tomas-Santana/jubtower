import Tile from './Tile.mjs';
import Rectangle from './Rectangle.mjs';
import { randint } from './utility.mjs';
import TextTiles from './TextTiles.mjs';

export default class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = this._generateMap();
        this.entities = [];
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
        this.spawnpoint = { x: 0, y: 0 };
        const chestLocation = { x: 0, y: 0 };
        const stairsLocation = { x: 0, y: 0 };

        
        const maxSpikesPerRoom = Math.floor(difficulty * (maxRooms/2))
        const spikesLocations = [];

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
                    this.spawnpoint.x = newX;
                    this.spawnpoint.y = newY;
                    this.entities.push({type: 'player', x: newX, y: newY});
                    
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
                    // Place stairs in the third room
                    if (numRooms === 2) {
                        stairsLocation.x = newX;
                        stairsLocation.y = newY;
                    }

                    // Place enemies randomly in the room
                    const spikesInRoom = randint(0, maxSpikesPerRoom);
                    for (let i = 0; i < spikesInRoom; i++) {
                        const enemyX = randint(newRoom.x1 + 1, newRoom.x2 - 1);
                        const enemyY = randint(newRoom.y1 + 1, newRoom.y2 - 1);
                        spikesLocations.push({ x: enemyX, y: enemyY });
                        this.entities.push({type: 'spikes', x: enemyX, y: enemyY});
                    }
                    
                }

                rooms.push(newRoom);
                numRooms++;
            }

        }
        this.tiles[this.spawnpoint.y][this.spawnpoint.x] = new Tile(TextTiles.player, false);
        for (let enemy of spikesLocations) {
            this.tiles[enemy.y][enemy.x] = new Tile(TextTiles.spikes, false);
        }
        this.tiles[chestLocation.y][chestLocation.x] = new Tile(TextTiles.chest, false);
        this.tiles[stairsLocation.y][stairsLocation.x] = new Tile(TextTiles.stairs, false);

        this.entities.push({type: 'chest', x: chestLocation.x, y: chestLocation.y});
        this.entities.push({type: 'stairs', x: stairsLocation.x, y: stairsLocation.y});

    }

    createRoom(room) {
        for (let x = room.x1 + 1; x < room.x2; x++) {
            for (let y = room.y1 + 1; y < room.y2; y++) {
                this.tiles[y][x] = new Tile(TextTiles.floor, false);
            }
        }
        // Add 'L' to left wall
        // for (let y = room.y1; y < room.y2; y++) {
        //     this.tiles[y][room.x1] = new Tile(TextTiles.leftWall, true);
        // }
        // // Add 'R' to right wall
        // for (let y = room.y1; y < room.y2; y++) {
        //     this.tiles[y][room.x2] = new Tile(TextTiles.rightWall, true);
        // }
        // // Add 'T' to top wall
        // for (let x = room.x1; x < room.x2; x++) {
        //     this.tiles[room.y1][x] = new Tile(TextTiles.topWall, true);
        // }
        // // Add 'B' to bottom wall
        // for (let x = room.x1; x < room.x2; x++) {
        //     this.tiles[room.y2][x] = new Tile(TextTiles.bottomWall, true);
        // }
        // // add corners
        // this.tiles[room.y1][room.x1] = new Tile(TextTiles.topLeftCorner, true);
        // this.tiles[room.y1][room.x2] = new Tile(TextTiles.topRightCorner, true);
        // this.tiles[room.y2-1][room.x1] = new Tile(TextTiles.bottomLeftCorner, true);
        // this.tiles[room.y2-1][room.x2] = new Tile(TextTiles.bottomRightCorner, true);
    }

    createHTunnel(x1, x2, y) {
        for (let x = Math.min(x1, x2); x < Math.max(x1, x2) + 1; x++) {
            this.tiles[y][x].blocked = false;
            this.tiles[y][x].blockSight = false;
            this.tiles[y][x].type = TextTiles.floor;
            this.tiles[y + 1][x].blocked = false;
            this.tiles[y + 1][x].blockSight = false;
            this.tiles[y + 1][x].type = TextTiles.floor;
            this.tiles[y - 1][x].blocked = false;
            this.tiles[y - 1][x].blockSight = false;
            this.tiles[y - 1][x].type = TextTiles.floor;

        }
        
    }

    createVTunnel(y1, y2, x) {
        for (let y = Math.min(y1, y2); y < Math.max(y1, y2) + 1; y++) {
            this.tiles[y][x].blocked = false;
            this.tiles[y][x].blockSight = false;
            this.tiles[y][x].type = TextTiles.floor;
            this.tiles[y][x + 1].blocked = false;
            this.tiles[y][x + 1].blockSight = false;
            this.tiles[y][x + 1].type = TextTiles.floor;
            this.tiles[y][x - 1].blocked = false;
            this.tiles[y][x - 1].blockSight = false;
            this.tiles[y][x - 1].type = TextTiles.floor;
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
