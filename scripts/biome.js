/// <reference path="tiles.js"/>
/// <reference path="../library/misc.js"/>

class Biome{
  /** @type {Map<number, Biome>} */
  static #biomes = new Map();
  #id;
  #seed;
  #spread;
  #constructCount = 0;
  /**
   * @param {number[]} naturalTiles
   * @param {number[]} borderTiles
   * @param {number[]} resources
   * @param {{spread: number, seed: number, borderHSize: number, borderVSize: number}} options
   */
  constructor(naturalTiles, borderTiles, resources, options = {}){
    this.naturalTiles = naturalTiles;
    this.borderTiles = borderTiles;
    this.resources = resources;
    this.#spread = options.spread ?? 1;
    this.#seed = parseInt(naturalTiles.join("")) % 65536 + (options.seed ?? 0);
    this.borderHSize = options.borderHSize ?? 0;
    this.borderVSize = options.borderVSize ?? 0;
    this.#id = Biome.#biomes.size;
    Biome.#biomes.set(this.#id, this);
  }
  static getById(id){
    return Biome.#biomes.get(id);
  }
  get id(){
    return this.#id;
  }
  getNaturalTile(index = 0){
    return TilePreset.getNaturalTile(this.naturalTiles[index]);
  }
  construct(width, height){
    const tiles = Array2D.createHex(width, height, 1, NULL_TILE);
    noise.seed(this.#seed + this.#constructCount++);
    for(let x = 0; x < width; x++){
      for(let y = 0; y < height; y++){
        if(tiles[x][y] === NULL_TILE){
          continue;
        }
        const value = noise.perlin2(x / width, y / 8);
        tiles[x][y] = Math.ceil(Math.abs(value) * 24 * this.#spread);
        if(tiles[x][y] >= this.naturalTiles.length)
          tiles[x][y] %= this.naturalTiles.length;
        tiles[x][y] = this.naturalTiles[tiles[x][y]];
        // if(!tiles[x][y])
        //   console.log(this.naturalTiles, x, y);
        // context.fillStyle = "#fff" + Math.floor(array[x][y] * 1.6).toString(16);
        // context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    return tiles;
  }
  static dimensions(){
    const radiusX = randomInt(12, 12);
    const radiusY = randomInt(19, 19);
    // const biomeGap = randomInt(2, 3);
    return {
      width: radiusX * 2,
      height: radiusY * 2,
      top: -radiusX * 0,
      left: -radiusY * 0
    }
  };
}



class BiomeMap{
  /** @type {Biome[]} */
  biomes = [];
  #nextX = 0;
  #nextY = 0;
  #nextRow = 0;
  #nextColumn = 0;
  /** @type {Map<number, number[][]>} */
  biomeTileMap = new Map();
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.naturalTiles = Array2D.create(width, height, TilePreset.natural.Space);
    this.buildings = Array2D.create(width, height, NULL_TILE);
    this.platforms = Array2D.create(width, height, NULL_TILE);
    this.pores = Array2D.create(width, height, NULL_TILE);
  }
  /**
   * @param {Biome} biome
   * @param {number} times
   */
  addBiome(biome, times = 1){
    if(!this.biomeTileMap.has(biome.id)){
      this.biomeTileMap.set(biome.id, Array2D.create(this.width, this.height, NULL_TILE));
    }
    for(let t = 0; t < times; t++){
      const {width, height} = Biome.dimensions();
      const margin = 0;

      const biomeX = Math.floor(this.#nextX + margin * this.#nextColumn);
      const biomeY = Math.floor(this.#nextY - 5 * this.#nextRow);

      const tileMap = biome.construct(width, height);
      Array2D.override(this.biomeTileMap.get(biome.id), tileMap, biomeX, biomeY, NULL_TILE);

      const poreWidth = 20;
      const poreHeight = 10;
      for(const resource of biome.resources){
        const pore = BiomeMap.generatePore(poreWidth, poreHeight, resource);
        Array2D.override(this.pores, pore, biomeX + (width - poreWidth) / 2, biomeY + (height - poreHeight) / 2);
      }

      this.biomes.push(biome);

      this.#nextX += width;
      if(this.#nextX + width/2 > this.width){
        this.#nextY += height * 3 / 4;
        this.#nextRow++;
        if(this.#nextRow % 2 === 1){
          this.#nextX = -(width + margin) / 2;
        }else{
          this.#nextX = 0;
        }
        this.#nextColumn = 0;
      }else{
        this.#nextColumn++;
      }
    }
    return this;
  }
  mergeBiomes(){
    this.biomeTileMap.forEach((tiles, biomeId) => {
      // if(biomeId !== 1) return;
      const biome = Biome.getById(biomeId);
      if(biome.borderTiles.length > 0)
        Array2D.markBorder(tiles, biome.borderTiles[0], NULL_TILE, biome.borderHSize, biome.borderVSize);
      this.overrideNaturalTiles(tiles);
    });
  }
  mergePores(){
    this.overrideNaturalTiles(this.pores);
  }
  generateBase(){
    const width = 8;
    const height = 1;
    const centerX = Math.floor((this.width - width) / 2);
    const centerY = Math.floor((this.height - height) / 2 - 19);
    const floor = Array2D.create(width, height, TilePreset.platform.Tile);

    Array2D.override(this.platforms, floor, centerX, centerY, NULL_TILE);
  }

  /** @param {number[][]} tiles */
  overrideNaturalTiles(tiles, offsetX = 0, offsetY = 0){
    Array2D.override(this.naturalTiles, tiles, offsetX, offsetY, NULL_TILE);
  }
  static generatePore(width, height, tile = TilePreset.natural.Air){
    const tileArray = [NULL_TILE, tile];
    const tiles = Array2D.create(width, height, 0);
    for(let x = 0; x < width; x++){
      for(let y = 0; y < height; y++){
        const value = noise.perlin2(x / width, y / height);
        tiles[x][y] = Math.floor(Math.abs(value) * height * randomInt(30, 40) / 100);
        tiles[x][y] = tileArray[tiles[x][y] % tileArray.length];
      }
    }
    return tiles;
  }
}

class GameMap{
  scroll = {x: 0, y: 0};

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.layers = new LayerManager(width, height);
    this.biomeMap = new BiomeMap(width, height);
  }

  loadLayers(){

    // Load natural tiles into natural layer
    this.layers.layer.natural.load(this.biomeMap.naturalTiles, (x, y, tile, layer) => {

      layer.ifTile(x - 1, y, leftTile => {
        if(leftTile.index !== tile.index){
          tile.element.classList.add("left-border");
        }
        // if(y-1 in this.biomeMap.naturalTiles[x-1]){
        //   if(this.biomeMap.naturalTiles[x-1][y-1] === index){
        //     if(y-1 in this.biomeMap.naturalTiles[x] && this.biomeMap.naturalTiles[x][y-1] !== index)
        //       this.tiles.loaded[x][y-1].classList.add("curve-bottom-left");
        //     if(x-1 in this.biomeMap.naturalTiles && this.biomeMap.naturalTiles[x-1][y] !== index)
        //       this.tiles.loaded[x-1][y].classList.add("curve-top-right");
        //   }
        // }
      });

      layer.ifTile(x, y - 1, topTile => {
        if(topTile.index !== tile.index){
          tile.element.classList.add("top-border");
        }
      });
    });

    // Load platforms generated by BiomeMap into platform layer
    this.layers.layer.platform.load(this.biomeMap.platforms, (x, y, tile, layer) => {
      layer.ifTile(x - 1, y, leftTile => {
        if(leftTile.index === tile.index){
          tile.element.classList.add("right");
          leftTile.element.classList.add("left");
        }
      });
      layer.ifTile(x, y - 1, topTile => {
        if(topTile.index === tile.index){
          tile.element.classList.add("bottom");
          topTile.element.classList.add("top");
        }
      });

      // Change natural tiles based on current building tile
return;
      this.layers.layer.natural.ifTile(x, y + 1, bottomNaturalTile => {
        bottomNaturalTile.element.classList.add("top-straight");
      });
      this.layers.layer.natural.ifTile(x - 1, y, leftNaturalTile => {
        leftNaturalTile.element.classList.add("right-straight");
      });
      this.layers.layer.natural.ifTile(x, y - 1, topNaturalTile => {
        topNaturalTile.element.classList.add("bottom-straight");
      });
      this.layers.layer.natural.ifTile(x + 1, y, rightNaturalTile => {
        rightNaturalTile.element.classList.add("left-straight");
      });

    });

    // Load buildings generated by BiomeMap into building layer
    this.layers.layer.building.load(this.biomeMap.buildings);

  }

  renderLayers(){
    this.scroll.x = inLimit(this.scroll.x, 0, this.layers.layerWidth - TILE_H);
    this.scroll.y = inLimit(this.scroll.y, 0, this.layers.layerHeight - TILE_V);

    const minX = Math.max(this.scroll.x - 1, 0);
    const minY = Math.max(this.scroll.y - 1, 0);
    const maxX = Math.min(TILE_H + minX + 1, this.layers.layerWidth);
    const maxY = Math.min(TILE_V + minY + 1, this.layers.layerHeight);

    // console.log({minX, minY, maxX, maxY});

    this.layers.forEach(layer => {

      for(let x = minX; x < maxX; x++){
        for(let y = minY; y < maxY; y++){
          layer.ifTile(x, y, tile => {
            const tileIndex = this.layers.rendered.indexOf(tile.element);
            if(tileIndex > -1){
              this.layers.rendered.splice(tileIndex, 1);
            }
          });
        }
      }

    });
    // console.log(this.layers.rendered.length, " tiles to unrender");

    this.layers.rendered.forEach(element => element.remove());
    this.layers.rendered.splice(0);

    this.layers.forEach(layer => {

      for(let x = minX; x < maxX; x++){
        for(let y = minY; y < maxY; y++){
          layer.ifTile(x, y, tile => {
            if(!tile.element.parentElement){
              document.body.appendChild(tile.element);
              // console.log("rendered")
            }
            this.layers.rendered.push(tile.element);
          });
        }
      }

    });


  }

  /** Allows player to move map */
  allowMapMovement(){
    window.addEventListener("mousedown", downEvent => {
      const initX = Math.floor(downEvent.x / TILE_SIZE);
      const initY = Math.floor(downEvent.y / TILE_SIZE);
      const initScrollX = this.scroll.x;
      const initScrollY = this.scroll.y;
      window.onmousemove = moveEvent => {
        const finalX = Math.floor(moveEvent.x / TILE_SIZE);
        const finalY = Math.floor(moveEvent.y / TILE_SIZE);
        const diffX = finalX - initX;
        const diffY = finalY - initY;
        const scrollX = initScrollX - diffX;
        const scrollY = initScrollY - diffY;
        if(scrollX !== initScrollX || scrollY !== initScrollX){
          this.scroll.x = scrollX;
          this.scroll.y = scrollY;
          this.renderLayers();
        }
        document.body.scroll(initScrollX * TILE_SIZE + downEvent.x - moveEvent.x, initScrollY * TILE_SIZE + downEvent.y - moveEvent.y);
      }
    });
    window.addEventListener("mouseup", function(){
      window.onmousemove = undefined;
    });

    window.addEventListener("touchstart", downEvent => {
      const initX = Math.floor(downEvent.touches[0].pageX / TILE_SIZE);
      const initY = Math.floor(downEvent.touches[0].pageY / TILE_SIZE);
      const initScrollX = this.scroll.x;
      const initScrollY = this.scroll.y;
      console.log("down")
      window.ontouchmove = moveEvent => {
        const finalX = Math.floor(moveEvent.touches[0].pageX / TILE_SIZE);
        const finalY = Math.floor(moveEvent.touches[0].pageY / TILE_SIZE);
        const diffX = finalX - initX;
        const diffY = finalY - initY;
        const scrollX = initScrollX - diffX;
        const scrollY = initScrollY - diffY;
        if(scrollX !== initScrollX || scrollY !== initScrollX){
          this.scroll.x = scrollX;
          this.scroll.y = scrollY;
          this.renderLayers();
        }
        console.log(scrollX, scrollY)
        document.body.scroll(initScrollX * TILE_SIZE + downEvent.touches[0].pageX - moveEvent.touches[0].pageX, initScrollY * TILE_SIZE + downEvent.touches[0].pageY - moveEvent.touches[0].pageY);
      }
    });
    window.addEventListener("touchend", function(){
      window.onpointermove = undefined;
    });
    window.addEventListener("touchcancel", function(){
      window.onpointermove = undefined;
    });

    this.scroll.x = Math.floor((this.biomeMap.width / 2 - TILE_H / 2));
    this.scroll.y = Math.floor((this.biomeMap.height / 2 - TILE_V / 2 - 19));
    this.renderLayers();
    document.body.scroll(this.scroll.x * TILE_SIZE, this.scroll.y * TILE_SIZE);
  }

  /** @param {GameMap} gameMapJSON */
  static fromJSON(gameMapJSON){
    /** @type {GameMap} */
    const gameMapObject = JSON.parse(gameMapJSON);
    const gameMap = new GameMap(gameMapObject.width, gameMapObject.height);
    for(const key in gameMap.layers){
      if(key in gameMapObject.layers)
        gameMap.layers[key].fillFrom(gameMapObject.layers[key]);
    }
    return gameMap;
  }

}