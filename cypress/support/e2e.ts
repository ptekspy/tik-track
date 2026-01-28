// ***********************************************************
// This support file is processed and loaded automatically before test files.
// You can change the location of this file or turn off automatically serving
// support files with the 'supportFile' configuration option.
// ***********************************************************

import '@testing-library/cypress/add-commands';

// Custom database commands - these run as Cypress tasks in Node.js
Cypress.Commands.add('cleanDb', () => {
  return cy.task('cleanDb');
});

Cypress.Commands.add('seedDb', (data) => {
  return cy.task('seedDb', data || {});
});

Cypress.Commands.add('createTestVideo', (data) => {
  return cy.task('createTestVideo', data);
});

Cypress.Commands.add('getAllVideos', () => {
  return cy.task('getAllVideos');
});

// Deprecated - use cleanDb instead
Cypress.Commands.add('resetDatabase', () => {
  return cy.task('cleanDb');
});

declare global {
  namespace Cypress {
    interface Chainable {
      resetDatabase(): Chainable<null>;
      cleanDb(): Chainable<null>;
      seedDb(data?: {
        videos?: any[];
        hashtags?: any[];
        snapshots?: any[];
      }): Chainable<null>;
      createTestVideo(data: {
        title: string;
        status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
        postDate?: Date;
        videoLengthSeconds?: number;
        snapshots?: any[];
        hashtags?: string[];
      }): Chainable<any>;
      getAllVideos(): Chainable<any[]>;
    }
  }
}

export {};
