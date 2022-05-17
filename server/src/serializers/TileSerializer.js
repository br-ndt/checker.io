import PawnSerializer from "./PawnSerializer.js";

class TileSerializer {
  static async getSummary(tile) {
    const allowedAttributes = ["x", "y"];
    let serializedTile = {};
    for(const attribute of allowedAttributes) {
      serializedTile[attribute] = tile[attribute];
    }
    const pawn = await tile.$relatedQuery("pawn") || null;
    if(pawn) {
      serializedTile.pawn = await PawnSerializer.getSummary(pawn);
    }
    return serializedTile;
  }
}

export default TileSerializer;