# Type System Architecture

## Overview

This codebase uses a carefully designed type system to ensure compatibility between Prisma, server components, and client components in Next.js.

## Files

### `/lib/constants.ts`
Plain JavaScript constants that can be imported anywhere (client or server components).
- `VideoStatus` - Video status enum values
- `SnapshotType` - Snapshot type enum values

These are plain objects with `as const`, making them type-safe without requiring Prisma runtime.

### `/lib/types/prisma.ts`
Type-only exports for use in client components. 
- Uses `import type` to avoid bundling Prisma runtime
- Exports type aliases for VideoStatus and SnapshotType that match Prisma's types
- Safe for client components

### `/lib/types/server.ts`
Server-only exports that include Prisma runtime.
- Exports actual Prisma enums and PrismaClient
- Should only be imported in Server Components, Server Actions, and API routes
- Exports both types and runtime values

## Usage Guidelines

### Client Components
```typescript
// ✅ Correct - use constants for values
import { VideoStatus, SnapshotType } from '@/lib/constants';

// ✅ Correct - use type-only imports for types
import type { Video, AnalyticsSnapshot } from '@/lib/types/prisma';

// ❌ Wrong - don't import from generated client
import { VideoStatus } from '@/lib/generated/client';
```

### Server Components / Server Actions
```typescript
// ✅ Correct - use server types
import { VideoStatus, SnapshotType } from '@/lib/types/server';
import type { Video, Prisma } from '@/lib/types/server';

// ✅ Also correct - can import directly from generated client
import { VideoStatus } from '@/lib/generated/client';
```

### Why This Approach?

1. **No `as any` casts needed** - Types are properly aligned between Prisma and our constants
2. **Client bundle optimization** - Client components don't bundle Prisma runtime
3. **Type safety** - TypeScript ensures values match Prisma's schema
4. **No enum redeclaration** - We use Prisma's actual enums in server code, plain objects in client code

## Turbopack Warning

You may see this warning during build:
```
unexpected export *
export * used with module [project]/lib/generated/client/index.js
```

**This is expected and safe.** It's a Turbopack optimization hint, not an error. The warning occurs because:
- Prisma generates a CommonJS module
- Some server code uses `export *` from it
- Turbopack suggests explicit exports for better optimization

Since this only affects server-side code (which doesn't need aggressive bundling), the warning can be safely ignored.
