/// <reference path="tiles.js"/>

class Biome{
  #seed;
  #spread;
  /** @param {number[]} naturalTiles */
  constructor(naturalTiles, spread = 1, seed = 0){
    this.naturalTiles = naturalTiles;
    this.#spread = spread;
    this.#seed = parseInt(naturalTiles.join("")) + seed;
  }
  getNaturalTile(index = 0){
    return Tiles.getNaturalTile(this.naturalTiles[index]);
  }
  construct(width, height){
    /** @type {number[][]} */
    const tiles = [];
    noise.seed(this.#seed);
    for(let x = 0; x < width; x++){
      tiles[x] = [];
      for(let y = 0; y < height; y++){
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
}