import Phaser from 'phaser';
//import Dungeon from '@mikewesthad/dungeon';
import Player from "./player.js";
//import TILES from "./tile-mapping.js";
//import TilemapVisibility from "./tilemap-visibility.js";

/**
 * Scene that generates a new dungeon
 */
export default class WorldScene extends Phaser.Scene {
  constructor() {
    super();
    this.level = 0;
  }

  preload() {
    this.load.path("assets/");
    this.load.image("tiles", "overworldtiles.png");
    this.load.image("link_up1", "link_up1.png");
    this.load.image("link_up2", "link_up2.png");
    this.load.image("link_left1", "link_left1.png");
    this.load.image("link_left2", "link_left2.png");
    this.load.image("link_down1", "link_down1.png");
    this.load.image("link_down2", "link_down2.png");
  }

  create() {

    // Creating a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 16,
      height: 11,
    });
    const tileset = map.addTilesetImage("tiles", null, 16, 16, 1, 2); // 1px margin, 2px spacing
    this.groundLayer = map.createBlankDynamicLayer("Ground", tileset); //.fill(TILES.BLANK);
    this.objectLayer = map.createBlankDynamicLayer("Object", tileset);

    //const { x, y, width, height, left, right, top, bottom } = room;

    // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
    // See "Weighted Randomize" example for more information on how to use weightedRandomize.
    //this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR);

    // Place the room corners tiles
    //this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
    //this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
    //this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
    //this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

    // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
    //this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
    //this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
    //this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
    //this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

    // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
    // room's location. Each direction has a different door to tile mapping.
    //var doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
    //for (var i = 0; i < doors.length; i++) {
    //  if (doors[i].y === 0) {
    //    this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
    //  } else if (doors[i].y === room.height - 1) {
    //    this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
    //  } else if (doors[i].x === 0) {
    //    this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 1);
    //  } else if (doors[i].x === room.width - 1) {
    //    this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 1);
    //  }
    //}


    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    //this.groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);
    //this.stuffLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

    //this.stuffLayer.setTileIndexCallback(TILES.STAIRS, () => {
    //  this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null);
    //  this.player.freeze();
    //  const cam = this.cameras.main;
    //  cam.fade(250, 0, 0, 0);
    //  cam.once("camerafadeoutcomplete", () => {
    //    this.player.destroy();
    //    this.scene.restart();
    //  });
    //});

    // Place the player in the first room
    //const playerRoom = startRoom;
    //const x = map.tileToWorldX(playerRoom.centerX);
    //const y = map.tileToWorldY(playerRoom.centerY);
    
    const x = 8;
    const y = 5;
    
    this.player = new Player(this, x, y);

    // Watch the player and tilemap layers for collisions, for the duration of the scene:
    //this.physics.add.collider(this.player.sprite, this.groundLayer);
    //this.physics.add.collider(this.player.sprite, this.objectLayer);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //camera.startFollow(this.player.sprite);

    // Help text that has a "fixed" position on the screen
    //this.add
    //  .text(16, 16, `Find the stairs. Go deeper.\nCurrent level: ${this.level}`, {
    //    font: "18px monospace",
    //    fill: "#000000",
    //    padding: { x: 20, y: 10 },
    //    backgroundColor: "#ffffff"
    //  })
    //  .setScrollFactor(0);
  }

  update(time, delta) {
    this.player.update();

    // Find the player's room using another helper method from the dungeon that converts from
    // dungeon XY (in grid units) to the corresponding room object
    const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
    const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
    //const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);

    //this.tilemapVisibility.setActiveRoom(playerRoom);
  }
}
