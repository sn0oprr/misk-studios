# Database Seed Script

This seed script populates the database with sample data for the Misk Studios application.

## What gets seeded

### 5 Studios:
1. **Studio Podcast Pro** (Podcast, 25m², 150€/h)
   - Professional podcasting studio with acoustic isolation
   - Equipment: Shure SM7B, Focusrite Scarlett 2i2, MacBook Pro M3

2. **Studio Streaming Live** (Streaming, 35m², 200€/h)
   - Modern streaming setup with professional lighting and multi-camera
   - Equipment: Sony A7S III, Elgato Key Light Air, Blackmagic ATEM Mini, MacBook Pro M3

3. **Studio Enregistrement Deluxe** (Enregistrement, 50m², 250€/h)
   - High-end recording studio with professional acoustics
   - Equipment: Audio-Technica AT2020, Focusrite Scarlett 2i2, Rode PodMic, MacBook Pro M3

4. **Studio Production Créative** (Production, 40m², 180€/h)
   - Versatile space for creative content production and video editing
   - Equipment: Sony A7S III, Audio-Technica AT2020, Elgato Key Light Air, MacBook Pro M3

5. **Studio Compact Starter** (Podcast, 20m², 100€/h)
   - Compact and affordable studio, perfect for podcasting beginners
   - Equipment: Rode PodMic, Focusrite Scarlett 2i2

### 8 Equipment Items:
1. **Shure SM7B Microphone** (Audio) - Professional broadcast microphone
2. **Audio-Technica AT2020** (Audio) - Condenser microphone with exceptional detail
3. **Sony A7S III Camera** (Video) - 4K full-frame mirrorless camera
4. **Focusrite Scarlett 2i2** (Recording) - USB audio interface
5. **Rode PodMic** (Audio) - Broadcast-grade dynamic microphone for podcasting
6. **Elgato Key Light Air** (Lighting) - Professional LED panel light
7. **MacBook Pro M3** (Computer) - High-performance laptop for editing and streaming
8. **Blackmagic ATEM Mini** (Streaming) - Live production switcher

## Usage

### Prerequisites
1. Make sure your database is running and accessible
2. Set up your `.env` file with the correct `DATABASE_URL`
3. Run database migrations if needed

### Running the seed script

```bash
# Install dependencies first (if not already done)
npm install

# Run the seed script
npm run db:seed
```

### What happens when you run the seed script:
1. **Clears existing data** - Removes all existing studios and equipment
2. **Inserts equipment** - Adds the 8 equipment items
3. **Inserts studios** - Adds the 5 studios with their equipment references
4. **Shows summary** - Displays what was created

⚠️ **Warning**: This script will delete all existing studios and equipment data before inserting the new seed data.

## Script Features

- **Realistic data**: All studios and equipment have realistic names, descriptions, and specifications
- **Proper relationships**: Studios reference equipment by name in their equipment arrays
- **Multiple categories**: Studios cover all available categories (Podcast, Streaming, Enregistrement, Production)
- **Varied pricing**: Different price points from 100€ to 250€ per hour
- **Equipment types**: Covers all major equipment types (Audio, Video, Lighting, Computer, Recording, Streaming)
- **Error handling**: Includes proper error handling and cleanup
- **Console feedback**: Provides detailed feedback during the seeding process

## Troubleshooting

If the seed script fails:

1. **Check database connection**: Ensure your `DATABASE_URL` in `.env` is correct
2. **Run migrations**: Make sure all database migrations are up to date
3. **Check permissions**: Ensure the database user has INSERT and DELETE permissions
4. **Review logs**: The script provides detailed error messages to help diagnose issues

## File Structure

- `src/db/seed.ts` - Main seed script
- `src/db/schema.ts` - Database schema definitions
- `src/db/index.ts` - Database connection
