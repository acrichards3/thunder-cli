import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  id: uuid("id").primaryKey().defaultRandom(),
  image: text("image"),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
