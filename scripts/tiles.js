/// <reference path="tile.js"/>
/// <reference path="tiles.d.ts"/>
/// <reference path="../data/tiles.js"/>

const Tiles = new class TileManager{
  /** @type {NaturalTileIndexNameMap} */
  natural = {};
  /** @type {NaturalTileName[]} */
  #naturalTiles = [];
  constructor(){
    const keys = Object.keys(_naturalTiles);
    for(const [index, key] of keys.entries()){
      _naturalTiles[key] = new NaturalTile(..._naturalTiles[key]);
      this.natural[key] = index;
      this.#naturalTiles[index] = key;
    }
  }
  /**
   * @param {number} index
   * @returns {NaturalTile}
   */
  getNaturalTile(index){
    return _naturalTiles[this.#naturalTiles[index]];
  }
  /**
   * @param {number} index
   * @param {number} count
   * @returns {number[]}
   */
  makeCopies(index, count){
    return (new Array(count)).fill(index);
  }
};