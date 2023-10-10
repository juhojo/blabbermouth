import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { passcodes, users } from "../schema.mjs";
import { addMinutes, isAfter } from "date-fns";

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
    const passcode = await db.query.passcodes.findFirst({
      columns: { createdAt: true },
      where: eq(passcodes.id, id),
    });

    if (!passcode) return false;

    const expiresAt = addMinutes(new Date(passcode.createdAt), 5);

    return isAfter(expiresAt, new Date());
  },

  /**
   * Get rows that match `userId`
   *
   * @param {number} userId
   * @returns
   */
  async getRowByUserId(userId) {
    return await db.query.passcodes.findFirst({
      where: eq(passcodes.userId, userId),
    });
  },

  /**
   * Create a row
   *
   * @param {number} userId
   * @returns
   */
  async createRow(userId) {
    const passcode = (
      await db.insert(passcodes).values({ userId }).returning()
    )[0];

    await db
      .update(users)
      .set({ passcodeId: passcode.id })
      .where(eq(users.id, userId));

    return passcode;
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    await db.delete(passcodes).where(eq(passcodes.id, id));
  },
};
