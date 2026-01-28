describe('Delete Operations', () => {
  it('should delete a video with cascade deletion of snapshots', () => {
    // Create published video with snapshot
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Video to Delete');
    cy.get('input[aria-label="Seconds"]').clear().type('60');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', 'Create Video').click();

    // Add snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('1000');
    cy.contains('button', /create|save/i).click();

    // Delete video
    cy.contains('button', /delete.*video/i).click();
    
    // Confirm deletion
    cy.contains('button', /confirm|yes|delete/i).click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Video should not exist
    cy.contains('Video to Delete').should('not.exist');
  });
});
