/// <reference path="../library/dom.js"/>

const TILE_SIZE = 42;
const TILE_H = Math.floor(window.innerWidth / TILE_SIZE);
const TILE_V = Math.floor(window.innerHeight / TILE_SIZE);

const canvas = DOM.create("canvas", {
  width: TILE_H * TILE_SIZE,
  Height: TILE_V * TILE_SIZE
});
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

const array = [];

const radius = canvas.height / 4;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

for(let i = 0; i < TILE_H; i++){
  array[i] = [];
  for(let j = 0; j < TILE_V; j++){
    array[i][j] = 1;
    // array[i][j] = randomInt(0, 1);
  }
}

const sizeXHalf = Math.floor(array.length / 2);
const sizeYForth = Math.floor(array[0].length / 4);

for(let y = 0; y < sizeYForth * 2; y++){
  for(let x = y; x < (sizeXHalf + 1) / 2; x+=0.5){
    array[x*2][sizeYForth - y] = 0;
    console.log(array.length - x*2, sizeYForth - y, array.length, array[0].length)
    array[sizeXHalf*2 - x*2 - 1][sizeYForth - y] = 0;
    array[x*2][sizeYForth * 3 + y] = 0;
    array[sizeXHalf*2 - x*2 - 1][sizeYForth * 3 + y] = 0;
  }
}
for(let y = sizeYForth; y < sizeYForth * 3; y++){
  for(x = 0; x < array.length; x++){
    array[x][y] = 0;
  }
}

// for(let i = 0; i < 360; i++){
//   const x = Math.floor((centerX + radius * Math.cos(i * Math.PI / 180)) / TILE_SIZE);
//   const y = Math.floor((centerY + radius * Math.sin(i * Math.PI / 180)) / TILE_SIZE);
//   // context.fillStyle = "#ff0";
//   // context.fillRect(x, y, 2, 2);
//   console.log(x, y);
//   array[x][y] = 0;
// }


// for(let x = 0; x < array.length; x++){
//   let y = Math.floor(array.length / 3 - x / 1.5);
//   if(x > sizeHalf)
//     y = Math.floor((x - sizeHalf) / 1.5);
//   // context.fillStyle = "#ff0";
//   // context.fillRect(x, y, 2, 2);
//   if(x in array && y in array[x])
//     array[x][y] = 0;
// }

for(let i = 0; i < array.length; i++){
  for(let j = 0; j < array[i].length; j++){

    if(array[i][j] === 0)
      context.fillStyle = "#00f";
    else if(array[i][j] === 1)
      context.fillStyle = "#0f0";
    context.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    context.strokeStyle = "#f00";
    context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

context.strokeStyle = "#000"
context.arc(centerX, centerY, radius, 0, Math.PI * 2);
context.stroke()

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}