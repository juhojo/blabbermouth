import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite);

const result = await db.select().from(users);
