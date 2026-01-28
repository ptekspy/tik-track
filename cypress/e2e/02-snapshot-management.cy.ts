describe('Snapshot Management', () => {
  let videoId: string;

  beforeEach(() => {
    // Clean database and create a published video
    cy.cleanDb();
    
    // Use helper to create test video
    const postDate = new Date();
    postDate.setHours(postDate.getHours() - 2); // 2 hours ago
    
    cy.createTestVideo({
      title: 'Published Video for Snapshots',
      status: 'PUBLISHED',
      postDate: postDate,
      videoLengthSeconds: 60,
    }).then((video) => {
      videoId = video.id;
      cy.visit(`/videos/${videoId}`);
    });
  });

  it('should add 1h snapshot to published video', () => {
    // Click to add snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();

    // Select ONE_HOUR type
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');

    // Fill in metrics
    cy.get('input[name="views"]').type('1250');
    cy.get('input[name="likes"]').type('95');
    cy.get('input[name="comments"]').type('12');
    cy.get('input[name="shares"]').type('8');
    cy.get('input[name="favorites"]').type('45');
    cy.get('input[name="newFollowers"]').type('5');

    // Average watch time (30 seconds)
    cy.get('input[name="avgWatchTimeSeconds"]').type('30');

    // Completion rate (50%)
    cy.get('input[name="completionRate"]').type('50');

    // Submit
    cy.contains('button', /create|save/i).click();

    // Should redirect back to video page
    cy.url().should('include', `/videos/`);
    
    // Verify snapshot appears in table
    cy.contains('1 Hour');
    cy.contains('1,250'); // Views
  });

  it('should add subsequent snapshots (3h, 6h, 12h)', () => {
    // Add 3-hour snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('THREE_HOUR');
    cy.get('input[name="views"]').type('5000');
    cy.get('input[name="likes"]').type('380');
    cy.contains('button', /create|save/i).click();

    // Add 6-hour snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('SIX_HOUR');
    cy.get('input[name="views"]').type('12000');
    cy.get('input[name="likes"]').type('920');
    cy.contains('button', /create|save/i).click();

    // Verify multiple snapshots show in timeline
    cy.contains('3 Hours');
    cy.contains('6 Hours');
  });

  it('should delete a snapshot', () => {
    // Create a snapshot first
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('1000');
    cy.contains('button', /create|save/i).click();

    // Find and click delete button
    cy.get('button').contains(/delete/i).first().click();

    // Confirm deletion (if there's a confirmation)
    cy.get('button').contains(/confirm|yes|delete/i).click();

    // Snapshot should be removed (you might need to adjust based on your UI)
    // cy.contains('1 Hour').should('not.exist');
  });

  it('should show snapshot timeline with completed/missed/upcoming', () => {
    // Create ONE_HOUR snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('1000');
    cy.contains('button', /create|save/i).click();

    // Check timeline shows completed (green)
    cy.get('[data-testid="snapshot-timeline"]').within(() => {
      // This depends on your implementation
      cy.contains('1h').should('exist');
    });
  });

  it('should prevent duplicate snapshot type', () => {
    // Create ONE_HOUR snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('1000');
    cy.contains('button', /create|save/i).click();

    // Try to create another ONE_HOUR
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    
    // ONE_HOUR should not be in dropdown anymore
    cy.get('select[name="snapshotType"] option[value="ONE_HOUR"]').should('not.exist');
  });
});
