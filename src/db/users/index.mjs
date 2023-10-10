import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { users } from "../schema.mjs";

export const UserModel = {
  /**
   * Get all rows
   * @returns
   */
  getAll() {
    const rows = db.select().from(users).all();
    const aggregates = db
      .select({ count: sql`count(*)` })
      .from(users)
      .all();

    return {
      rows,
      aggregates: {
        count: aggregates?.[0].count ?? 0,
      },
    };
  },

  /**
   * Get rows that match `id`
   *
   * @param {number} id
   * @returns
   */
  async getRowById(id) {
    return await db.query.users.findFirst({ where: eq(users.id, id) });
  },

  /**
   * Get rows that match `email`
   *
   * @param {string} email
   * @returns
   */
  async getRowByEmail(email) {
    return await db.query.users.findFirst({ where: eq(users.email, email) });
  },

  /**
   * Get rows that match `email`
   *
   * @param {string} email
   * @returns
   */
  async getRowWithPasscodeByEmail(email) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        passcode: true,
      },
    });
  },

  /**
   * Create a row
   *
   * @param {string} email
   * @returns
   */
  async createRow(email) {
    const user = (await db.insert(users).values({ email }).returning())[0];

    return user;
  },

  /**
   * Get a row or create a row
   *
   * @param {string} email
   * @returns
   */
  async getOrCreateRow(email) {
    let user = await this.getRowByEmail(email);

    if (!user) {
      user = await this.createRow(email);
    }

    return user;
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
    await db.delete(users).where(eq(users.id, id));
  },
};
