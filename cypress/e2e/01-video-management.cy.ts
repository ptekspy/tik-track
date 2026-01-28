describe('Video Management - Draft to Published Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should create a draft video without analytics', () => {
    // Navigate to new video page
    cy.visit('/videos/new');

    // Fill in video details
    cy.get('input[name="title"]').type('My Test TikTok Video');
    cy.get('textarea[name="script"]').type('This is my video script with detailed content');
    cy.get('textarea[name="description"]').type('Video description here');

    // Set video length (e.g., 45 seconds)
    cy.get('input[name="videoLengthSeconds"]').clear().type('45');

    // Add hashtags
    cy.get('input[placeholder*="hashtag"]').type('testtag{enter}');
    cy.get('input[placeholder*="hashtag"]').type('cypress{enter}');

    // Status should default to DRAFT (no post date required)
    cy.get('select[name="status"]').should('have.value', 'DRAFT');

    // Submit form
    cy.contains('button', 'Create Video').click();

    // Should redirect to video detail page
    cy.url().should('include', '/videos/');
    cy.contains('My Test TikTok Video');
    cy.contains('DRAFT');
  });

  it('should edit draft video metadata', () => {
    // Create a draft video first
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Original Title');
    cy.get('textarea[name="script"]').type('Original script');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');
    cy.contains('button', 'Create Video').click();

    // Wait for redirect
    cy.url().should('include', '/videos/');

    // Click edit
    cy.contains('Edit').click();

    // Update fields
    cy.get('input[name="title"]').clear().type('Updated Title');
    cy.get('textarea[name="description"]').clear().type('New description');
    cy.get('input[placeholder*="hashtag"]').type('newtag{enter}');

    // Save
    cy.contains('button', /save|update/i).click();

    // Verify changes
    cy.contains('Updated Title');
    cy.contains('New description');
    cy.contains('#newtag');
  });

  it('should publish draft video with post date', () => {
    // Create a draft
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Video to Publish');
    cy.get('input[name="videoLengthSeconds"]').clear().type('60');
    cy.contains('button', 'Create Video').click();
    cy.url().should('include', '/videos/');

    // Edit to publish
    cy.contains('Edit').click();

    // Change status to PUBLISHED
    cy.get('select[name="status"]').select('PUBLISHED');

    // Post date should now be visible and required
    cy.get('input[name="postDate"]').should('be.visible');
    cy.get('input[name="postDate"]').type('2026-01-28');

    // Save
    cy.contains('button', /save|update/i).click();

    // Verify published status
    cy.contains('PUBLISHED');
  });
});
