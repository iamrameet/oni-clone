type NaturalTileName = "Space" | "Air" | "Absylite" | "Dirt" | "Sand" | "Clay" | "Fertilizer" | "Oxylite" | "Salt" | "Snow" | "Ice" | "PollutedIce" | "Slime" | "Algae" | "Coal" | "Granite" | "Sandstone" | "Limestone" | "BleachStone" | "IgneousRock" | "SedimentaryRock" | "Phosphorus" | "Phosphorite" | "Sulfur" | "CopperOre" | "IronOre" | "AluminumOre" | "GoldAmalgam" | "Neutronium" | "Lead" | "Diamond" | "Fossil" | "Obsidian" | "Magma" | "Water";

type BuildingTileCategory = {
  base: "Tile" | "PrintingPod"
};

type NaturalTileIndexNameMap = {
  [key in NaturalTileName]: number;
}
type BuildingTileIndexNameMap = {
  [key in keyof BuildingTileCategory]: {
    [k in BuildingTileCategory[key]]: number
  };
}