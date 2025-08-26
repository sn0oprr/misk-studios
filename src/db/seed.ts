import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { studiosTable, equipmentsTable } from './schema';

config({ path: '.env' });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

const equipmentData = [
  {
    name: "Shure SM7B Microphone",
    type: "Audio",
    description: "Professional broadcast microphone, perfect for podcasting and vocal recording"
  },
  {
    name: "Audio-Technica AT2020",
    type: "Audio", 
    description: "Condenser microphone with exceptional detail and low noise"
  },
  {
    name: "Sony A7S III Camera",
    type: "Video",
    description: "4K full-frame mirrorless camera ideal for video production and streaming"
  },
  {
    name: "Focusrite Scarlett 2i2",
    type: "Recording",
    description: "USB audio interface for professional recording and monitoring"
  },
  {
    name: "Rode PodMic",
    type: "Audio",
    description: "Broadcast-grade dynamic microphone designed specifically for podcasting"
  },
  {
    name: "Elgato Key Light Air",
    type: "Lighting",
    description: "Professional LED panel light with app control for streaming and video"
  },
  {
    name: "MacBook Pro M3",
    type: "Computer",
    description: "High-performance laptop for audio/video editing and live streaming"
  },
  {
    name: "Blackmagic ATEM Mini",
    type: "Streaming",
    description: "Live production switcher for multi-camera streaming and recording"
  }
];

const studioData = [
  {
    id: "studio-podcast-pro",
    name: "Studio Podcast Pro",
    area: 25,
    category: "Podcast" as const,
    description: "Studio professionnel dédié au podcasting avec isolation acoustique optimale et équipements haut de gamme. Parfait pour des enregistrements de qualité professionnelle.",
    images: [
      "/images/studio-placeholder-1-1.jpg",
      "/images/studio-placeholder-1-2.jpg", 
      "/images/studio-placeholder-1-3.jpg"
    ],
    equipment: ["Shure SM7B Microphone", "Focusrite Scarlett 2i2", "MacBook Pro M3"],
    price: "150.00"
  },
  {
    id: "studio-streaming-live",
    name: "Studio Streaming Live",
    area: 35,
    category: "Streaming" as const,
    description: "Espace moderne équipé pour le streaming en direct avec éclairage professionnel et setup multi-caméras. Idéal pour les créateurs de contenu et les diffusions live.",
    images: [
      "/images/studio-placeholder-2-1.jpg",
      "/images/studio-placeholder-2-2.jpg",
      "/images/studio-placeholder-2-3.jpg"
    ],
    equipment: ["Sony A7S III Camera", "Elgato Key Light Air", "Blackmagic ATEM Mini", "MacBook Pro M3"],
    price: "200.00"
  },
  {
    id: "studio-recording-deluxe",
    name: "Studio Enregistrement Deluxe", 
    area: 50,
    category: "Enregistrement" as const,
    description: "Studio d'enregistrement haut de gamme avec acoustique professionnelle et équipements premium. Parfait pour la musique, voix-off et enregistrements audio de qualité studio.",
    images: [
      "/images/studio-placeholder-3-1.jpg",
      "/images/studio-placeholder-3-2.jpg",
      "/images/studio-placeholder-3-3.jpg"
    ],
    equipment: ["Audio-Technica AT2020", "Focusrite Scarlett 2i2", "Rode PodMic", "MacBook Pro M3"],
    price: "250.00"
  },
  {
    id: "studio-production-creative",
    name: "Studio Production Créative",
    area: 40,
    category: "Production" as const, 
    description: "Espace polyvalent pour la production de contenu créatif, montage vidéo et post-production. Équipé pour tous types de projets audiovisuels.",
    images: [
      "/images/studio-placeholder-4-1.jpg",
      "/images/studio-placeholder-4-2.jpg",
      "/images/studio-placeholder-4-3.jpg"
    ],
    equipment: ["Sony A7S III Camera", "Audio-Technica AT2020", "Elgato Key Light Air", "MacBook Pro M3"],
    price: "180.00"
  },
  {
    id: "studio-compact-starter",
    name: "Studio Compact Starter",
    area: 20,
    category: "Podcast" as const,
    description: "Studio compact et abordable, parfait pour débuter dans le podcasting ou l'enregistrement. Équipement essentiel pour une qualité professionnelle accessible.",
    images: [
      "/images/studio-placeholder-1-1.jpg",
      "/images/studio-placeholder-2-2.jpg",
      "/images/studio-placeholder-3-3.jpg"
    ],
    equipment: ["Rode PodMic", "Focusrite Scarlett 2i2"],
    price: "100.00"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(studiosTable);
    await db.delete(equipmentsTable);

    // Insert equipment
    console.log('🎛️ Inserting equipment...');
    const insertedEquipment = await db.insert(equipmentsTable).values(equipmentData).returning();
    console.log(`✅ Inserted ${insertedEquipment.length} equipment items`);

    // Insert studios 
    console.log('🏢 Inserting studios...');
    const insertedStudios = await db.insert(studiosTable).values(studioData).returning();
    console.log(`✅ Inserted ${insertedStudios.length} studios`);

    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Seeded Data Summary:');
    console.log('Studios:');
    insertedStudios.forEach((studio, index) => {
      console.log(`  ${index + 1}. ${studio.name} (${studio.category}) - ${studio.price}€/h`);
    });
    
    console.log('\nEquipment:');
    insertedEquipment.forEach((equipment, index) => {
      console.log(`  ${index + 1}. ${equipment.name} (${equipment.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
};

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
