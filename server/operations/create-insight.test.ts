import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import createInsight from "./create-insight.ts";
import { Row } from "$tables/insights.ts";

describe("creating insight", () => {
  withDB((fixture) => {
    let result: Insight | undefined;

    const currentTime = new Date();
    beforeAll(() => {
      result = createInsight({
        db: fixture.db,
        brand: 0,
        createdAt: currentTime,
        text: "New insight",
      });
    });

    it("adds the insight to the DB", () => {
      const rows: Row[] = fixture.insights.selectAll();
      expect(rows.length).toBe(1);
      expect(rows[0]).toEqual({
        id: expect.any(Number),
        brand: 0,
        createdAt: currentTime.toISOString(),
        text: "New insight",
      });
    });

    it("returns correct insight", () => {
      expect(result).toEqual({
        id: expect.any(Number),
        brand: 0,
        createdAt: currentTime.toISOString(),
        text: "New insight",
      });
    });
  });
});
