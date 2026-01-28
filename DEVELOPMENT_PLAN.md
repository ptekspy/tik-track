# TikTok Analytics Tracker - Development Plan

## Overview

Manual TikTok video analytics tracking system with PostgreSQL, Prisma 6 + Accelerate, Next.js 16 App Router, TypeScript, Tailwind CSS v4.

**Architecture**: DAL → Services → Server Actions  
**Testing**: Vitest with static mocks  
**Validation**: Centralized Zod schemas in services  
**Types**: Prisma-inferred, organized by model

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Dependencies
- [x] Install production dependencies: `pnpm add prisma@^6 @prisma/client@^6 @prisma/extension-accelerate recharts react-hook-form zod date-fns lucide-react`
- [x] Install dev dependencies: `pnpm add -D @types/node vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom`
- [x] Update `package.json` scripts: `db:push`, `db:generate`, `db:studio`, `test`, `test:watch`, `test:coverage`

### 1.2 Configuration Files
- [x] Create `vitest.config.ts` with React plugin and path aliases (`@/*`)
- [x] Verify Tailwind CSS v4 configuration in `postcss.config.mjs`
- [x] Verify TypeScript paths in `tsconfig.json` match vitest config

### 1.3 Testing Infrastructure
- [x] Create `lib/testing/mocks.ts` with static mock objects:
  - [x] `mockVideo` (DRAFT, PUBLISHED, ARCHIVED variants)
  - [x] `mockSnapshot` (for each SnapshotType)
  - [x] `mockHashtag`
  - [x] `mockVideoWithSnapshots`
  - [x] `mockHashtagWithVideos`

---

## Phase 2: Database & DAL Layer

### 2.1 Prisma Setup
- [x] Run `pnpm prisma init` (if not already done)
- [x] Configure `prisma/schema.prisma`:
  - [x] PostgreSQL datasource with DATABASE_URL
  - [x] Prisma Accelerate extension configuration
  - [x] Generator client with custom output `../lib/generated/client`

### 2.2 Database Models
- [x] Define `Video` model:
  - [x] id (UUID, @id @default(uuid()))
  - [x] title (String)
  - [x] script (Text)
  - [x] description (Text)
  - [x] videoLengthSeconds (Int)
  - [x] postDate (DateTime?, nullable)
  - [x] status (Enum: DRAFT | PUBLISHED | ARCHIVED, default DRAFT)
  - [x] createdAt, updatedAt (DateTime @default(now()), @updatedAt)
  - [x] Relations: snapshots[], hashtags[]

- [x] Define `AnalyticsSnapshot` model:
  - [x] id (UUID)
  - [x] videoId (UUID, relation to Video)
  - [x] recordedAt (DateTime @default(now()))
  - [x] snapshotType (Enum: ONE_HOUR | THREE_HOUR | SIX_HOUR | TWELVE_HOUR | ONE_DAY | TWO_DAY | SEVEN_DAY | FOURTEEN_DAY | THIRTY_DAY)
  - [x] views (Int?, nullable)
  - [x] totalPlayTimeSeconds (Int?, nullable)
  - [x] avgWatchTimeSeconds (Int?, nullable)
  - [x] completionRate (Decimal?, nullable)
  - [x] newFollowers (Int?, nullable)
  - [x] likes (Int?, nullable)
  - [x] comments (Int?, nullable)
  - [x] shares (Int?, nullable)
  - [x] favorites (Int?, nullable)
  - [x] profileViews (Int?, nullable)
  - [x] reach (Int?, nullable)
  - [x] @@unique([videoId, snapshotType])

- [x] Define `Hashtag` model:
  - [x] id (UUID)
  - [x] tag (String @unique, lowercase)
  - [x] createdAt (DateTime)
  - [x] Relations: videos[]

- [x] Define `VideoHashtag` junction model:
  - [x] videoId (UUID)
  - [x] hashtagId (UUID)
  - [x] position (Int)
  - [x] @@id([videoId, hashtagId])

- [x] Run `pnpm db:push`
- [x] Run `pnpm db:generate`

