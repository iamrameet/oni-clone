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
    return Tiles.getNaturalTile(this.naturalTiles[index]);
  }
  construct(width, height){
    const tiles = createHexArray(width, height, 1, NULL_TILE);
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
    this.naturalTiles = array2D(width, height, Tiles.natural.Obsidian);
    this.pores = array2D(width, height, NULL_TILE);
  }
  /**
   * @param {Biome} biome
   * @param {number} times
   */
  addBiome(biome, times = 1){
    if(!this.biomeTileMap.has(biome.id)){
      this.biomeTileMap.set(biome.id, array2D(this.width, this.height, NULL_TILE));
    }
    for(let t = 0; t < times; t++){
      const {width, height} = Biome.dimensions();
      const margin = 0;

      const biomeX = Math.floor(this.#nextX + margin * this.#nextColumn);
      const biomeY = Math.floor(this.#nextY - 5 * this.#nextRow);

      const tileMap = biome.construct(width, height);
      overrideArray2D(this.biomeTileMap.get(biome.id), tileMap, biomeX, biomeY, NULL_TILE);

      const poreWidth = 20;
      const poreHeight = 10;
      for(const resource of biome.resources){
        const pore = BiomeMap.generatePore(poreWidth, poreHeight, resource);
        overrideArray2D(this.pores, pore, biomeX + (width - poreWidth) / 2, biomeY + (height - poreHeight) / 2);
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
        markBorderArray2D(tiles, biome.borderTiles[0], NULL_TILE, biome.borderHSize, biome.borderVSize);
      this.overrideNaturalTiles(tiles);
    });
  }
  mergePores(){
    this.overrideNaturalTiles(this.pores);
  }
  generateBase(){
    const centerX = Math.floor((this.width / 2 - 4));
    const centerY = Math.floor((this.height / 2 - 2 - 19));
    const tiles = array2D(8, 4, NULL_TILE);
    const floor = array2D(8, 1, Tiles.building.base.Tile);
    const floor2 = array2D(7, 1, Tiles.building.base.Tile);
    const high = array2D(3, 2, Tiles.building.base.Tile);
    const high2 = array2D(1, 2, Tiles.building.base.Tile);

    overrideArray2D(tiles, floor, 0, 3, NULL_TILE);
    // overrideArray2D(tiles, floor2, 1, 0, NULL_TILE);
    // overrideArray2D(tiles, high, 0, 1, NULL_TILE);
    // overrideArray2D(tiles, high2, 7, 1, NULL_TILE);

    this.overrideNaturalTiles(tiles, centerX, centerY);
  }

  /** @param {number[][]} tiles */
  overrideNaturalTiles(tiles, offsetX = 0, offsetY = 0){
    overrideArray2D(this.naturalTiles, tiles, offsetX, offsetY, NULL_TILE);
  }
  static generatePore(width, height, tile = Tiles.natural.Air){
    const tileArray = [NULL_TILE, tile];
    const tiles = array2D(width, height, 0);
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