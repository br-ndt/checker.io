class PawnSerializer {
  static async getSummary(pawn) {
    const allowedAttributes = ["tileId", "color"];
    let serializedPawn = {};
    for(const attribute of allowedAttributes) {
      serializedPawn[attribute] = pawn[attribute];
    }
    return serializedPawn;
  }
}

export default PawnSerializer;