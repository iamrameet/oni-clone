/// <reference path="tiles.js"/>

const {natural: TN} = TilePreset;

const BiomePreset = {
  temperate: new Biome([
    ...makeCopies(TN.Dirt, 2),
    ...makeCopies(TN.Coal, 1),
    ...makeCopies(TN.Sand, 1),
    ...makeCopies(TN.Sandstone, 2),
    ...makeCopies(TN.CopperOre, 1),
    ...makeCopies(TN.Fertilizer, 1),
    ...makeCopies(TN.Algae, 2)
  ], [TN.Absylite, TN.Granite, TN.IgneousRock], [TN.Air, TN.Water], {spread: 0.8, borderHSize: 2}),
  forest: new Biome([
    ...makeCopies(TN.Dirt, 2),
    TN.AluminumOre,
    TN.Phosphorite,
    TN.IgneousRock,
    TN.Dirt,
    TN.Phosphorite,
    ...makeCopies(TN.IgneousRock, 2),
  ], [TN.Granite, TN.IgneousRock], [], {spread: 0.6}),
  marsh: new Biome([
    TN.Slime, TN.Algae, TN.Clay,
    ...makeCopies(TN.SedimentaryRock, 2),
    TN.GoldAmalgam
  ], [TN.Absylite, TN.Neutronium], [TN.Air, TN.Water], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
  frozen: new Biome([
    TN.Ice, TN.PollutedIce, TN.Snow, TN.Granite, TN.AluminumOre
  ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
  tidePool: new Biome([
    TN.BleachStone, TN.Salt, TN.Sand, TN.SedimentaryRock, TN.Granite
  ], [TN.Absylite, TN.Neutronium], [TN.Water], {spread: 0.5, borderHSize: 0, borderVSize: 2}),
  jungle: new Biome([
    TN.Phosphorite, TN.IronOre, TN.BleachStone, TN.Algae, TN.Coal, TN.IgneousRock
  ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 3}),
  oil: new Biome([
    ...makeCopies(TN.IgneousRock, 2),
    ...makeCopies(TN.Granite, 1),
    TN.Diamond,
    TN.IronOre,
    TN.Fossil,
    ...makeCopies(TN.Lead, 1),
    TN.IronOre
  ], [TN.Absylite, TN.Neutronium], [], {spread: 0.5, borderHSize: 2, borderVSize: 2}),
  volcanic: new Biome([TN.Obsidian, TN.Magma], [TN.Obsidian], [], {spread: 0.1, borderSize: 2, borderVSize: 2})
};