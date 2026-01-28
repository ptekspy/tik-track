import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import {
  cleanDatabase,
  createTestVideo,
  seedDatabase,
  getAllVideos,
} from './cypress/support/db-helpers';

// Load test environment variables - Next.js loads .env.test when NODE_ENV=test
// We need to do the same for Cypress
dotenv.config({ path: '.env.test', override: true });

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Set test database URL from environment
      config.env.TEST_DATABASE_URL = process.env.PRISMA_DATABASE_URL;
      
      // Register database tasks that run in Node.js
      on('task', {
        cleanDb: async () => {
          await cleanDatabase();
          return null;
        },
        createTestVideo: async (data: Parameters<typeof createTestVideo>[0]) => {
          return await createTestVideo(data);
        },
        seedDb: async (data: Parameters<typeof seedDatabase>[0]) => {
          await seedDatabase(data);
          return null;
        },
        getAllVideos: async () => {
          return await getAllVideos();
        },
      });

      return config;
    },
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  env: {
    // Test database URL will be loaded from .env file
  },
});