### 2.3 Type Definitions (Prisma-inferred)
- [x] Create `lib/types/video.ts`:
  - [x] Export Video type from Prisma
  - [x] Export VideoWithSnapshots using Prisma.VideoGetPayload with include
  - [x] Export VideoWithHashtags
  - [x] Export VideoWithAll (snapshots + hashtags)

- [x] Create `lib/types/snapshot.ts`:
  - [x] Export AnalyticsSnapshot type from Prisma
  - [x] Export SnapshotWithVideo
  - [x] Export SnapshotType enum

- [x] Create `lib/types/hashtag.ts`:
  - [x] Export Hashtag type from Prisma
  - [x] Export HashtagWithVideos

- [x] Create `lib/types/metrics.ts`:
  - [x] Define EngagementMetrics type
  - [x] Define SignalResult type (positive | negative | neutral)
  - [x] Define CalculatedMetrics type

### 2.4 Database Client
- [x] Create `lib/database/client.ts`:
  - [x] Export singleton PrismaClient with Accelerate extension
  - [x] Export named `db` instance
  - [x] Add proper connection lifecycle management

### 2.5 DAL - Videos
- [x] Create `lib/dal/videos.ts`:
  - [x] Export `findVideoById(id: string)`
  - [x] Export `findAllVideos()`
  - [x] Export `findVideosByStatus(status: VideoStatus)`
  - [x] Export `createVideo(data: CreateVideoData)`
  - [x] Export `updateVideo(id: string, data: UpdateVideoData)`
  - [x] Export `deleteVideo(id: string)`
- [x] Create `lib/dal/videos.test.ts` with mocked Prisma client

### 2.6 DAL - Snapshots
- [x] Create `lib/dal/snapshots.ts`:
  - [x] Export `findSnapshotById(id: string)`
  - [x] Export `findSnapshotsByVideoId(videoId: string)`
  - [x] Export `findSnapshotByVideoAndType(videoId: string, type: SnapshotType)`
  - [x] Export `createSnapshot(data: CreateSnapshotData)`
  - [x] Export `updateSnapshot(id: string, data: UpdateSnapshotData)`
  - [x] Export `deleteSnapshot(id: string)`
- [x] Create `lib/dal/snapshots.test.ts`

### 2.7 DAL - Hashtags
- [x] Create `lib/dal/hashtags.ts`:
  - [x] Export `findHashtagByTag(tag: string)`
  - [x] Export `findOrCreateHashtag(tag: string)`
  - [x] Export `findAllHashtags()`
  - [x] Export `findHashtagWithVideos(tag: string)`
  - [x] Export `deleteHashtag(id: string)`
  - [x] Export `linkHashtagToVideo(hashtagId, videoId, position)`
  - [x] Export `unlinkHashtagFromVideo(hashtagId, videoId)`
  - [x] Export `updateVideoHashtagPositions(videoId, hashtags[])`
- [x] Create `lib/dal/hashtags.test.ts`

---

## Phase 3: Service Layer & Utilities

### 3.1 Centralized Schemas
- [x] Create `lib/schemas/video.ts`:
  - [x] Export `createVideoSchema` (zod)
  - [x] Export `updateVideoSchema` (zod)
  - [x] Export `updateVideoStatusSchema` (zod, with forward-only validation)
  - [x] Export inferred types using `z.infer`

- [x] Create `lib/schemas/snapshot.ts`:
  - [x] Export `createSnapshotSchema` (zod)
  - [x] Export `updateSnapshotSchema` (zod)
  - [x] Export inferred types

- [x] Create `lib/schemas/hashtag.ts`:
  - [x] Export `hashtagSchema` (zod, lowercase validation)
  - [x] Export `hashtagArraySchema` (zod)
  - [x] Export inferred types

### 3.2 Metric Calculations
- [x] Create `lib/metrics/calculateEngagementRate.ts`:
  - [x] Export `calculateEngagementRate(snapshot: AnalyticsSnapshot): number | null`
  - [x] Formula: (likes + comments + shares) / views × 100
- [x] Create `lib/metrics/calculateEngagementRate.test.ts`

