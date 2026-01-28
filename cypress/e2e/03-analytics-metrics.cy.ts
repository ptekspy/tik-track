describe('Analytics and Metrics', () => {
  beforeEach(() => {
    // Create a published video with snapshots
    cy.visit('/videos/new');
    cy.get('input[name="title"]').type('Analytics Test Video');
    cy.get('input[aria-label="Seconds"]').clear().type('60');
    cy.get('select[name="status"]').select('PUBLISHED');
    cy.get('input[name="postDate"]').type('2026-01-27');
    cy.contains('button', 'Create Video').click();
    
    // Add a snapshot with good metrics
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('ONE_HOUR');
    cy.get('input[name="views"]').type('10000');
    cy.get('input[name="likes"]').type('800'); // 8% engagement
    cy.get('input[name="comments"]').type('150');
    cy.get('input[name="shares"]').type('400'); // 4% share rate
    cy.get('input[name="favorites"]').type('300');
    cy.get('input[name="newFollowers"]').type('60'); // 0.6% follower conversion
    cy.get('input[name="avgWatchTimeSeconds"]').type('45'); // 75% retention
    cy.get('input[name="completionRate"]').type('75');
    cy.contains('button', /create|save/i).click();
  });

  it('should display calculated metrics correctly', () => {
    // Verify engagement rate calculation
    // (800 + 150 + 400) / 10000 * 100 = 13.5%
    cy.contains(/engagement.*13\.5/i);

    // Verify share rate
    // 400 / 10000 * 100 = 4%
    cy.contains(/share.*4/i);

    // Verify retention rate
    // 45 / 60 * 100 = 75%
    cy.contains(/retention.*75/i);

    // Verify follower conversion
    // 60 / 10000 * 100 = 0.6%
    cy.contains(/follower.*0\.6/i);
  });

  it('should show positive signal for good metrics', () => {
    // With 75% completion, 4% share rate, and 0.6% follower conversion
    // Signal should be positive
    cy.contains(/positive|good/i).should('exist');
  });

  it('should render charts with multiple snapshots', () => {
    // Add another snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('THREE_HOUR');
    cy.get('input[name="views"]').type('25000');
    cy.get('input[name="likes"]').type('1800');
    cy.contains('button', /create|save/i).click();

    // Check that charts are rendered
    cy.get('canvas, svg').should('exist'); // Recharts uses canvas or svg
  });

  it('should show deltas in snapshot table', () => {
    // Add second snapshot
    cy.contains('a', /create.*snapshot|add.*snapshot/i).click();
    cy.get('select[name="snapshotType"]').select('THREE_HOUR');
    cy.get('input[name="views"]').type('25000'); // +15000 from first
    cy.get('input[name="likes"]').type('2000'); // +1200 from first
    cy.contains('button', /create|save/i).click();

    // Should show increase indicators
    cy.contains('+15,000').should('exist'); // View delta
    cy.contains('+1,200').should('exist'); // Like delta
  });
});
