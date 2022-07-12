/// <reference path="tile.js"/>
/// <reference path="tiles.d.ts"/>
/// <reference path="../data/tiles.js"/>

const Tiles = new class TileManager{
  buildingIndex = 0;
  /** @type {NaturalTileIndexNameMap} */
  natural = {};
  /** @type {BuildingTileIndexNameMap} */
  building = {};
  /** @type {NaturalTileName[]} */
  #tiles = [];
  constructor(){
    let keys = Object.keys(_naturalTiles);
    let index = 0;
    for(const key of keys){
      _naturalTiles[key] = new NaturalTile(_naturalTiles[key].id, _naturalTiles[key].name);
      this.natural[key] = index;
      this.#tiles[index] = key;
      index++;
    }
    this.buildingIndex = index;
    keys = Object.keys(_buildingTiles);
    for(const key of keys){
      const ks = Object.keys(_buildingTiles[key]);
      this.building[key] = {};
      for(const k of ks){
        _buildingTiles[k] = new BuildingTile(_buildingTiles[key][k].id, _buildingTiles[key][k].name);
        this.building[key][k] = index;
        this.#tiles[index++] = k;
      }
      delete _buildingTiles[key];
    }
  }
  /**
   * @param {number} index
   * @returns {NaturalTile}
   */
  getNaturalTile(index){
    return _naturalTiles[this.#tiles[index]];
  }
  /**
   * @param {number} index
   * @returns {BuildingTile}
   */
  getBuildingTile(index){
    return _buildingTiles[this.#tiles[index]];
  }
  /**
   * @param {number} index
   * @returns {Tile}
   */
  getTile(index){
    return this.getNaturalTile(index) ?? this.getBuildingTile(index);
  }
};