- [x] Create `lib/metrics/calculateShareRate.ts`:
  - [x] Export `calculateShareRate(snapshot: AnalyticsSnapshot): number | null`
  - [x] Formula: shares / views × 100
- [x] Create `lib/metrics/calculateShareRate.test.ts`

- [x] Create `lib/metrics/calculateRetentionRate.ts`:
  - [x] Export `calculateRetentionRate(avgWatchTimeSeconds: number, videoLengthSeconds: number): number | null`
  - [x] Formula: avgWatchTime / videoLength × 100
- [x] Create `lib/metrics/calculateRetentionRate.test.ts`

- [x] Create `lib/metrics/calculateFollowerConversion.ts`:
  - [x] Export `calculateFollowerConversion(snapshot: AnalyticsSnapshot): number | null`
  - [x] Formula: newFollowers / views × 100
- [x] Create `lib/metrics/calculateFollowerConversion.test.ts`

- [x] Create `lib/metrics/detectSignals.ts`:
  - [x] Export `detectSignals(metrics: SignalMetrics): SignalResult`
  - [x] Positive: completionRate >50% OR shareRate >3% OR followerConversion >0.5%
  - [x] Negative: completionRate <20% OR engagementRate <1%
  - [x] Neutral: otherwise
- [x] Create `lib/metrics/detectSignals.test.ts`

### 3.3 Time Formatting Utilities
- [x] Create `lib/utils/formatSecondsToTime.ts`:
  - [x] Export `formatSecondsToTime(seconds: number): string`
  - [x] Format: "0h:18m:56s" or "4.3s"
- [x] Create `lib/utils/formatSecondsToTime.test.ts`

- [x] Create `lib/utils/parseTimeToSeconds.ts`:
  - [x] Export `parseTimeToSeconds(hours: number, minutes: number, seconds: number): number`
- [x] Create `lib/utils/parseTimeToSeconds.test.ts`

### 3.4 Snapshot Helpers
- [x] Create `lib/snapshots/getExpectedSnapshots.ts`:
  - [x] Export `getExpectedSnapshots(postDate: Date): SnapshotType[]`
  - [x] Return expected snapshots based on time elapsed
- [x] Create `lib/snapshots/getExpectedSnapshots.test.ts`

- [x] Create `lib/snapshots/getMissedSnapshots.ts`:
  - [x] Export `getMissedSnapshots(postDate: Date, existingTypes: SnapshotType[]): SnapshotType[]`
  - [x] Compare expected vs existing
- [x] Create `lib/snapshots/getMissedSnapshots.test.ts`

- [x] Create `lib/snapshots/getNextSuggestedSnapshot.ts`:
  - [x] Export `getNextSuggestedSnapshot(postDate: Date, existingTypes: SnapshotType[]): SnapshotType | null`
- [x] Create `lib/snapshots/getNextSuggestedSnapshot.test.ts`

### 3.5 Video Services
- [x] Create `lib/services/createVideo.ts`:
  - [x] Export `createVideo(input: unknown)`
  - [x] Validate with `createVideoSchema.parse(input)`
  - [x] Use Prisma transaction to create video + hashtags
  - [x] Return created video
- [x] Create `lib/services/createVideo.test.ts`

- [x] Create `lib/services/updateVideoStatus.ts`:
  - [x] Export `updateVideoStatus(videoId: string, newStatus: VideoStatus)`
  - [x] Validate forward-only transitions (DRAFT→PUBLISHED→ARCHIVED)
  - [x] Throw error if invalid transition
- [x] Create `lib/services/updateVideoStatus.test.ts`

- [x] Create `lib/services/getVideoWithAnalytics.ts`:
  - [x] Export `getVideoWithAnalytics(videoId: string)`
  - [x] Fetch video with snapshots
  - [x] Calculate all metrics for each snapshot (engagement, share, retention, follower conversion)
  - [x] Detect signals (positive/negative/neutral)
  - [x] Return enriched data
- [x] Create `lib/services/getVideoWithAnalytics.test.ts`

