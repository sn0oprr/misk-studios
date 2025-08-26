import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studiosTable, equipmentsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch single studio by ID
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const studio = await db
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
      .where(eq(studiosTable.id, id))
      .limit(1);

    if (studio.length === 0) {
      return NextResponse.json(
        { error: 'Studio not found' },
        { status: 404 }
      );
    }

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

    // Transform studio to include equipment names instead of IDs
    const studioWithEquipmentNames = {
      ...studio[0],
      equipment: (studio[0].equipment as string[]).map(equipmentId => 
        equipmentMap.get(equipmentId) || `Equipment ${equipmentId}`
      ),
      // Ensure price is a number for consistency
      price: typeof studio[0].price === 'string' ? parseFloat(studio[0].price) || 0 : studio[0].price
    };

    return NextResponse.json(studioWithEquipmentNames, { status: 200 });
  } catch (error) {
    console.error('Error fetching studio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studio' },
      { status: 500 }
    );
  }
};

// PUT - Update studio
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, area, category, description, images, equipment, price } = body;

    // Validate required fields
    if (!name || !area || !category || !description || price === undefined || price === null) {
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

    // Validate that price is a valid number
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
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

    // Check if studio exists
    const existingStudio = await db
      .select()
      .from(studiosTable)
      .where(eq(studiosTable.id, id))
      .limit(1);

    if (existingStudio.length === 0) {
      return NextResponse.json(
        { error: 'Studio not found' },
        { status: 404 }
      );
    }

    // Images are already processed URLs from the upload API
    const processedImages = images || [];

    // Convert equipment IDs to strings for storage
    const equipmentStrings = (equipment || []).map((id: number) => id.toString());

    // Update studio
    const updatedStudio = await db
      .update(studiosTable)
      .set({
        name,
        area,
        category,
        description,
        images: processedImages,
        equipment: equipmentStrings,
        price: priceNumber,
        updatedAt: new Date(),
      })
      .where(eq(studiosTable.id, id))
      .returning();

    return NextResponse.json(updatedStudio[0], { status: 200 });
  } catch (error) {
    console.error('Error updating studio:', error);
    return NextResponse.json(
      { error: 'Failed to update studio' },
      { status: 500 }
    );
  }
};

// DELETE - Delete studio
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    // Check if studio exists
    const existingStudio = await db
      .select()
      .from(studiosTable)
      .where(eq(studiosTable.id, id))
      .limit(1);

    if (existingStudio.length === 0) {
      return NextResponse.json(
        { error: 'Studio not found' },
        { status: 404 }
      );
    }

    // Delete studio
    await db
      .delete(studiosTable)
      .where(eq(studiosTable.id, id));

    return NextResponse.json(
      { message: 'Studio deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting studio:', error);
    return NextResponse.json(
      { error: 'Failed to delete studio' },
      { status: 500 }
    );
  }
};
