import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studiosTable, equipmentsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET - Fetch all studios
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

// POST - Create new studio
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, area, category, description, images, equipment, price } = body;

    // Validate required fields
    if (!name || !area || !category || !description || !price) {
      return NextResponse.json(
        { error: 'Name, area, category, description, and price are required' },
        { status: 400 }
      );
    }

    // Validate area is a positive number
    if (typeof area !== 'number' || area <= 0) {
      return NextResponse.json(
        { error: 'Area must be a positive number' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['Podcast', 'Enregistrement', 'Streaming', 'Production'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Images are already processed URLs from the upload API
    const processedImages = images || [];

    // Convert equipment IDs to strings for storage
    const equipmentStrings = (equipment || []).map((id: number) => id.toString());

    // Generate studio ID (simple timestamp-based)
    const studioId = `studio-${Date.now()}`;

    // Create studio
    const newStudio = await db
      .insert(studiosTable)
      .values({
        id: studioId,
        name,
        area,
        category,
        description,
        images: processedImages,
        equipment: equipmentStrings,
        price,
      })
      .returning();

    return NextResponse.json(newStudio[0], { status: 201 });
  } catch (error) {
    console.error('Error creating studio:', error);
    return NextResponse.json(
      { error: 'Failed to create studio' },
      { status: 500 }
    );
  }
};