- [x] Create `lib/services/updateVideo.ts`:
  - [x] Export `updateVideo(videoId: string, input: unknown)`
  - [x] Validate with `updateVideoSchema.parse(input)`
  - [x] Update video metadata (title, script, description, videoLength)
  - [x] Handle hashtag updates (remove old, add new)
  - [x] Use transaction for atomic updates
  - [x] Return updated video
- [x] Create `lib/services/updateVideo.test.ts`

- [x] Create `lib/services/deleteVideo.ts`:
  - [x] Export `deleteVideo(videoId: string)`
  - [x] Handle cascade deletion (snapshots, video-hashtag relations)
- [x] Create `lib/services/deleteVideo.test.ts`

### 3.6 Snapshot Services
- [x] Create `lib/services/createSnapshot.ts`:
  - [x] Export `createSnapshot(input: unknown)`
  - [x] Validate with schema
  - [x] Check video status is PUBLISHED
  - [x] Check snapshot type not already exists for video
  - [x] Create snapshot
- [x] Create `lib/services/createSnapshot.test.ts`

- [x] Create `lib/services/deleteSnapshot.ts`:
  - [x] Export `deleteSnapshot(snapshotId: string)`
  - [x] Delete snapshot by ID
- [x] Create `lib/services/deleteSnapshot.test.ts`

### 3.7 Hashtag Services
- [x] Create `lib/services/getHashtagStats.ts`:
  - [x] Export `getHashtagStats(tag: string)`
  - [x] Aggregate metrics across all PUBLISHED videos with tag
  - [x] Calculate avg engagement, views, completion rate
- [x] Create `lib/services/getHashtagStats.test.ts`

- [x] Create `lib/services/getAllHashtagsWithStats.ts`:
  - [x] Export `getAllHashtagsWithStats()`
  - [x] Return all hashtags with usage counts and avg metrics
- [x] Create `lib/services/getAllHashtagsWithStats.test.ts`

- [x] Create `lib/services/mergeHashtags.ts`:
  - [x] Export `mergeHashtags(sourceTag: string, targetTag: string)`
  - [x] Use transaction to update VideoHashtag relations
- [x] Create `lib/services/mergeHashtags.test.ts`

---

## Phase 4: UI Components

### 4.1 Form Input Components
- [x] Create `components/TimeInput/TimeInput.tsx`:
  - [x] Client Component with separate hours, minutes, seconds inputs
  - [x] Export named `TimeInput`
  - [x] Props: `value?: number`, `onChange: (seconds: number) => void`
  - [x] Convert between seconds and h/m/s display
- [x] Create `components/TimeInput/TimeInput.test.tsx`

- [x] Create `components/PercentageInput/PercentageInput.tsx`:
  - [x] Client Component
  - [x] Export named `PercentageInput`
  - [x] Props: `value?: number` (decimal), `onChange: (decimal: number) => void`
  - [x] Display as percentage (10.55%), store as decimal (0.1055)
- [x] Create `components/PercentageInput/PercentageInput.test.tsx`

- [x] Create `components/HashtagInput/HashtagInput.tsx`:
  - [x] Client Component with chip-based UI
  - [x] Export named `HashtagInput`
  - [x] Props: `value: string[]`, `onChange: (tags: string[]) => void`
  - [x] Add/remove tags, enforce lowercase
- [x] Create `components/HashtagInput/HashtagInput.test.tsx`

- [x] Create `components/FormError/FormError.tsx`:
  - [x] Server Component for displaying validation errors
  - [x] Export named `FormError`
  - [x] Props: `error?: string | string[]`
- [x] Create `components/FormError/FormError.test.tsx`

### 4.2 Display Components
- [x] Create `components/MetricCard/MetricCard.tsx`:
  - [x] Server Component
  - [x] Export named `MetricCard`
  - [x] Props: `label`, `value`, `delta?`, `icon?`
  - [x] Display metric with optional up/down indicator
- [x] Create `components/MetricCard/MetricCard.test.tsx`

- [x] Create `components/SignalBadge/SignalBadge.tsx`:
  - [x] Server Component
  - [x] Export named `SignalBadge`
  - [x] Props: `signal: SignalResult`
  - [x] Green (positive), Red (negative), Gray (neutral)
