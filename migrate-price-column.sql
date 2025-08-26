-- Migration to add/update price column in studios table
-- Run this in your PostgreSQL database

-- First, check if the column exists and add it if it doesn't
DO $$
BEGIN
    -- Check if price column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'studios' 
        AND column_name = 'price'
    ) THEN
        -- Add price column as decimal
        ALTER TABLE studios ADD COLUMN price NUMERIC(10, 2) DEFAULT 0.00;
        RAISE NOTICE 'Added price column to studios table';
    ELSE
        -- Column exists, alter its type
        ALTER TABLE studios ALTER COLUMN price TYPE NUMERIC(10, 2) USING price::numeric;
        RAISE NOTICE 'Updated price column type to NUMERIC(10, 2)';
    END IF;
END $$;

-- Update any NULL values to 0
UPDATE studios SET price = 0.00 WHERE price IS NULL;

-- Make price column NOT NULL
ALTER TABLE studios ALTER COLUMN price SET NOT NULL;

-- Show the updated table structure
\d studios;
