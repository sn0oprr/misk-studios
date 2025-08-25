import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipmentsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch single equipment by ID
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    const equipment = await db
      .select({
        id: equipmentsTable.id,
        name: equipmentsTable.name,
        type: equipmentsTable.type,
        description: equipmentsTable.description,
        createdAt: equipmentsTable.createdAt,
        updatedAt: equipmentsTable.updatedAt,
      })
      .from(equipmentsTable)
      .where(eq(equipmentsTable.id, id))
      .limit(1);

    if (equipment.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
};

// PUT - Update equipment
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, type, description } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Check if equipment exists
    const existingEquipment = await db
      .select()
      .from(equipmentsTable)
      .where(eq(equipmentsTable.id, id))
      .limit(1);

    if (existingEquipment.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Update equipment
    const updatedEquipment = await db
      .update(equipmentsTable)
      .set({
        name,
        type,
        description: description || null,
        updatedAt: new Date(),
      })
      .where(eq(equipmentsTable.id, id))
      .returning();

    return NextResponse.json(updatedEquipment[0], { status: 200 });
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    );
  }
};

// DELETE - Delete equipment
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    // Check if equipment exists
    const existingEquipment = await db
      .select()
      .from(equipmentsTable)
      .where(eq(equipmentsTable.id, id))
      .limit(1);

    if (existingEquipment.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Delete equipment
    await db
      .delete(equipmentsTable)
      .where(eq(equipmentsTable.id, id));

    return NextResponse.json(
      { message: 'Equipment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    );
  }
};
