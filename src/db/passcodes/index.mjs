import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { passcodes } from "../schema.mjs";

// TODO: Rename (?)
export const PasscodeModel = {
  async createTriggers(db) {
    await db.run(
      sql.raw(`
        CREATE TRIGGER IF NOT EXISTS passcodes_del_old_rows_for_user_after_ins AFTER INSERT ON passcodes
          BEGIN
            DELETE FROM passcodes WHERE user_id = NEW.user_id AND id != NEW.id;
          END;
      `)
    );
  },

  /**
   * Get rows that match `sql`
   *
   * @param {string} sql
   * @returns {Promise<User[]>}
   */
  async getRows(sql) {
    return await db.select().from(passcodes).where(sql);
  },

  /**
   * Get rows that match `userId`
   *
   * @param {number} userId
   * @returns
   */
  async getRowsByUserId(userId) {
    return await this.getRows(eq(passcodes.userId, userId));
  },

  /**
   * Create a row
   *
   * @param {number} userId
   * @returns
   */
  async createRow(userId) {
    return await db.insert(passcodes).values({ userId }).returning();
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    return await db.delete(passcodes).where(eq(passcodes.id, id));
  },
};
