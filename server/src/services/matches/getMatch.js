import { Match } from "../../models/index.js";
import MatchSerializer from "../../serializers/MatchSerializer.js";

export default async (id) => {
  try {
    const match = await Match.query().findById(id);
    const serializedMatch = await MatchSerializer.getSummary(match);
    return serializedMatch;
  } catch (error) {
    console.error(error);
  }
};