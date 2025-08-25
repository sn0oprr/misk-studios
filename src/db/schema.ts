import { integer, pgTable, serial, text, timestamp, boolean, numeric, json } from 'drizzle-orm/pg-core';

export const studiosTable = pgTable('studios', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  area: integer('area').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  images: json('images').$type<string[]>().notNull(),
  equipment: json('equipment').$type<string[]>().notNull(),
  price: text('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const equipmentsTable = pgTable('equipments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const bookingsTable = pgTable('bookings', {
  id: serial('id').primaryKey(),
  studioId: text('studio_id')
    .notNull()
    .references(() => studiosTable.id, { onDelete: 'cascade' }),
  studioName: text('studio_name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertStudio = typeof studiosTable.$inferInsert;
export type SelectStudio = typeof studiosTable.$inferSelect;

export type InsertEquipment = typeof equipmentsTable.$inferInsert;
export type SelectEquipment = typeof equipmentsTable.$inferSelect;

export type InsertBooking = typeof bookingsTable.$inferInsert;
export type SelectBooking = typeof bookingsTable.$inferSelect;
