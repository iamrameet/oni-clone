/// <reference path="../library/dom.js"/>
/// <reference path="tiles.js"/>
/// <reference path="biome.js"/>

const TILE_SIZE = 48;
const TILE_H = window.innerWidth / TILE_SIZE;
const TILE_V = window.innerHeight / TILE_SIZE;

const TN = Tiles.natural;

const Level = new class Level{
  /** @type {number[][]} */
  naturalTiles = [];
  biome = {
    temperate: new Biome([
      ...Tiles.makeCopies(TN.Dirt, 2),
      ...Tiles.makeCopies(TN.Coal, 1),
      ...Tiles.makeCopies(TN.Sand, 1),
      ...Tiles.makeCopies(TN.Sandstone, 2),
      ...Tiles.makeCopies(TN.Copper, 1),
      ...Tiles.makeCopies(TN.Fertilizer, 1),
      ...Tiles.makeCopies(TN.Algae, 2)
    ]),
    forest: new Biome([
      ...Tiles.makeCopies(TN.Dirt, 2),
      TN.Aluminum,
      TN.Phosphorite,
      TN.IgneousRock,
      TN.Dirt,
      TN.Phosphorite,
      ...Tiles.makeCopies(TN.IgneousRock, 2),
    ], .6),
    metalArea: new Biome([TN.Limestone, TN.IgneousRock]),
  }
  generate(width, height){
    for(let x = 0; x < width; x++){
      this.naturalTiles[x] = [];
      for(let y = 0; y < height; y++)
        this.naturalTiles[x][y] = 1;
    }
  }
  /** @param {number[][]} tiles */
  overrideNaturalTiles(tiles, offsetX = 0, offsetY = 0){
    const start = {
      x: Math.max(0, offsetX),
      y: Math.max(0, offsetY)
    };
    const end = {
      x: Math.min(this.naturalTiles.length, tiles.length + offsetX),
      y: Math.min(this.naturalTiles[0].length, tiles[0].length + offsetY)
    };
    console.log(start, end)
    for(let x = start.x; x < end.x; x++){
      const new_x = x - offsetX;
      for(let y = start.y; y < end.y; y++){
        const new_y = y - offsetY;
        this.naturalTiles[x][y] = tiles[new_x][new_y];
      }
    }
  }
};

function main(){

  Level.generate(100, 100);
  Level.overrideNaturalTiles(Level.biome.temperate.construct(20, 20), 1, 1);
  Level.overrideNaturalTiles(Level.biome.forest.construct(20, 20), 1, 22);
  Level.overrideNaturalTiles(Level.biome.metalArea.construct(20, 20), 22, 1);

  for(let x = 0; x < Level.naturalTiles.length; x++){
    for(let y = 0; y < Level.naturalTiles[x].length; y++){
      // const index = randomInt(0, 3);
      const index = Level.naturalTiles[x][y];
      const naturalTile = Tiles.getNaturalTile(index);
      if(naturalTile.id === null)
       continue;
      const tile = createTile(naturalTile, x, y);

      if(x-1 in Level.naturalTiles){
        if(Level.naturalTiles[x-1][y] !== index)
          tile.classList.add("left-border");
      }
      if(y-1 in Level.naturalTiles[x]){
        if(Level.naturalTiles[x][y-1] !== index)
          tile.classList.add("top-border");
      }

      document.body.prepend(tile);
      // if(index === 3){
      //   const child_tile = createTile("copper-mask", x, y);
      //   document.body.prepend(child_tile);
      // }
    }
  }

  const tile = DOM.class("tile");

}

/** @param {Tile} tile */
function createTile(tile, x, y){
  const tileElement = DOM.create("div", {
    class: "tile " + tile.id,
    title: tile.name
  }, {
    top: y * TILE_SIZE + "px",
    left: x * TILE_SIZE + "px",
    width: TILE_SIZE + "px",
    height: TILE_SIZE + "px",
    backgroundPosition: -x * TILE_SIZE + "px " + -y * TILE_SIZE + "px"
  });
  tileElement.x = x;
  tileElement.y = y;
  return tileElement;
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

addEventListener("load", function(){
  main();
});