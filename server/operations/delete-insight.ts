import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  console.log(`Deleting insight for id=${input.id}`);

  const changes = input.db.prepare("DELETE FROM insights WHERE id = ?").run(
    input.id,
  );
  const deleted = changes > 0;

  if (deleted) {
    console.log("Insight deleted successfully");
    return true;
  }

  console.log("Insight not found");
  return false;
};
