/// <reference path="tile.js"/>
/// <reference path="tiles.d.ts"/>
/// <reference path="../data/tiles.js"/>

const Tiles = new class TileManager{
  /** @type {NaturalTileIndexNameMap} */
  natural = {};
  /** @type {BuildingTileIndexNameMap} */
  building = {};
  /** @type {NaturalTileName[]} */
  #naturalTiles = [];
  /** @type {BuildingTileName[]} */
  #buildingTiles = [];
  constructor(){
    let keys = Object.keys(_naturalTiles);
    for(const [index, key] of keys.entries()){
      _naturalTiles[key] = new NaturalTile(_naturalTiles[key].id, _naturalTiles[key].name);
      this.natural[key] = index;
      this.#naturalTiles[index] = key;
    }
    keys = Object.keys(_buildingTiles);
    let index = 0;
    for(const key of keys){
      const ks = Object.keys(_buildingTiles[key]);
      this.building[key] = {};
      for(const k of ks){
        _buildingTiles[key][k] = new BuildingTile(_buildingTiles[key][k].id, _buildingTiles[key][k].name);
        this.building[key][k] = index;
        this.#buildingTiles[index++] = k;
      }
    }
  }
  /**
   * @param {number} index
   * @returns {NaturalTile}
   */
  getNaturalTile(index){
    return _naturalTiles[this.#naturalTiles[index]];
  }
};