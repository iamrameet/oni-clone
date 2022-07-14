type TileCategoryName = "natural" | "building" | "platform";

type TileCategoryTypeMap = {
  natural: typeof NaturalTile;
  building: typeof BuildingTile;
  platform: typeof PlatformTile;
};
type TileCategoryMap = {
  [key in keyof TileCategoryTypeMap]: InstanceType<TileCategoryTypeMap[key]>
}

type NaturalTileName = "Space" | "Air" | "Absylite" | "Dirt" | "Sand" | "Clay" | "Fertilizer" | "Oxylite" | "Salt" | "Snow" | "Ice" | "PollutedIce" | "Slime" | "Algae" | "Coal" | "Granite" | "Sandstone" | "Limestone" | "BleachStone" | "IgneousRock" | "SedimentaryRock" | "Phosphorus" | "Phosphorite" | "Sulfur" | "CopperOre" | "IronOre" | "AluminumOre" | "GoldAmalgam" | "Neutronium" | "Lead" | "Diamond" | "Fossil" | "Obsidian" | "Magma" | "Water";

type BuildingTileName = "PrintingPod";

type PlatformTileName = "Tile";


type TileCategoryNameIndexMap = {
  [key in keyof TileCategoryMap]: number;
};

type NaturalTileNameIndexMap = {
  [key in NaturalTileName]: number;
};

type BuildingTileNameIndexMap = {
  [key in BuildingTileName]: number;
};

type PlatformTileNameIndexMap = {
  [key in PlatformTileName]: number;
};