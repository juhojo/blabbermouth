import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { users } from "../schema.mjs";

/**
 * @typedef User
 * @property {number} id
 * @property {string} email
 * @property {string} createdAt
 *
 * @typedef UserAggregates
 * @property {number} count
 *
 */

// TODO: Rename (?)
export const UserModel = {
  /**
   * Get aggregates for all rows
   *
   * @returns {UserAggregates[]}
   */
  getAllAggregates() {
    return db
      .select({ count: sql`count(*)` })
      .from(users)
      .all();
  },

  /**
   * Get all rows
   *
   * @returns {User[]}
   */
  getAll() {
    return db.select().from(users).all();
  },

  /**
   * Get rows that match `sql`
   *
   * @param {string} sql
   * @returns {Promise<User[]>}
   */
  async getRows(sql) {
    return await db.select().from(users).where(sql);
  },

  /**
   * Get rows that match `id`
   *
   * @param {number} id
   * @returns {Promise<User[]>}
   */
  async getRowsById(id) {
    return await this.getRows(eq(users.email, id));
  },

  /**
   * Get rows that match `email`
   *
   * @param {string} email
   * @returns {Promise<User[]>}
   */
  async getRowsByEmail(email) {
    return await this.getRows(eq(users.email, email));
  },

  /**
   * Create a row
   *
   * @param {string} email
   * @returns
   */
  async createRow(email) {
    return await db.insert(users).values({ email }).returning();
  },

  /**
   * Update a row
   *
   * @param {number} id
   * @param {string} email
   * @returns
   */
  async updateRow(id, email) {
    return await db.update(users).set({ email }).where(eq(users.id, id));
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    return await db.delete(users).where(eq(users.id, id));
  },
};
