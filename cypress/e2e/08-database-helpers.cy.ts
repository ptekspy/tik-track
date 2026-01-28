describe('Database Helpers Example', () => {
  beforeEach(() => {
    // Clean database before each test
    cy.cleanDb();
  });

  it('should use createTestVideo helper to set up test data', () => {
    // Create a published video with snapshots and hashtags
    const postDate = new Date();
    postDate.setDate(postDate.getDate() - 7); // 7 days ago

    cy.createTestVideo({
      title: 'Video with Full Analytics',
      status: 'PUBLISHED',
      postDate: postDate,
      videoLengthSeconds: 90,
      hashtags: ['viral', 'trending', 'foryou'],
      snapshots: [
        {
          snapshotType: 'ONE_HOUR',
          views: 1000,
          likes: 50,
          comments: 10,
          shares: 5,
          favorites: 20,
        },
        {
          snapshotType: 'ONE_DAY',
          views: 5000,
          likes: 250,
          comments: 50,
          shares: 25,
          favorites: 100,
        },
      ],
    }).then((video) => {
      // Visit the video page
      cy.visit(`/videos/${video.id}`);

      // Verify video details
      cy.findByText('Video with Full Analytics').should('exist');
      cy.findByText(/published/i).should('exist');

      // Verify snapshots metrics are displayed (may appear in multiple places like stats and charts)
      cy.findAllByText('1,000').should('have.length.at.least', 1); // Views at 1h
      cy.findAllByText('5,000').should('have.length.at.least', 1); // Views at 1 day
      cy.findAllByText('250').should('have.length.at.least', 1); // Likes
      cy.findAllByText('50').should('have.length.at.least', 1); // Comments
    });
  });

  it('should use seedDb to create multiple videos at once', () => {
    // Seed with multiple videos
    cy.seedDb({
      videos: [
        {
          id: '00000000-0000-0000-0000-000000000001',
          title: 'Draft Video 1',
          script: 'Script 1',
          description: 'Description 1',
          status: 'DRAFT',
          videoLengthSeconds: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          title: 'Published Video 1',
          script: 'Script 2',
          description: 'Description 2',
          status: 'PUBLISHED',
          postDate: new Date(),
          videoLengthSeconds: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    // Visit dashboard
    cy.visit('/dashboard');

    // Verify both videos appear
    cy.findByText('Draft Video 1').should('exist');
    cy.findByText('Published Video 1').should('exist');
  });

  it('should verify database is clean between tests', () => {
    // This test should start with empty database
    cy.getAllVideos().then((videos) => {
      expect(videos).to.have.length(0);
    });

    // Visit dashboard - should show no videos message or empty state
    cy.visit('/dashboard');
    cy.findByText(/total videos/i).should('exist');
    cy.contains('0').should('exist'); // Should show 0 videos
  });

  it('should create video with specific timing for snapshot testing', () => {
    // Create video posted 3 hours ago
    const postDate = new Date();
    postDate.setHours(postDate.getHours() - 3);

    cy.createTestVideo({
      title: 'Time-based Test Video',
      status: 'PUBLISHED',
      postDate: postDate,
      videoLengthSeconds: 60,
    }).then((video) => {
      cy.visit(`/videos/${video.id}`);

      // Verify video was created and has no snapshots yet
      cy.findByText('Time-based Test Video').should('exist');
      cy.findByText(/no snapshots recorded yet/i).should('exist');
    });
  });

  it('should test hashtag aggregation across multiple videos', () => {
    // Create multiple videos with the same hashtag
    cy.createTestVideo({
      title: 'Video 1 with #viral',
      status: 'PUBLISHED',
      postDate: new Date(),
      hashtags: ['viral', 'trending'],
    });

    cy.createTestVideo({
      title: 'Video 2 with #viral',
      status: 'PUBLISHED',
      postDate: new Date(),
      hashtags: ['viral', 'fyp'],
    });

    cy.createTestVideo({
      title: 'Video 3 with #viral',
      status: 'PUBLISHED',
      postDate: new Date(),
      hashtags: ['viral'],
    });

    // Visit hashtags page
    cy.visit('/hashtags');

    // Verify #viral exists and shows usage count of 3
    cy.get('table').within(() => {
      cy.contains('tr', 'viral').within(() => {
        cy.contains('3').should('exist'); // 3 videos use this hashtag
      });
    });
  });
});
