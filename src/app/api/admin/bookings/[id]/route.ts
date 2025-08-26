import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookingsTable, studiosTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch single booking by ID with studio information
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const booking = await db
      .select({
        id: bookingsTable.id,
        studioId: bookingsTable.studioId,
        studioName: studiosTable.name,
        studioCategory: studiosTable.category,
        studioArea: studiosTable.area,
        studioPrice: studiosTable.price,
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
      .where(eq(bookingsTable.id, id))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Ensure price is a number for consistency
    const bookingWithStudioInfo = {
      ...booking[0],
      studioPrice: typeof booking[0].studioPrice === 'string' 
        ? parseFloat(booking[0].studioPrice) || 0 
        : booking[0].studioPrice
    };

    return NextResponse.json(bookingWithStudioInfo, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
};

// DELETE - Delete booking by ID
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, id))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    await db
      .delete(bookingsTable)
      .where(eq(bookingsTable.id, id));

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
};
