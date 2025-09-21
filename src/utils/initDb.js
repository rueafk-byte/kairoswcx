import { initializeDatabase } from './database.js';

// Initialize the database
async function init() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.log('Continuing without database connection...');
    process.exit(0); // Don't fail the build, just continue
  }
}

// Run the initialization
init();