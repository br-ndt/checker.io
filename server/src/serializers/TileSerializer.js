class TileSerializer {
  static async getSummary(tile) {
    const allowedAttributes = ["x", "y"];
    let serializedTile = {};
    for(const attribute of allowedAttributes) {
      serializedTile[attribute] = tile[attribute];
    }
    return serializedTile;
  }
}

export default TileSerializer;