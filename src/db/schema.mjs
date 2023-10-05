import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  passcode: one(passcodes, {
    fields: [users.passcode],
    references: [passcodes.id],
  }),
  configs: many(configs),
}));

export const passcodes = sqliteTable("passcodes", {
  id: integer("id").primaryKey(),
  value: text("value"),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const configs = sqliteTable("configs", {
  id: integer("id").primaryKey(),
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
