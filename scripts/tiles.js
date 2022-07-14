/// <reference path="tile.js"/>
/// <reference path="tiles.d.ts"/>
/// <reference path="../data/tiles.js"/>

const TilePreset = new class TileManager{
  #indexCounter = 0;
  /** @type {string[]} */
  #tiles = [];
  /** @type {{[key in keyof TileCategoryMap]: {tileClass: TileCategoryTypeMap[key], tiles: Object<string, TileCategoryMap[key]>}}} */
  #category = {};
  /** @type {TileCategoryNameIndexMap} */
  categoryIndex = {};
  /** @type {NaturalTileNameIndexMap} */
  natural = {};
  /** @type {BuildingTileNameIndexMap} */
  building = {};
  /** @type {PlatformTileNameIndexMap} */
  platform = {};
  /** @type {NaturalTileName[]} */

  constructor(){
    this.addCategory("natural", NaturalTile);
    this.addCategory("building", BuildingTile);
    this.addCategory("platform", PlatformTile);
    this.loadCategory("natural", _naturalTiles);
    this.loadCategory("building", _buildingTiles);
    this.loadCategory("platform", _platformTiles);
  }

  /**
   * @template {TileCategoryName} TileCategory
   * @param {TileCategory} categoryName
   * @param {TileCategoryTypeMap[TileCategory]} tileClass
   */
  addCategory(categoryName, tileClass){
    this.#category[categoryName] = {
      tileClass,
      tiles: {}
    };
  }
  /**
   * @template {TileCategoryName} TileCategory
   * @param {TileCategory} categoryName
   * @param {Object<string, TileCategoryMap[TileCategory]>} categoryObject
   */
  loadCategory(categoryName, categoryObject){
    this.categoryIndex[categoryName] = this.#indexCounter;
    const tileNames = Object.keys(categoryObject);
    for(const tileName of tileNames){
      this.#category[categoryName].tiles[tileName] = this.#category[categoryName].tileClass.from(categoryObject[tileName]);
      this.#category[categoryName].tiles[tileName].index = this.#indexCounter;
      this[categoryName][tileName] = this.#indexCounter;
      this.#tiles[this.#indexCounter] = tileName;
      this.#indexCounter++;
    }
  }

  /**
   * @param {number} index
   * @returns {NaturalTile}
   */
  getNaturalTile(index){
    return this.#category.natural.tiles[this.#tiles[index]];
  }
  /**
   * @param {number} index
   * @returns {BuildingTile}
   */
  getBuildingTile(index){
    return this.#category.building.tiles[this.#tiles[index]];
  }
  /**
   * @param {number} index
   * @returns {PlatformTile}
   */
  getPlatformTile(index){
    return this.#category.platform.tiles[this.#tiles[index]];
  }
  /**
   * @param {number} index
   * @returns {Tile}
   */
  getTile(index){
    return this.getNaturalTile(index) ?? this.getBuildingTile(index) ?? this.getPlatformTile(index);
  }
};