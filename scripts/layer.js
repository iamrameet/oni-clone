/// <reference path="tiles.js"/>
/// <reference path="../library/misc.js"/>

/** @template {Tile} TileType */
class Layer{
  /** @type {TileType[][]} */
  tiles;
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height){
    this.tiles = Array2D.create(width, height, null);
  }
  /**
   * @callback onTileSet
   * @param {number} x
   * @param {number} y
   * @param {TileType} tile
   * @param {this} layer
   * @returns
   * @param {number[][]} tiles
   * @param {onTileSet} cb
   */
  load(tiles, cb = ()=>{}){
    for(let x = 0; x < tiles.length; x++){
      for(let y = 0; y < tiles[x].length; y++){
        if(this.tiles[x][y] !== null){
          cb(x, y, this.tiles[x][y], this)
          continue;
        }
        const index = tiles[x][y];
        if(index === NULL_TILE)
          continue;
        let tile = TilePreset.getTile(index);
        if(!tile){
          console.log(index, x, y, this.tiles)
        }
        tile = tile.copy();
        tile.createElement(x, y);
        this.setTile(x, y, tile);
        cb(x, y, tile, this);
      }
    }
  }
  render(){}
  /**
   * @param {number} x
   * @param {number} y
   */
  getTile(x, y){
    if(Array2D.isValid(this.tiles, x, y))
      return this.tiles[x][y];
    return null;
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {TileType} tile
   */
  setTile(x, y, tile){
    Array2D.setValue(this.tiles, x, y, tile);
    if(Array2D.isValid(this.tiles, x, y)){
      Array2D.override(this.tiles, Array2D.create(tile.width, tile.height, tile), x, y, null);
    }
    return this.tiles[x, y];
  }
  /**
   * @callback IfAction
   * @param {TileType} tile
   * @returns
   * @param {number} x
   * @param {number} y
   * @param {IfAction} action
   */
  ifTile(x, y, action){
    if(Array2D.isValid(this.tiles, x, y) && this.tiles[x][y])
      action(this.tiles[x][y]);
  }
}

class LayerManager{
  loaded = [];
  /** @type {Tile["element"][]} */
  rendered = [];

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height){
    this.layerWidth = width;
    this.layerHeight = height;
    this.layer = {
      /** @type {Layer<NaturalTile>} */
      natural: new Layer(width, height),
      /** @type {Layer<BuildingTile>} */
      building: new Layer(width, height),
      /** @type {Layer<PlatformTile>} */
      platform: new Layer(width, height)
    };
  }

  /**
   * @callback fECallback
   * @param {Layer<Tile>} layer
   * @param {string} name layer name
   * @returns
   * @param {fECallback} callbackfn
   */
  forEach(callbackfn){
    // callbackfn(this.layer.platform, "natural")
    // return;
    const categoryNames = Object.keys(this.layer);
    for(const categoryName of categoryNames){
      callbackfn(this.layer[categoryName], categoryName);
    }
  }
}