- [x] Create `components/SignalBadge/SignalBadge.test.tsx`

- [x] Create `components/StatusBadge/StatusBadge.tsx`:
  - [x] Server Component
  - [x] Export named `StatusBadge`
  - [x] Props: `status: VideoStatus`
  - [x] Color-coded badges (gray=draft, green=published, blue=archived)
- [x] Create `components/StatusBadge/StatusBadge.test.tsx`

- [x] Create `components/SnapshotTimeline/SnapshotTimeline.tsx`:
  - [x] Server Component
  - [x] Export named `SnapshotTimeline`
  - [x] Props: `video: VideoWithSnapshots`
  - [x] Visual timeline showing completed/missed/upcoming snapshots
  - [x] Color-coded: green (completed), red (missed), gray (upcoming)
  - [x] Grace period logic: snapshots are "upcoming" within 2x their expected time
- [x] Create `components/SnapshotTimeline/SnapshotTimeline.test.tsx`

### 4.3 Form Components
- [x] Create `components/VideoForm/VideoForm.tsx`:
  - [x] Client Component using react-hook-form
  - [x] Export named `VideoForm`
  - [x] Props: `defaultValues?`, `onSubmit: (data) => Promise<void>`
  - [x] Sections: video details, optional first analytics, hashtags
  - [x] Use centralized schemas for validation
  - [x] Status selector (DRAFT by default)
  - [x] PostDate required if status=PUBLISHED
  - [x] Analytics section only enabled if status=PUBLISHED
- [x] Create `components/VideoForm/VideoForm.test.tsx`

- [x] Create `components/SnapshotForm/SnapshotForm.tsx`:
  - [x] Client Component using react-hook-form
  - [x] Export named `SnapshotForm`
  - [x] Props: `videoId`, `availableTypes: SnapshotType[]`, `defaultValues?`, `previousSnapshot?`, `onSubmit`
  - [x] Dropdown for snapshot type (only unused types)
  - [x] All analytics fields with TimeInput/PercentageInput
  - [x] Display delta from previous snapshot if available
- [x] Create `components/SnapshotForm/SnapshotForm.test.tsx`

### 4.4 Video Display Components
- [x] Create `components/VideoCard/VideoCard.tsx`:
  - [x] Server Component
  - [x] Export named `VideoCard`
  - [x] Props: `video: VideoWithSnapshots`
  - [x] Display: title, status badge, latest metrics, signal badge
  - [x] Link to video detail page
- [x] Create `components/VideoCard/VideoCard.test.tsx`

- [x] Create `components/VideoGrid/VideoGrid.tsx`:
  - [x] Server Component
  - [x] Export named `VideoGrid`
  - [x] Props: `videos: VideoWithSnapshots[]`
  - [x] Responsive grid layout using Tailwind
- [x] Create `components/VideoGrid/VideoGrid.test.tsx`

- [x] Create `components/VideoDetail/VideoDetail.tsx`:
  - [x] Client Component for interactive elements
  - [x] Export named `VideoDetail`
  - [x] Props: `video: VideoWithAll`, `calculatedMetrics`
  - [x] Display all video metadata
  - [x] Edit/delete actions
- [x] Create `components/VideoDetail/VideoDetail.test.tsx`

- [x] Create `components/VideoCharts/VideoCharts.tsx`:
  - [x] Client Component using Recharts
  - [x] Export named `VideoCharts`
  - [x] Props: `snapshots: AnalyticsSnapshot[]`
  - [x] Line charts: views over time, engagement rate
  - [x] Bar charts: likes, shares, comments
- [x] Create `components/VideoCharts/VideoCharts.test.tsx`

- [x] Create `lib/utils/dateUtils.ts`:
  - [x] Export `formatDate`, `formatDateTime`, `formatRelativeTime`
- [x] Create `lib/utils/dateUtils.test.ts`

- [x] Create `components/SnapshotTable/SnapshotTable.tsx`:
  - [x] Server Component
  - [x] Export named `SnapshotTable`
  - [x] Props: `snapshots: AnalyticsSnapshot[]`
  - [x] Table with all metrics, sortable columns
  - [x] Show deltas compared to previous snapshot
  - [x] Actions: delete (snapshots are immutable, no edit)
