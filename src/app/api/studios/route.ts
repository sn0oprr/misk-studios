import { NextResponse } from 'next/server';
import { db } from '@/db';
import { studiosTable, equipmentsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET - Fetch all studios for public display
export const GET = async () => {
  try {
    // First, get all studios
    const studios = await db
      .select({
        id: studiosTable.id,
        name: studiosTable.name,
        area: studiosTable.area,
        category: studiosTable.category,
        description: studiosTable.description,
        images: studiosTable.images,
        equipment: studiosTable.equipment,
        price: studiosTable.price,
        createdAt: studiosTable.createdAt,
        updatedAt: studiosTable.updatedAt,
      })
      .from(studiosTable)
      .orderBy(desc(studiosTable.createdAt));

    // Get all equipments to create a lookup map
    const equipments = await db
      .select({
        id: equipmentsTable.id,
        name: equipmentsTable.name,
      })
      .from(equipmentsTable);

    // Create a map for quick equipment lookup
    const equipmentMap = new Map(
      equipments.map(eq => [eq.id.toString(), eq.name])
    );

    // Transform studios to include equipment names instead of IDs
    const studiosWithEquipmentNames = studios.map(studio => ({
      ...studio,
      equipment: (studio.equipment as string[]).map(equipmentId => 
        equipmentMap.get(equipmentId) || `Equipment ${equipmentId}`
      )
    }));

    return NextResponse.json(studiosWithEquipmentNames, { status: 200 });
  } catch (error) {
    console.error('Error fetching studios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studios' },
      { status: 500 }
    );
  }
};
