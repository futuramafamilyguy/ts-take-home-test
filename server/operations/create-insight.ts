import { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";
import { Insight } from "$models/insight.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
  createdAt?: Date;
};

export default (input: Input): Insight => {
  console.log("Creating insight");

  const { db, brand, text, createdAt = new Date() } = input;
  const insert: insightsTable.Insert = {
    brand,
    createdAt: createdAt.toISOString(),
    text,
  };
  const result = db.prepare(insightsTable.insertStatement).get(
    ...insightsTable.insertValues(insert),
  ) as { id: number };
  console.log(`Insight created successfully`);

  const id = result.id;
  return {
    id,
    brand,
    createdAt,
    text,
  };
};
