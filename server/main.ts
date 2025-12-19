// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import * as insightsTable from "$tables/insights.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { InsertInsightSchema } from "$models/insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(insightsTable.createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  const body = await ctx.request.body.json();

  const validation = InsertInsightSchema.safeParse(body);
  if (!validation.success) {
    ctx.response.body = {
      error: "Invalid request body",
      details: validation.error.errors,
    };
    ctx.response.status = 400;
    return;
  }

  const result = createInsight({
    db,
    brand: validation.data.brand,
    text: validation.data.text,
  });
  ctx.response.body = result;
  ctx.response.status = 201;
});

router.delete("/insights/delete", async (ctx) => {
  const body = await ctx.request.body.json();
  const result = deleteInsight({
    db,
    id: body.id,
  });

  ctx.response.body = result ? "Deleted" : "Not Found";
  ctx.response.status = result ? 200 : 404;
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
