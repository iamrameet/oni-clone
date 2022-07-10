type NaturalTileName = "Air" | "Absylite" | "Dirt" | "Sand" | "Fertilizer" | "Oxylite" | "SlimeMold" | "Algae" | "Sandstone" | "Coal" | "IgneousRock" | "Phosphorus" | "Phosphorite" | "Sulfur" | "Limestone" | "Copper" | "Iron" | "Aluminum";

type NaturalTileIndexNameMap = {
  [key in NaturalTileName]: number;
}