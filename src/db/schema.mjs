import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  apiKeyId: integer("api_key_id"),
  passcode: integer("passcode"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  apiKey: one(apiKeys, {
    fields: [users.apiKeyId],
    references: [apiKeys.id],
  }),
  passcode: one(passcodes, {
    fields: [users.passcode],
    references: [passcodes.id],
  }),
  configs: many(configs),
}));

export const apiKeys = sqliteTable("api_keys", {
  id: integer("id").primaryKey(),
  value: text("value").unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const passcodes = sqliteTable("passcodes", {
  id: integer("id").primaryKey(),
  value: text("value"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const configs = sqliteTable("configs", {
  id: integer("id").primaryKey(),
  ownerId: integer("owner_id"),
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
  configId: integer("config_id"),
});

export const fieldsRelations = relations(fields, ({ one }) => ({
  config: one(configs, {
    fields: [fields.configId],
    references: [configs.id],
  }),
}));
