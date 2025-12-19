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
  db.prepare(insightsTable.insertStatement).run(
    ...insightsTable.insertValues(insert),
  );
  console.log(`Insight created successfully`);

  const id = db.lastInsertRowId;
  return {
    id,
    brand,
    createdAt,
    text,
  };
};
