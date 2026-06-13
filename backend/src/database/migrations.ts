import { query } from './init';

export const runAllMigrations = async () => {
  console.log('Starting migrations...');
  
  try {
    // Add file_path column to agreement_templates if it doesn't exist
    await query(`
      ALTER TABLE agreement_templates 
      ADD COLUMN IF NOT EXISTS file_path VARCHAR(500)
    `);
    
    console.log('✓ Migrations completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }
};
