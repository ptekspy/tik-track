# Cypress E2E Tests

## Running Tests

### Interactive Mode (Development)
```bash
pnpm cypress
# or
pnpm test:e2e:dev
```

### Headless Mode (CI)
```bash
pnpm cypress:headless
# or
pnpm test:e2e
```

## Test Structure

Tests are organized by feature area:

1. **01-video-management.cy.ts** - Create, edit, publish videos
2. **02-snapshot-management.cy.ts** - Add and manage snapshots
3. **03-analytics-metrics.cy.ts** - Verify calculations and charts
4. **04-hashtag-management.cy.ts** - Hashtag operations
5. **05-status-transitions.cy.ts** - Video status workflow
6. **06-delete-operations.cy.ts** - Cascade deletion
7. **07-edge-cases.cy.ts** - Edge cases and validation
8. **08-database-helpers.cy.ts** - Database helper examples

## Prerequisites

### Environment Variables

Configure test database in `.env`:
```env
TEST_PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

This must be a **separate database** from your development database to ensure test isolation.

### Before Running Tests

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Ensure test database is accessible (Cypress will handle migrations via helpers)

## Database Helpers

Cypress has custom commands for database management using the TEST database:

### `cy.cleanDb()`
Cleans all data from the test database. **Always call this in `beforeEach()`** to ensure test isolation.

```typescript
beforeEach(() => {
  cy.cleanDb();
});
```

### `cy.createTestVideo(data)`
Creates a test video with optional snapshots and hashtags. Returns the created video.

```typescript
cy.createTestVideo({
  title: 'My Test Video',
  status: 'PUBLISHED',
  postDate: new Date(),
  videoLengthSeconds: 90,
  hashtags: ['viral', 'trending'],
  snapshots: [
    {
      snapshotType: 'ONE_HOUR',
      views: 1000,
      likes: 50,
      comments: 20,
      shares: 10,
      favorites: 5,
      timeWatched: 60000,
    }
  ]
}).then((video) => {
  cy.visit(`/videos/${video.id}`);
});
```

### `cy.seedDb(data)`
Seeds the database with multiple records at once for complex test scenarios.

```typescript
cy.seedDb({
  videos: [
    { title: 'Video 1', status: 'PUBLISHED', postDate: new Date() },
    { title: 'Video 2', status: 'DRAFT', postDate: new Date() },
  ],
  hashtags: [
    { tag: 'viral', usageCount: 5 },
  ],
  snapshots: [
    // ... snapshot data
  ]
});
```

### `cy.getAllVideos()`
Retrieves all videos from the test database for verification.

```typescript
cy.getAllVideos().then((videos) => {
  expect(videos).to.have.length(3);
  expect(videos[0].title).to.equal('Expected Title');
});
```

## Writing Tests

### Best Practices

1. **Always clean database** in `beforeEach()` for test isolation
2. **Use database helpers** to set up test data instead of UI interactions
3. **Create realistic data** with proper dates and relationships
4. **Test user flows**, not implementation details
5. **Verify both UI and data** to ensure consistency

### Example Test Pattern

```typescript
describe('My Feature', () => {
  beforeEach(() => {
    cy.cleanDb(); // Start with clean database
  });

  it('should complete user workflow', () => {
    // Arrange: Create test data
    cy.createTestVideo({
      title: 'Test Video',
      status: 'PUBLISHED',
      postDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      hashtags: ['viral'],
    }).then((video) => {
      // Act: Navigate and interact
      cy.visit(`/videos/${video.id}`);
      cy.findByRole('button', { name: /add snapshot/i }).click();
      
      // Assert: Verify results
      cy.findByText('ONE_HOUR').should('exist');
      
      // Verify data layer
      cy.getAllVideos().then((videos) => {
        expect(videos[0].snapshots).to.have.length(1);
      });
    });
  });
});
```

### Using Testing Library Queries

The `@testing-library/cypress` library is available for better selectors:

```typescript
// Good - semantic queries
cy.findByRole('button', { name: /create video/i });
cy.findByLabelText('Video Title');
cy.findByText('Expected content');

// Avoid - implementation details
cy.get('.button-class');
cy.get('[data-testid="button"]');
```

## Configuration

Cypress configuration is in `cypress.config.ts`:
- Base URL: http://localhost:3000
- Test Database: Loaded from `TEST_PRISMA_DATABASE_URL` env var
- Viewport: 1280x720
- Spec pattern: `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`

## Debugging

- Use `cy.pause()` to pause test execution
- Add `.debug()` to any command to inspect it
- Check `cypress/screenshots` for failure screenshots
- Check `cypress/videos` for test recordings
- Use Chrome DevTools in interactive mode

## CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
- name: E2E Tests
  env:
    TEST_PRISMA_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  run: |
    pnpm dev &
    pnpm test:e2e
```
