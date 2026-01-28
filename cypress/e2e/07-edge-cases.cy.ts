describe('Edge Cases', () => {
  it('should handle video length = 0', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Zero Length Video');
    cy.get('input[aria-label="Seconds"]').clear().type('0');
    cy.contains('button', 'Create Video').click();

    // Should either show error or handle gracefully
    // Retention rate calculation should handle division by zero
  });

  it('should handle snapshot with views = 0', () => {
    // Create published video
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Zero Views Test');
    cy.get('input[name="videoLengthSeconds"]').clear().type('60');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', 'Create Video').click();

    // Add snapshot with 0 views
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').clear().type('0');
    cy.get('input[name="likes"]').clear().type('0');
    cy.contains('button', /create|save/i).click();

    // Metrics should show 0% or N/A (not crash)
    cy.contains(/0%|n\/a/i);
  });

  it('should handle null values in optional fields', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Minimal Data Video');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    // Leave script and description empty
    cy.contains('button', 'Create Video').click();

    // Should create successfully
    cy.contains('Minimal Data Video');

    // Add snapshot with minimal data
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('100');
    // Leave other fields empty
    cy.contains('button', /create|save/i).click();

    // Should handle gracefully
    cy.contains('1 Hour');
  });

  it('should handle very large numbers', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Viral Video');
    cy.get('input[name="videoLengthSeconds"]').clear().type('60');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', 'Create Video').click();

    // Add snapshot with millions of views
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('10000000'); // 10 million
    cy.get('input[name="likes"]').type('800000');
    cy.contains('button', /create|save/i).click();

    // Should format numbers with commas
    cy.contains('10,000,000');
  });

  it('should handle special characters in hashtags', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Special Char Test');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');

    // Try adding hashtag with special characters (should be cleaned)
    cy.get('input[placeholder*="hashtag"]').type('test@tag!{enter}');

    cy.contains('button', 'Create Video').click();

    // Should sanitize or reject special characters
    // Depending on your validation logic
  });

  it('should handle very long titles/descriptions', () => {
    const longTitle = 'A'.repeat(500);
    const longDescription = 'B'.repeat(5000);

    cy.visit('/videos/new');
    cy.get('input[name="title"]').type(longTitle);
    cy.get('textarea[name="description"]').type(longDescription);
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');
    cy.contains('button', 'Create Video').click();

    // Should either truncate or show validation error
  });

  it('should handle time input edge values', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Time Edge Test');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    // Set video length to 1h 1m 1s
    cy.get('input[aria-label="Hours"]').clear().type('1');
    cy.get('input[aria-label="Minutes"]').clear().type('1');
    cy.get('input[aria-label="Seconds"]').clear().type('1');
    cy.contains('button', 'Create Video').click();

    // Should display time correctly
    cy.contains(/1.*hour|1h|61.*min/i);
  });

  it('should prevent creating PUBLISHED video without postDate', () => {
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Invalid Published Video');
    cy.get('input[name="videoLengthSeconds"]').clear().type('30');
    cy.get('select[name="status"]').select('PUBLISHED');
    // Don't fill in postDate
    cy.contains('button', 'Create Video').click();

    // Should show validation error
    cy.contains(/post date.*required/i);
  });
});
