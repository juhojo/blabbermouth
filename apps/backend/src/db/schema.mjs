import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import cuid2 from "@paralleldrive/cuid2";
import { randomInt } from "./util.mjs";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  passcodeId: integer("passcode_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  passcode: one(passcodes, {
    fields: [users.passcodeId],
    references: [passcodes.id],
  }),
  configs: many(configs),
}));

export const PASSCODE_MIN = 1000;
export const PASSCODE_MAX = 9999;

export const passcodes = sqliteTable("passcodes", {
  id: integer("id").primaryKey(),
  value: integer("value").$default(() => randomInt(PASSCODE_MAX, PASSCODE_MIN)),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const configs = sqliteTable("configs", {
  id: integer("id").primaryKey(),
  // TODO: Add CHECK constraints when `drizzle-kit` supports it
  // (two configs can not have the same name if they belong to the same user)
  // see: https://github.com/drizzle-team/drizzle-orm/issues/310
  name: text("name"),
  ownerId: integer("owner_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const configsRelations = relations(configs, ({ one, many }) => ({
  owner: one(users, {
    fields: [configs.ownerId],
    references: [users.id],
  }),
  fields: many(fields),
  key: one(keys, {
    fields: [configs.id],
    references: [keys.configId],
  }),
}));

export const fields = sqliteTable("fields", {
  id: integer("id").primaryKey(),
  configId: integer("config_id").references(() => configs.id, {
    onDelete: "cascade",
  }),
  // TODO: Add CHECK constraints when `drizzle-kit` supports it
  // (two keys can not be the same if they belong to the same config)
  // see: https://github.com/drizzle-team/drizzle-orm/issues/310
  key: text("key"),
  value: text("value"),
});

export const fieldsRelations = relations(fields, ({ one }) => ({
  config: one(configs, {
    fields: [fields.configId],
    references: [configs.id],
  }),
}));

export const keys = sqliteTable("keys", {
  id: integer("id").primaryKey(),
  value: text("value").unique().notNull().$default(cuid2.createId),
  configId: integer("config_id").references(() => configs.id, {
    onDelete: "cascade",
  }),
});

/**
 * @typedef {typeof users.$inferSelect} User
 * @typedef {typeof passcodes.$inferSelect} Passcode
 * @typedef {typeof configs.$inferSelect} Config
 * @typedef {typeof fields.$inferSelect} Field
 * @typedef {typeof keys.$inferSelect} Key
 *
 * @typedef {User & { passcode: Passcode } } UserWithPasscode
 * @typedef {User & { configs: Config[] } } UserWithConfigs
 * @typedef {User & { passcode: Passcode, configs: Config[] } } UserWithPasscodeAndConfigs
 *
 * @typedef {Config & { fields: Field[] } } ConfigWithFields
 */
