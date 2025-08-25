import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipmentsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET - Fetch all equipments
export const GET = async () => {
  try {
    const equipments = await db
      .select({
        id: equipmentsTable.id,
        name: equipmentsTable.name,
        type: equipmentsTable.type,
        description: equipmentsTable.description,
        createdAt: equipmentsTable.createdAt,
        updatedAt: equipmentsTable.updatedAt,
      })
      .from(equipmentsTable)
      .orderBy(desc(equipmentsTable.createdAt));

    return NextResponse.json(equipments, { status: 200 });
  } catch (error) {
    console.error('Error fetching equipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipments' },
      { status: 500 }
    );
  }
};

// POST - Create new equipment
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, type, description } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Create equipment
    const newEquipment = await db
      .insert(equipmentsTable)
      .values({
        name,
        type,
        description: description || null,
      })
      .returning();

    return NextResponse.json(newEquipment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
};
