/** Returns a pseudorandom number between 0 and 1.
 * @type {() number} */
const randomNumber = new alea("oni-clone");

/**
 * @param {number} min
 * @param {number} max
 */
function randomInt(min, max){
  return Math.floor(randomNumber() * (max - min + 1)) + min;
}

function randomDimensions(x_min, x_max, y_min, y_max){
  return [randomInt(x_min, x_max), randomInt(y_min, y_max)];
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function inLimit(value, min, max){
  return value < min ? min : (value > max ? max : value);
}

class Array2D{
  /**
   * @template DataType
   * @param {number} columns
   * @param {number} rows
   * @param {DataType} fillValue
   * @returns {DataType[][]}
   */
  static create(columns, rows, fillValue = null){
    const array = [];
    for(let i = 0; i < columns; i++){
      array[i] = [];
      for(let j = 0; j < rows; j++){
        array[i][j] = fillValue;
      }
    }
    return array;
  }

  /**
   * @template DataType
   * @param {number} width
   * @param {number} height
   * @param {DataType} emptyValue
   * @param {DataType} fillValue
   */
  static createHex(width, height, fillValue = 1, emptyValue = 0){
    const array = Array2D.create(width, height, emptyValue);
    const sizeXHalf = Math.floor(width / 2);
    const sizeYForth = Math.floor(height / 4);

    for(let y = 0; y < height / 2; y++){
      for(let x = y; x < (sizeXHalf + 1) / 2; x+=0.5){
        array[x*2][sizeYForth - y] = fillValue;
        array[sizeXHalf*2 - x*2 - 1][sizeYForth - y] = fillValue;
        array[x*2][sizeYForth * 3 + y] = fillValue;
        array[sizeXHalf*2 - x*2 - 1][sizeYForth * 3 + y] = fillValue;
      }
    }
    for(let y = sizeYForth; y < sizeYForth * 3; y++){
      for(let x = 0; x < width; x++){
        array[x][y] = fillValue;
      }
    }

    return array;
  }

  /** Override array elements in source array
   * @template DataType
   * @param {DataType[][]} source
   * @param {DataType[][]} array
   * @param {number} nullValue Value of array that should be ignored while overriding
   */
  static override(source, array, offsetX = 0, offsetY = 0, nullValue = 0){
    const start = {
      x: Math.max(0, offsetX),
      y: Math.max(0, offsetY)
    };
    const end = {
      x: Math.min(source.length, array.length + offsetX),
      y: Math.min(source[0].length, array[0].length + offsetY)
    };
    for(let x = start.x; x < end.x; x++){
      const new_x = x - offsetX;
      for(let y = start.y; y < end.y; y++){
        const new_y = y - offsetY;
        if(array[new_x][new_y] !== nullValue){
          source[x][y] = array[new_x][new_y];
        }
      }
    }
    // return source;
  }

  /** Override array elements in source array
   * @template DataType
   * @param {DataType[][]} array
   * @param {DataType} nullValue
   * @param {DataType} fillValue
   */
  static markBorder(array, fillValue, nullValue, borderX = 1, borderY){
    for(let x = 0; x < array.length; x++){
      for(let y = 0; y < array[x].length; y++){
        if(array[x][y] === nullValue)
          continue;
        if(x-1 in array && array[x-1][y] === nullValue){
          for(let b = 0; b < borderX; b++)
            if(x + b in array)
              array[x + b][y] = fillValue;
        }
        if(x+1 in array && array[x+1][y] === nullValue){
          for(let b = 0; b < borderX; b++)
            if(x - b in array)
              array[x - b][y] = fillValue;
        }
        if(y-1 in array[x] && array[x][y-1] === nullValue){
          for(let b = 0; b < borderY; b++)
            if(y + b in array[x])
              array[x][y + b] = fillValue;
        }
        if(y+1 in array[x] && array[x][y+1] === nullValue){
          for(let b = 0; b < borderY; b++)
            if(y - b in array[x])
              array[x][y - b] = fillValue;
        }
      }
    }
  }

  /** Fill the array with specified value
   * @template DataType
   * @param {DataType[][]} array
   * @param {DataType} fillValue
   */
  static fill(array, fillValue){
    array.forEach(columns => columns.fill(fillValue));
  }

  /** Checks whether if position exists in 2D array.
   * @template DataType
   * @param {DataType[][]} array
   * @param {number} x
   * @param {number} y
   */
  static isValid(array, x, y){
    return x in array && y in array[x];
  }

  /** Set value to the position if position exists in 2D array.
   * @template DataType
   * @param {DataType[][]} array
   * @param {number} x
   * @param {number} y
   * @param {DataType} value
   */
  static setValue(array, x, y, value){
    if(x in array && y in array[x]){
      array[x][y] = value;
    }
  }

}

/**
 * @template DataType
 * @param {DataType} fillValue
 * @param {number} count
 * @returns {DataType[]}
 */
function makeCopies(fillValue, count){
  return (new Array(count)).fill(fillValue);
}

/**
 * @template {Array} ElementType
 * @param {ElementType} array
*/
function shuffleElements(array, seed){
  let length = array.length;
  const arng = new alea(seed);
  while(length > 0){
    const random_index = Math.floor(arng() * length);
    const temp = array.splice(random_index, 1)[0];
    array.push(temp);
    length--;
  }
  return array;
}