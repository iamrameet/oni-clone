/// <reference path="E:/library/dom.js"/>

const TILE_SIZE = 42;
const TILE_H = window.innerWidth / TILE_SIZE;
const TILE_V = window.innerHeight / TILE_SIZE;

const tileArray = ["sand-stone", "sand-stone", "algae", "copper"];

function main(){
  for(let x = 0; x < TILE_H * 2; x++){
    for(let y = 0; y < TILE_V * 2; y++){
      const index = randomInt(0, 3);
      const tile = createTile(tileArray[index], x, y);
      document.body.prepend(tile);
      if(index === 3){
        const child_tile = createTile("copper-mask", x, y);
        document.body.prepend(child_tile);
      }
    }
  }

  const tile = DOM.class("tile");

}

function createTile(type, x, y){
  const tile = DOM.create("div", {
    class: "tile " + type
  }, {
    top: y * TILE_SIZE + "px",
    left: x * TILE_SIZE + "px",
    width: TILE_SIZE + "px",
    height: TILE_SIZE + "px",
    backgroundPosition: -x * TILE_SIZE + "px " + -y * TILE_SIZE + "px"
  });
  tile.x = x;
  tile.y = y;
  return tile;
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

addEventListener("load", function(){
  main();
});