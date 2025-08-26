import { NextResponse } from 'next/server';
import { db } from '@/db';
import { equipmentsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET - Fetch all equipments for selection (public endpoint)
export const GET = async () => {
  try {
    const equipments = await db
      .select({
        id: equipmentsTable.id,
        name: equipmentsTable.name,
        type: equipmentsTable.type,
        description: equipmentsTable.description,
      })
      .from(equipmentsTable)
      .orderBy(desc(equipmentsTable.name));

    return NextResponse.json(equipments, { status: 200 });
  } catch (error) {
    console.error('Error fetching equipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipments' },
      { status: 500 }
    );
  }
};
