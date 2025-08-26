import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookingsTable, studiosTable, equipmentsTable } from '@/db/schema';
import { desc, eq, count } from 'drizzle-orm';

export const GET = async () => {
  try {
    // Get total number of studios
    const studiosCount = await db
      .select({ count: count() })
      .from(studiosTable);

    // Get total number of bookings
    const bookingsCount = await db
      .select({ count: count() })
      .from(bookingsTable);

    // Get total number of equipments
    const equipmentsCount = await db
      .select({ count: count() })
      .from(equipmentsTable);

    // Get latest 5 bookings with studio information
    const latestBookings = await db
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
      })
      .from(bookingsTable)
      .leftJoin(studiosTable, eq(bookingsTable.studioId, studiosTable.id))
      .orderBy(desc(bookingsTable.createdAt))
      .limit(5);

    const dashboardData = {
      stats: {
        studiosCount: studiosCount[0]?.count || 0,
        bookingsCount: bookingsCount[0]?.count || 0,
        equipmentsCount: equipmentsCount[0]?.count || 0,
      },
      latestBookings: latestBookings
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
};
