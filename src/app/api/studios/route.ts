import { NextResponse } from 'next/server';
import { db } from '@/db';
import { studiosTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET - Fetch all studios for public display
export const GET = async () => {
  try {
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

    return NextResponse.json(studios, { status: 200 });
  } catch (error) {
    console.error('Error fetching studios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studios' },
      { status: 500 }
    );
  }
};
