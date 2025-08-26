import { db } from '@/db';
import { studiosTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Studio } from '@/types';
import HomeClient from '@/components/HomeClient';

// Server-side function to fetch studios
async function getStudios(): Promise<Studio[]> {
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

    return studios as Studio[];
  } catch (error) {
    console.error('Error fetching studios:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  // Fetch studios on server-side
  const studios = await getStudios();

  return <HomeClient studios={studios} />;
}
