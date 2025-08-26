import { db } from '@/db';
import { studiosTable, equipmentsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Studio } from '@/types';
import HomeClient from '@/components/HomeClient';

// Server-side function to fetch studios with equipment names
async function getStudios(): Promise<Studio[]> {
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
      ),
      // Ensure price is a number for consistency
      price: typeof studio.price === 'string' ? parseFloat(studio.price) || 0 : studio.price
    }));

    return studiosWithEquipmentNames as Studio[];
  } catch (error) {
    console.error('Error fetching studios:', error);
    return []; // Return empty array on error
  }
}

// Revalidate every 60 seconds for ISR, but revalidatePath will update immediately
export const revalidate = 60;

export default async function Home() {
  // Fetch studios on server-side
  const studios = await getStudios();

  return <HomeClient studios={studios} />;
}