- [x] Create `components/SnapshotTable/SnapshotTable.test.tsx`

### 4.5 Hashtag Display Components
- [x] Create `components/HashtagList/HashtagList.tsx`:
  - [x] Server Component
  - [x] Export named `HashtagList`
  - [x] Props: `hashtags: HashtagWithStats[]`
  - [x] Table: tag, usage count, avg metrics
  - [x] Sort/filter controls
  - [x] Link to hashtag detail page
- [x] Create `components/HashtagList/HashtagList.test.tsx`

- [x] Create `components/HashtagActions/HashtagActions.tsx`:
  - [x] Client Component for bulk actions
  - [x] Export named `HashtagActions`
  - [x] Props: `hashtags: Hashtag[]`
  - [x] Merge similar tags, delete unused tags
- [x] Create `components/HashtagActions/HashtagActions.test.tsx`

- [x] Create `components/HashtagDetail/HashtagDetail.tsx`:
  - [x] Server Component
  - [x] Export named `HashtagDetail`
  - [x] Props: `hashtag: HashtagWithVideos`, `stats`
  - [x] Show all videos using hashtag
  - [x] Aggregate performance metrics
  - [x] Trend visualization
- [x] Create `components/HashtagDetail/HashtagDetail.test.tsx`

### 4.6 Navigation Components
- [x] Create `components/Navigation/Navigation.tsx`:
  - [x] Server Component
  - [x] Export named `Navigation`
  - [x] Fetch draft count for badge
  - [x] Render navigation structure
- [x] Create `components/Navigation/Navigation.test.tsx`

- [x] Create `components/Navigation/NavigationClient.tsx`:
  - [x] Client Component for interactivity
  - [x] Export named `NavigationClient`
  - [x] Props: `draftCount: number`
  - [x] Active route highlighting
  - [x] Links: Dashboard, New Video, Hashtags, Drafts
- [x] Create `components/Navigation/NavigationClient.test.tsx`

---

## Phase 5: Server Actions

### 5.1 Video Actions
- [x] Create `app/videos/actions.ts`:
  - [x] Export `createVideoAction(data: unknown)`
  - [x] Export `updateVideoAction(videoId: string, data: unknown)`
  - [x] Export `updateVideoStatusAction(videoId: string, newStatus: VideoStatus)`
  - [x] Export `deleteVideoAction(videoId: string)`
  - [x] All actions return `ActionResult<T>` with success/error/data
  - [x] Handle validation errors from services
  - [x] Revalidate paths on success
- [x] Create `app/videos/actions.test.ts`

### 5.2 Snapshot Actions
- [x] Create `app/videos/[id]/snapshots/actions.ts`:
  - [x] Export `createSnapshotAction(data: unknown)`
  - [x] Export `deleteSnapshotAction(snapshotId: string, videoId: string)`
  - [x] Handle errors (video not published, duplicate type)
  - [x] Return structured response
  - [x] Revalidate video page
- [x] Create `app/videos/[id]/snapshots/actions.test.ts`

### 5.3 Hashtag Actions
- [x] Create `app/hashtags/actions.ts`:
  - [x] Export `mergeHashtagsAction(sourceTag: string, targetTag: string)`
  - [x] Revalidate hashtag pages
  - [x] Return response
- [x] Create `app/hashtags/actions.test.ts`

---

## Phase 6: Pages & Views ✅

### 6.1 Root Pages
- [x] Update `app/page.tsx`:
  - [x] Redirect to `/dashboard`
  - [x] Server Component

- [x] Update `app/layout.tsx`:
  - [x] Import Navigation component
  - [x] Responsive layout with sidebar/header
  - [x] Tailwind v4 styling
  - [x] Metadata

### 6.2 Dashboard Pages
- [x] Create `app/dashboard/page.tsx`:
  - [x] Server Component
  - [x] Fetch all videos with latest snapshots
  - [x] Status filter tabs (all/draft/published/archived)
  - [x] Sort options (newest, oldest, most views, best engagement)
  - [x] Render VideoGrid component
  - [x] Display aggregate stats (total videos, total views, avg engagement)

