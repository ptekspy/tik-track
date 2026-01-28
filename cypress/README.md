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

## Prerequisites

Before running E2E tests:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Ensure database is running and migrations are applied:
   ```bash
   pnpm db:push
   ```

## Writing Tests

- Follow the existing test patterns
- Use `data-testid` attributes for stable selectors
- Reset state between tests when needed
- Focus on user workflows, not implementation details

## Configuration

Cypress configuration is in `cypress.config.ts`:
- Base URL: http://localhost:3000
- Viewport: 1280x720
- Spec pattern: `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`

## CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
- name: Run E2E tests
  run: |
    pnpm dev &
    pnpm test:e2e
```
