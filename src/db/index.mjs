import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { PasscodeModel } from "./passcodes/index.mjs";

const betterSqlite = new Database("db.sqlite");
const db = drizzle(betterSqlite);

migrate(db, { migrationsFolder: "./drizzle" });

(async () => {
  await PasscodeModel.createTriggers(db);
})();

export default db;