- [x] Create `app/drafts/page.tsx`:
  - [x] Server Component
  - [x] Fetch videos with status=DRAFT
  - [x] Quick view/edit interface
  - [x] Call to action to publish

### 6.3 Video Pages
- [x] Create `app/videos/new/page.tsx`:
  - [x] Server Component
  - [x] Render VideoForm
  - [x] Handle form submission via createVideoAction
  - [x] Redirect on success

- [x] Create `app/videos/[id]/page.tsx`:
  - [x] Server Component
  - [x] Fetch video with `getVideoWithAnalytics` service
  - [x] Render VideoDetail component
  - [x] Render SnapshotTimeline
  - [x] Render VideoCharts (if snapshots exist)
  - [x] Render SnapshotTable
  - [x] Render hashtag chips with links
  - [x] Render calculated metrics cards
  - [x] "Add Snapshot" button linking to snapshot form

- [x] Create `app/videos/[id]/edit/page.tsx`:
  - [x] Server Component
  - [x] Fetch video with hashtags
  - [x] Render VideoForm with defaultValues
  - [x] Handle form submission via updateVideoAction
  - [x] Redirect to video detail on success

- [x] Create `app/videos/[id]/snapshots/new/page.tsx`:
  - [x] Server Component
  - [x] Fetch video and existing snapshots
  - [x] Calculate available snapshot types
  - [x] Get suggested next snapshot
  - [x] Fetch latest snapshot for pre-fill
  - [x] Render SnapshotForm
  - [x] Handle submission via createSnapshotAction
  - [x] Redirect to video page on success

### 6.4 Hashtag Pages
- [x] Create `app/hashtags/page.tsx`:
  - [x] Server Component
  - [x] Call `getAllHashtagsWithStats` service
  - [x] Render HashtagList component
  - [x] Render HashtagActions component
  - [x] Search/filter functionality

- [x] Create `app/hashtags/[tag]/page.tsx`:
  - [x] Server Component
  - [x] Decode tag from params
  - [x] Call `getHashtagStats` service
  - [x] Fetch videos with this hashtag (published only)
  - [x] Render HashtagDetail component
  - [x] Show aggregate metrics
  - [x] Show performance comparison across videos
  - [x] Trend charts

---

## Phase 7: Error Handling & Polish ✅

### 7.1 Error Boundaries
- [x] Create `app/error.tsx`:
  - [x] Client Component
  - [x] Props: `error`, `reset`
  - [x] Display friendly error message
  - [x] Reset button
  - [x] Log error to console (or error tracking service)

- [x] Create `app/videos/error.tsx`:
  - [x] Client Component
  - [x] Video-specific error handling
  - [x] Link back to dashboard

- [x] Create `app/hashtags/error.tsx`:
  - [x] Client Component
  - [x] Hashtag-specific errors

### 7.2 Loading States
- [x] Create `app/dashboard/loading.tsx`:
  - [x] Skeleton UI for dashboard

- [x] Create `app/videos/[id]/loading.tsx`:
  - [x] Skeleton UI for video detail

- [x] Create `app/hashtags/loading.tsx`:
  - [x] Skeleton UI for hashtag list

### 7.3 Not Found Pages
- [x] Create `app/videos/[id]/not-found.tsx`:
  - [x] Display when video not found
  - [x] Link to dashboard

- [x] Create `app/hashtags/[tag]/not-found.tsx`:
  - [x] Display when hashtag not found
  - [x] Link to hashtags page

---

## Phase 8: Testing & Validation

### 8.1 Run All Tests
- [x] Run `pnpm test` and verify all tests pass
- [x] Check test coverage with `pnpm test:coverage`
- [x] Ensure minimum 80% coverage on services and utilities

