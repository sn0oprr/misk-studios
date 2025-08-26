import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookingsTable, studiosTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET - Fetch all bookings with studio information
export const GET = async () => {
  try {
    // Fetch bookings with joined studio information
    const bookings = await db
      .select({
        id: bookingsTable.id,
        studioId: bookingsTable.studioId,
        studioName: studiosTable.name,
        firstName: bookingsTable.firstName,
        lastName: bookingsTable.lastName,
        email: bookingsTable.email,
        phone: bookingsTable.phone,
        city: bookingsTable.city,
        message: bookingsTable.message,
        createdAt: bookingsTable.createdAt,
        updatedAt: bookingsTable.updatedAt,
      })
      .from(bookingsTable)
      .leftJoin(studiosTable, eq(bookingsTable.studioId, studiosTable.id))
      .orderBy(desc(bookingsTable.createdAt));

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
};
