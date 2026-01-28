// ***********************************************************
// This support file is processed and loaded automatically before test files.
// You can change the location of this file or turn off automatically serving
// support files with the 'supportFile' configuration option.
// ***********************************************************

import '@testing-library/cypress/add-commands';

// Custom commands
Cypress.Commands.add('resetDatabase', () => {
  // This would connect to your test database and reset it
  // For now, we'll use the API to clean up
  cy.request('POST', '/api/test/reset');
});

declare global {
  namespace Cypress {
    interface Chainable {
      resetDatabase(): Chainable<void>;
    }
  }
}

export {};
