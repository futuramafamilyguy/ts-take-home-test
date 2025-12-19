import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting insights in the database", () => {
  describe("insight is not in the DB", () => {
    withDB((fixture) => {
      const insights: Insight[] = [
        { id: 1, brand: 0, createdAt: new Date(), text: "1" },
      ];

      let result: boolean;

      beforeAll(() => {
        fixture.insights.insert(
          insights.map((it) => ({
            ...it,
            createdAt: it.createdAt.toISOString(),
          })),
        );
        result = deleteInsight({ ...fixture, id: 3 });
      });

      it("nothing is deleted", () => {
        expect(result).toBe(false);
        expect(fixture.insights.selectAll().length).toBe(1);
      });
    });
  });

  describe("insight is in the DB", () => {
    withDB((fixture) => {
      const insights: Insight[] = [
        { id: 1, brand: 0, createdAt: new Date(), text: "1" },
        { id: 2, brand: 0, createdAt: new Date(), text: "2" },
        { id: 3, brand: 1, createdAt: new Date(), text: "3" },
      ];

      let result: boolean;

      beforeAll(() => {
        fixture.insights.insert(
          insights.map((it) => ({
            ...it,
            createdAt: it.createdAt.toISOString(),
          })),
        );
        result = deleteInsight({ ...fixture, id: 3 });
      });

      it("an insight is deleted", () => {
        expect(result).toBe(true);
        expect(fixture.insights.selectAll().length).toBe(2);
        expect(fixture.insights.selectAll().find((it) => it.id === 3))
          .toBeUndefined();
      });
    });
  });
});
