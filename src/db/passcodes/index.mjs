import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { passcodes, users } from "../schema.mjs";
import { addMinutes, isAfter } from "date-fns";

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
   * Is passcode active, or nonexistent or expired
   *
   * @param {number} id
   * @returns {boolean} is passcode active
   */
  async isActive(id) {
    const rows = await db
      .select({
        createdAt: passcodes.createdAt,
      })
      .from(passcodes)
      .where(eq(passcodes.id, id));

    if (!rows.length) return false;

    const expiresAt = addMinutes(new Date(rows[0].createdAt), 5);

    return isAfter(expiresAt, new Date());
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
    const rows = await db.insert(passcodes).values({ userId }).returning();

    await db
      .update(users)
      .set({ passcodeId: rows[0].id })
      .where(eq(users.id, userId));
    return rows;
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
