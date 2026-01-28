describe('Hashtag Management', () => {
  it('should create and link hashtags to video', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Video with Hashtags');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');

    // Add multiple hashtags
    cy.get('input[placeholder*="hashtag"]').type('trending{enter}');
    cy.get('input[placeholder*="hashtag"]').type('viral{enter}');
    cy.get('input[placeholder*="hashtag"]').type('fyp{enter}');

    cy.contains('button', 'Create Video').click();

    // Verify hashtags appear
    cy.contains('#trending');
    cy.contains('#viral');
    cy.contains('#fyp');
  });

  it('should view hashtag stats', () => {
    // Create multiple videos with same hashtag
    ['Video 1', 'Video 2'].forEach((title) => {
      cy.visit('/videos/new');
      cy.get('input[name="title"]').type(title);
      cy.get('input[aria-label="Seconds"]').clear().type('45');
      cy.get('select[name="status"]').select('PUBLISHED');
      cy.get('input[name="postDate"]').type('2026-01-27');
      cy.get('input[placeholder*="hashtag"]').type('testhashtag{enter}');
      cy.contains('button', 'Create Video').click();
    });

    // Visit hashtags page
    cy.visit('/hashtags');

    // Should show testhashtag with usage count
    cy.contains('testhashtag');
    cy.contains('2'); // Used 2 times
  });

  it('should view hashtag detail page', () => {
    // Create a published video with analytics
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Hashtag Detail Test');
    cy.get('input[name="videoLengthSeconds"]').clear().type('60');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.get('input[placeholder*="hashtag"]').type('detailtest{enter}');
    cy.contains('button', 'Create Video').click();

    // Go to hashtags page and click on the tag
    cy.visit('/hashtags');
    cy.contains('a', 'detailtest').click();

    // Should show all videos with this hashtag
    cy.contains('Hashtag Detail Test');
  });

  it('should handle hashtag case normalization', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Case Test Video');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');

    // Add hashtag with mixed case
    cy.get('input[placeholder*="hashtag"]').type('TestTag{enter}');

    cy.contains('button', 'Create Video').click();

    // Should be normalized to lowercase
    cy.contains('#testtag');
  });
});
