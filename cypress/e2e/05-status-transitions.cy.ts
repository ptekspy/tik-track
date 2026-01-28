describe('Video Status Transitions', () => {
  it('should enforce forward-only status transitions', () => {
    // Create draft
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Status Test Video');
    cy.get('input[aria-label="Seconds"]').clear().type('30');
    cy.contains('button', 'Create Video').click();

    // Publish it
    cy.contains('Edit').click();
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', /save|update/i).click();

    // Archive it
    cy.contains('Edit').click();
    cy.get('select[name="status"]').select('ARCHIVED');
    cy.contains('button', /save|update/i).click();
    cy.contains('ARCHIVED');

    // Try to go back to PUBLISHED (should fail or be disabled)
    cy.contains('Edit').click();
    
    // DRAFT and PUBLISHED should be disabled in the dropdown
    cy.get('select[name="status"] option[value="DRAFT"]').should('be.disabled');
    cy.get('select[name="status"] option[value="PUBLISHED"]').should('be.disabled');
  });

  it('should allow editing archived video metadata', () => {
    // Create and archive a video
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Archive Edit Test');
    cy.get('input[aria-label="Seconds"]').clear().type('30');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', 'Create Video').click();

    cy.contains('Edit').click();
    cy.get('select[name="status"]').select('ARCHIVED');
    cy.contains('button', /save|update/i).click();

    // Edit metadata
    cy.contains('Edit').click();
    cy.get('input[name="title"]').clear().type('Updated Archived Title');
    cy.get('textarea[name="description"]').clear().type('New description for archived video');
    cy.contains('button', /save|update/i).click();

    // Verify changes
    cy.contains('Updated Archived Title');
    cy.contains('New description for archived video');
  });

  it('should prevent adding snapshot to draft video', () => {
    // Create draft video
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Draft No Snapshot');
    cy.get('input[aria-label="Seconds"]').clear().type('30');
    cy.contains('button', 'Create Video').click();

    // Should not have "Add Snapshot" button or link
    cy.contains(/create.*snapshot|add.*snapshot/i).should('not.exist');
  });
});
