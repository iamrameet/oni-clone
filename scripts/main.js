/// <reference path="../library/dom.js"/>
/// <reference path="biome.js"/>
/// <reference path="tiles.js"/>
/// <reference path="biomes.js"/>

const TILE_SIZE = 42;
let ScaleFactor = 1;
const TILE_H = Math.floor(window.innerWidth / TILE_SIZE) * ScaleFactor;
const TILE_V = Math.floor(window.innerHeight / TILE_SIZE) * ScaleFactor;

const Level = new GameMap(216, 360);

function main(){
  let biomeSeed = 2;

  const biomes = [
    // Level [0 - 2] -> 28
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 10),
      ...makeCopies(BiomePreset.marsh, 8),
      ...makeCopies(BiomePreset.tidePool, 10),
      ...makeCopies(BiomePreset.frozen, 19)
    ], biomeSeed++),

    // Level [3] -> 4 + ? + ?
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 2)
    ], biomeSeed++),
    // Level [3] -> ? + 2 + ?
    ...makeCopies(BiomePreset.temperate, 2),
    // Level [3] -> ? + ? + 4
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 2)
    ], biomeSeed++),

    // Level [4] -> 3 + ? + ?
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 1)
    ], biomeSeed++),
    // Level [4] -> ? + 3 + ?
    ...makeCopies(BiomePreset.temperate, 3),
    // Level [4] -> ? + ? + 3
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 1)
    ], biomeSeed++),

    // Level [5] -> 4 + ? + ?
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 2)
    ], biomeSeed++),
    // Level [5] -> ? + 2 + ?
    ...makeCopies(BiomePreset.temperate, 2),
    // Level [5] -> ? + ? + 4
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 2),
      ...makeCopies(BiomePreset.marsh, 2)
    ], biomeSeed++),

    // Level [6 - 8] -> 28
    ...shuffleElements([
      ...makeCopies(BiomePreset.jungle, 10),
      ...makeCopies(BiomePreset.marsh, 8),
      ...makeCopies(BiomePreset.tidePool, 10),
      ...makeCopies(BiomePreset.frozen, 19)
    ], biomeSeed++),

    // Level [9] -> 10
    ...makeCopies(BiomePreset.oil, 10),
    // Level [10] -> 9
    ...makeCopies(BiomePreset.volcanic, 9)
  ];

  biomes.forEach(function(biome){
    Level.biomeMap.addBiome(biome);
  });
  Level.biomeMap.mergeBiomes();
  Level.biomeMap.mergePores();
  Level.biomeMap.generateBase();

  Level.loadLayers();
  Level.allowMapMovement();

  document.body.style.setProperty("--scale-factor", ScaleFactor);

}

addEventListener("load", function(){
  main();
});