### 8.2 E2E Testing with Cypress ✅
- [x] Install Cypress and @testing-library/cypress
- [x] Configure Cypress (cypress.config.ts)
- [x] Set up test structure and support files
- [x] Create E2E tests for core workflows:
  - [x] Video management (create draft, edit, publish)
  - [x] Snapshot management (add 1h, 3h, 6h, etc.)
  - [x] Analytics and metrics calculations
  - [x] Hashtag operations
  - [x] Status transitions (DRAFT→PUBLISHED→ARCHIVED)
  - [x] Delete operations with cascade
  - [x] Edge cases and validation
- [x] Add Cypress scripts to package.json

### 8.3 Edge Cases
- [x] Test with video length = 0 (retention rate calculation)
- [x] Test with snapshot views = 0 (avoid division by zero in metrics)
- [x] Test with null values in optional fields (all snapshot metrics)
- [x] Test with very large numbers (millions of views, hours of play time)
- [x] Test with special characters in hashtags
- [x] Test with very long video titles/scripts/descriptions
- [x] Test time input with edge values (0 seconds, very large values)
- [x] Test percentage input with values outside 0-100 range
- [x] Test creating video with PUBLISHED status but no postDate (should fail)
- [x] Test hashtag case-sensitivity (should normalize to lowercase)
- [x] Test position tracking when adding/removing hashtags

### 8.4 UI/UX Validation
- [ ] Verify responsive layout on mobile, tablet, desktop
- [ ] Verify Tailwind v4 classes render correctly
- [ ] Verify no inline styles present
- [ ] Verify accessibility (keyboard navigation, ARIA labels)
- [ ] Verify form validation messages are clear
- [ ] Verify error states display properly
- [ ] Verify loading states are smooth

---

## Phase 9: Documentation & Deployment Prep

### 9.1 Code Documentation
- [ ] Add JSDoc comments to all exported functions
- [ ] Document complex utility functions
- [ ] Add inline comments for non-obvious logic

### 9.2 README Updates
- [ ] Update README.md with:
  - [ ] Project overview
  - [ ] Setup instructions
  - [ ] Environment variables needed
  - [ ] Database setup steps
  - [ ] Running the app locally
  - [ ] Running tests
  - [ ] Architecture overview (DAL → Services → Actions)

### 9.3 Environment Variables
- [ ] Document all required env vars:
  - [ ] `DATABASE_URL` - PostgreSQL connection string with Accelerate
  - [ ] `DIRECT_URL` - Direct database URL (for migrations)
  - [ ] Add `.env.example` file

### 9.4 Deployment Checklist
- [ ] Verify build succeeds: `pnpm build`
- [ ] Verify no TypeScript errors
- [ ] Verify no ESLint errors: `pnpm lint`
- [ ] Verify database migrations are applied
- [ ] Set up Prisma Accelerate in production
- [ ] Configure production environment variables
- [ ] Test production build locally

---

## Future Enhancements (v2)

### Not in v1 Scope
- [ ] Authentication & user accounts
- [ ] PWA with push notifications for snapshot reminders
- [ ] Video comparison view (side-by-side)
- [ ] CSV export functionality
- [ ] Database seeding script
- [ ] Automatic data collection from TikTok API
- [ ] Mobile app
- [ ] Team collaboration features
- [ ] Advanced analytics (predictive models, trend forecasting)

---

## Notes

- **Architecture**: Strict DAL → Services → Server Actions pattern
- **Testing**: All functions must have co-located tests
- **Types**: Prisma-inferred only, no manual DB types
- **Validation**: Centralized Zod schemas in services
- **Styling**: Tailwind v4 only, no inline styles
- **Exports**: Named exports only (except page.tsx)
- **Components**: One component per file, Server Components by default
- **Transactions**: Services use Prisma native transactions when needed

---

## Progress Tracking

**Started**: January 27, 2026  
**Current Phase**: Phase 8 (Testing & Validation)  
**Phase 1**: ✅ Complete  
**Phase 2**: ✅ Complete  
**Phase 3**: ✅ Complete  
**Phase 4**: ✅ Complete  
**Phase 5**: ✅ Complete  
**Phase 6**: ✅ Complete  
**Phase 7**: ✅ Complete  
**Next**: Phase 8.1 (Run All Tests)

Update this document as you complete tasks by checking boxes with `[x]`.
