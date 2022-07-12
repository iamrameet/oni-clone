/// <reference path="../library/dom.js"/>
/// <reference path="tiles.js"/>
/// <reference path="biome.js"/>

const TILE_SIZE = 42;
let ScaleFactor = 1;
const TILE_H = Math.floor(window.innerWidth / TILE_SIZE) * ScaleFactor;
const TILE_V = Math.floor(window.innerHeight / TILE_SIZE) * ScaleFactor;

const TN = Tiles.natural;

const Level = new class Level{
  scroll = {
    x: 0,
    y: 0
  };
  tiles = {
    /** @type {HTMLElement[][]} */
    loaded: [],
    /** @type {HTMLElement[]} */
    rendered: []
  };
  biomeMap = new BiomeMap(216, 360);
  biome = {
    temperate: new Biome([
      ...makeCopies(TN.Dirt, 2),
      ...makeCopies(TN.Coal, 1),
      ...makeCopies(TN.Sand, 1),
      ...makeCopies(TN.Sandstone, 2),
      ...makeCopies(TN.CopperOre, 1),
      ...makeCopies(TN.Fertilizer, 1),
      ...makeCopies(TN.Algae, 2)
    ], [TN.Absylite, TN.Granite, TN.IgneousRock], [TN.Air, TN.Water], {spread: 0.8, borderHSize: 2}),
    forest: new Biome([
      ...makeCopies(TN.Dirt, 2),
      TN.AluminumOre,
      TN.Phosphorite,
      TN.IgneousRock,
      TN.Dirt,
      TN.Phosphorite,
      ...makeCopies(TN.IgneousRock, 2),
    ], [TN.Granite, TN.IgneousRock], [], {spread: 0.6}),
    marsh: new Biome([
      TN.Slime, TN.Algae, TN.Clay,
      ...makeCopies(TN.SedimentaryRock, 2),
      TN.GoldAmalgam
    ], [TN.Absylite, TN.Neutronium], [TN.Air, TN.Water], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
    frozen: new Biome([
      TN.Ice, TN.PollutedIce, TN.Snow, TN.Granite, TN.AluminumOre
    ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
    tidePool: new Biome([
      TN.BleachStone, TN.Salt, TN.Sand, TN.SedimentaryRock, TN.Granite
    ], [TN.Absylite, TN.Neutronium], [TN.Water], {spread: 0.5, borderHSize: 0, borderVSize: 2}),
    jungle: new Biome([
      TN.Phosphorite, TN.IronOre, TN.BleachStone, TN.Algae, TN.Coal, TN.IgneousRock
    ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
    oil: new Biome([
      ...makeCopies(TN.IgneousRock, 2),
      ...makeCopies(TN.Granite, 1),
      TN.Diamond,
      TN.IronOre,
      TN.Fossil,
      ...makeCopies(TN.Lead, 1),
      TN.IronOre
    ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 2}),
    volcanic: new Biome([TN.Obsidian, TN.Magma], [TN.Obsidian], [], {spread: 0.1, borderSize: 2, borderVSize: 2})
  }

  renderTiles(){
    this.scroll.x = inLimit(this.scroll.x, 0, this.tiles.loaded.length - TILE_H);
    this.scroll.y = inLimit(this.scroll.y, 0, this.tiles.loaded[0].length - TILE_V);

    const minX = Math.max(this.scroll.x - 1, 0);
    const minY = Math.max(this.scroll.y - 1, 0);
    const maxX = Math.min(TILE_H + minX + 1, this.tiles.loaded.length);
    const maxY = Math.min(TILE_V + minY + 1, this.tiles.loaded[0].length);

    // console.log({minX, minY, maxX, maxY});
    for(let x = minX; x < maxX; x++){
      for(let y = minY; y < maxY; y++){
        const tile = this.tiles.loaded[x][y];
        const tileIndex = this.tiles.rendered.indexOf(tile);
        if(tileIndex > -1){
          this.tiles.rendered.splice(tileIndex, 1);
        }
      }
    }
    // console.log(this.naturalTiles.rendered.length, "tiles to unrender");

    this.tiles.rendered.forEach(tile => tile.remove());
    this.tiles.rendered.splice(0);

    for(let x = minX; x < maxX; x++){
      for(let y = minY; y < maxY; y++){
        const tile = this.tiles.loaded[x][y];
        if(!tile.parentElement){
          document.body.appendChild(tile);
          // console.log("rendered")
        }
        this.tiles.rendered.push(tile);
      }
    }

  }
};

function main(){
  let biomeSeed = 2;

  const biomes = [
    // Level [0 - 2] -> 28
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 10),
      ...makeCopies(Level.biome.marsh, 8),
      ...makeCopies(Level.biome.tidePool, 10),
      ...makeCopies(Level.biome.frozen, 19)
    ], biomeSeed++),

    // Level [3] -> 4 + ? + ?
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 2)
    ], biomeSeed++),
    // Level [3] -> ? + 2 + ?
    ...makeCopies(Level.biome.temperate, 2),
    // Level [3] -> ? + ? + 4
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 2)
    ], biomeSeed++),

    // Level [4] -> 3 + ? + ?
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 1)
    ], biomeSeed++),
    // Level [4] -> ? + 3 + ?
    ...makeCopies(Level.biome.temperate, 3),
    // Level [4] -> ? + ? + 3
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 1)
    ], biomeSeed++),

    // Level [5] -> 4 + ? + ?
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 2)
    ], biomeSeed++),
    // Level [5] -> ? + 2 + ?
    ...makeCopies(Level.biome.temperate, 2),
    // Level [5] -> ? + ? + 4
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 2),
      ...makeCopies(Level.biome.marsh, 2)
    ], biomeSeed++),

    // Level [6 - 8] -> 28
    ...shuffleElements([
      ...makeCopies(Level.biome.jungle, 10),
      ...makeCopies(Level.biome.marsh, 8),
      ...makeCopies(Level.biome.tidePool, 10),
      ...makeCopies(Level.biome.frozen, 19)
    ], biomeSeed++),

    // Level [9] -> 10
    ...makeCopies(Level.biome.oil, 10),
    // Level [10] -> 9
    ...makeCopies(Level.biome.volcanic, 9)
  ];

  biomes.forEach(function(biome){
    Level.biomeMap.addBiome(biome);
  });
  Level.biomeMap.mergeBiomes();
  Level.biomeMap.mergePores();
  Level.biomeMap.generateBase();

  for(let x = 0; x < Level.biomeMap.naturalTiles.length; x++){
    Level.tiles.loaded[x] = [];
    for(let y = 0; y < Level.biomeMap.naturalTiles[x].length; y++){
      // const index = randomInt(0, 3);
      const index = Level.biomeMap.naturalTiles[x][y];
      const anyTile = Tiles.getTile(index);
      if(anyTile === undefined)
        console.log(index);
      if(anyTile.id === null)
       continue;
      let tile;
      if(anyTile instanceof NaturalTile)
        tile = createNaturalTile(anyTile, x, y);
      else if(anyTile instanceof BuildingTile){
        tile = createBuildingTile(anyTile, x, y);
        if(x-1 in Level.biomeMap.naturalTiles && Level.biomeMap.naturalTiles[x-1][y] === index){
          tile.classList.add("right");
          Level.tiles.loaded[x-1][y].classList.add("left");
        }
        // if(x+1 in Level.biomeMap.naturalTiles && Level.biomeMap.naturalTiles[x+1][y] === index)
        //   tile.classList.add("left");
        if(y-1 in Level.biomeMap.naturalTiles[x] && Level.biomeMap.naturalTiles[x][y-1] === index){
          tile.classList.add("bottom");
          Level.tiles.loaded[x][y-1].classList.add("top");
        }
        // if(y+1 in Level.biomeMap.naturalTiles[x] && Level.biomeMap.naturalTiles[x][y+1] === index)
        //   tile.classList.add("top");
      }
      if(!tile)
        console.log(anyTile)
      if(x-1 in Level.biomeMap.naturalTiles){
        if(Level.biomeMap.naturalTiles[x-1][y] !== index)
          tile.classList.add("left-border");
        if(false && y-1 in Level.biomeMap.naturalTiles[x-1]){
          if(Level.biomeMap.naturalTiles[x-1][y-1] === index){
            if(y-1 in Level.biomeMap.naturalTiles[x] && Level.biomeMap.naturalTiles[x][y-1] !== index)
              Level.tiles.loaded[x][y-1].classList.add("curve-bottom-left");
            if(x-1 in Level.biomeMap.naturalTiles && Level.biomeMap.naturalTiles[x-1][y] !== index)
              Level.tiles.loaded[x-1][y].classList.add("curve-top-right");
          }
        }
        if(Level.biomeMap.naturalTiles[x-1][y] >= Tiles.buildingIndex)
          tile.classList.add("right-straight");
      }
      if(x+1 in Level.biomeMap.naturalTiles){
        if(Level.biomeMap.naturalTiles[x+1][y] >= Tiles.buildingIndex)
          tile.classList.add("left-straight");
      }
      if(y-1 in Level.biomeMap.naturalTiles[x]){
        if(Level.biomeMap.naturalTiles[x][y-1] !== index)
          tile.classList.add("top-border");
        if(Level.biomeMap.naturalTiles[x][y-1] >= Tiles.buildingIndex)
          tile.classList.add("top-straight");
      }
      if(y+1 in Level.biomeMap.naturalTiles[x]){
        if(Level.biomeMap.naturalTiles[x][y+1] >= Tiles.buildingIndex)
          tile.classList.add("bottom-straight");
      }
      Level.tiles.loaded[x][y] = tile;
      // document.body.prepend(tile);
      // if(index === 3){
      //   const child_tile = createTile("copper-mask", x, y);
      //   document.body.prepend(child_tile);
      // }
    }
  }

  addEventListener("mousedown", function(downEvent){
    const initX = Math.floor(downEvent.x / TILE_SIZE);
    const initY = Math.floor(downEvent.y / TILE_SIZE);
    const initScrollX = Level.scroll.x;
    const initScrollY = Level.scroll.y;
    this.onmousemove = function(event){
      const finalX = Math.floor(event.x / TILE_SIZE);
      const finalY = Math.floor(event.y / TILE_SIZE);
      const diffX = finalX - initX;
      const diffY = finalY - initY;
      const scrollX = initScrollX - diffX;
      const scrollY = initScrollY - diffY;
      if(scrollX !== initScrollX || scrollY !== initScrollX){
        Level.scroll.x = scrollX;
        Level.scroll.y = scrollY;
        Level.renderTiles();
      }
      document.body.scroll(initScrollX * TILE_SIZE + downEvent.x - event.x, initScrollY * TILE_SIZE + downEvent.y - event.y);
    }
  });
  addEventListener("mouseup", function(){
    this.onmousemove = undefined;
  });

  // const tile = DOM.class("tile");
  Level.scroll.x = Math.floor((Level.biomeMap.width / 2 - TILE_H / 2));
  Level.scroll.y = Math.floor((Level.biomeMap.height / 2 - TILE_V / 2 - 19));
  Level.renderTiles();
  document.body.scroll(Level.scroll.x * TILE_SIZE, Level.scroll.y * TILE_SIZE);

  document.body.style.setProperty("--scale-factor", ScaleFactor);

}

/** @param {NaturalTile} tile */
function createNaturalTile(tile, x, y){
  const tileElement = DOM.create("div", {
    class: "tile natural " + tile.id,
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

/** @param {BuildingTile} tile */
function createBuildingTile(tile, x, y){
  const tileElement = DOM.create("div", {
    class: "tile building " + tile.id,
    title: tile.name
  }, {
    top: y * TILE_SIZE + "px",
    left: x * TILE_SIZE + "px",
    width: TILE_SIZE + "px",
    height: TILE_SIZE + "px",
    // backgroundPosition: -x * TILE_SIZE + "px " + -y * TILE_SIZE + "px"
  });
  tileElement.x = x;
  tileElement.y = y;
  return tileElement;
}

addEventListener("load", function(){
  main();
});