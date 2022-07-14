const NULL_TILE = -1;

class Tile{
  index = -1;
  x = 0;
  y = 0;
  width = 1;
  height = 1;
  /** @type {HTMLDivElement} */
  element = null;
  /**
   * @param {string} id
   * @param {string} name
   */
  constructor(id, name){
    this.name = name;
    this.id = id;
  }
  /** @param {Tile} object_like */
  static from(object_like){
    const tile = new this(object_like.id, object_like.name);
    return tile;
  }
  copy(){
    const tile = new Tile(this.id, this.name);
    tile.index = this.index;
    return tile;
  }
  /**
   * @template {TileCategoryName} CategoryName
   * @param {CategoryName} tileCategory
   * @param {TileCategoryMap[CategoryName]} tile
   * @param {number} x
   * @param {number} y
   * @returns {HTMLDivElement}
   */
  static createElement(tileCategory, tile, x, y){
    tile.element = DOM.create("div", {
      class: "tile " + tileCategory + " " + tile.id,
      title: tile.name
    }, {
      top: y * TILE_SIZE + "px",
      left: x * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px",
      backgroundPosition: -x * TILE_SIZE + "px " + -y * TILE_SIZE + "px"
    });
    tile.element.x = x;
    tile.element.y = y;
    return tile.element;
  }
  /**
   * @template {TileCategoryMap[TileCategoryName]} TileType
   * @param {number} x
   * @param {number} y
   * @returns {HTMLDivElement}
   */
  createElement(x, y){}
}

class NaturalTile extends Tile{
  /** @param {NaturalTile} object_like */
  static from(object_like){
    const tile = new this(object_like.id, object_like.name);
    return tile;
  }
  copy(){
    const tile = new NaturalTile(this.id, this.name);
    tile.index = this.index;
    return tile;
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  createElement(x, y){
    this.element = DOM.create("div", {
      class: "tile natural " + this.id,
      title: this.name
    }, {
      top: y * TILE_SIZE + "px",
      left: x * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px",
      backgroundPosition: -x * TILE_SIZE + "px " + -y * TILE_SIZE + "px"
    });
  }
}

class BuildingTile extends Tile{
  /** @param {BuildingTile} object_like */
  static from(object_like){
    const tile = new this(object_like.id, object_like.name);
    return tile;
  }
  copy(){
    const tile = new BuildingTile(this.id, this.name);
    tile.index = this.index;
    return tile;
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  createElement(x, y){
    this.element = DOM.create("div", {
      class: "tile building " + this.id,
      title: this.name
    }, {
      top: y * TILE_SIZE + "px",
      left: x * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    });
  }
}

class PlatformTile extends Tile{
  /** @param {PlatformTile} object_like */
  static from(object_like){
    const tile = new this(object_like.id, object_like.name);
    return tile;
  }
  copy(){
    const tile = new PlatformTile(this.id, this.name);
    tile.index = this.index;
    return tile;
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  createElement(x, y){
    this.element = DOM.create("div", {
      class: "tile platform " + this.id,
      title: this.name
    }, {
      top: y * TILE_SIZE + "px",
      left: x * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    });
  }
}