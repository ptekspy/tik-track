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
- [ ] Create `components/VideoForm/VideoForm.tsx`:
  - [ ] Client Component using react-hook-form
  - [ ] Export named `VideoForm`
  - [ ] Props: `defaultValues?`, `onSubmit: (data) => Promise<void>`
  - [ ] Sections: video details, optional first analytics, hashtags
  - [ ] Use centralized schemas for validation
  - [ ] Status selector (DRAFT by default)
  - [ ] PostDate required if status=PUBLISHED
  - [ ] Analytics section only enabled if status=PUBLISHED
- [ ] Create `components/VideoForm/VideoForm.test.tsx`

- [ ] Create `components/SnapshotForm/SnapshotForm.tsx`:
  - [ ] Client Component using react-hook-form
  - [ ] Export named `SnapshotForm`
  - [ ] Props: `videoId`, `availableTypes: SnapshotType[]`, `defaultValues?`, `onSubmit`
  - [ ] Dropdown for snapshot type (only unused types)
  - [ ] All analytics fields with TimeInput/PercentageInput
  - [ ] Display delta from previous snapshot if available
- [ ] Create `components/SnapshotForm/SnapshotForm.test.tsx`

### 4.4 Video Display Components
- [ ] Create `components/VideoCard/VideoCard.tsx`:
  - [ ] Server Component
  - [ ] Export named `VideoCard`
  - [ ] Props: `video: VideoWithSnapshots`
  - [ ] Display: title, status badge, latest metrics, signal badge
  - [ ] Link to video detail page
- [ ] Create `components/VideoCard/VideoCard.test.tsx`

- [ ] Create `components/VideoGrid/VideoGrid.tsx`:
  - [ ] Server Component
  - [ ] Export named `VideoGrid`
  - [ ] Props: `videos: VideoWithSnapshots[]`
  - [ ] Responsive grid layout using Tailwind
- [ ] Create `components/VideoGrid/VideoGrid.test.tsx`

- [ ] Create `components/VideoDetail/VideoDetail.tsx`:
  - [ ] Client Component for interactive elements
  - [ ] Export named `VideoDetail`
  - [ ] Props: `video: VideoWithAll`, `calculatedMetrics`
  - [ ] Display all video metadata
  - [ ] Status change dropdown (forward-only)
  - [ ] Edit/delete actions
- [ ] Create `components/VideoDetail/VideoDetail.test.tsx`

- [ ] Create `components/VideoCharts/VideoCharts.tsx`:
  - [ ] Client Component using Recharts
  - [ ] Export named `VideoCharts`
  - [ ] Props: `snapshots: AnalyticsSnapshot[]`, `videoLength: number`
  - [ ] Line charts: views over time, engagement rate, completion rate, retention rate
  - [ ] X-axis: snapshot types, Y-axis: metric values
- [ ] Create `components/VideoCharts/VideoCharts.test.tsx`

- [ ] Create `components/SnapshotTable/SnapshotTable.tsx`:
  - [ ] Server Component
  - [ ] Export named `SnapshotTable`
  - [ ] Props: `snapshots: AnalyticsSnapshot[]`
  - [ ] Table with all metrics, sortable columns
  - [ ] Show deltas compared to previous snapshot
  - [ ] Actions: delete (snapshots are immutable, no edit)
- [ ] Create `components/SnapshotTable/SnapshotTable.test.tsx`

### 4.5 Hashtag Display Components
- [ ] Create `components/HashtagList/HashtagList.tsx`:
  - [ ] Server Component
  - [ ] Export named `HashtagList`
  - [ ] Props: `hashtags: HashtagWithStats[]`
  - [ ] Table: tag, usage count, avg metrics
  - [ ] Sort/filter controls
  - [ ] Link to hashtag detail page
- [ ] Create `components/HashtagList/HashtagList.test.tsx`

- [ ] Create `components/HashtagActions/HashtagActions.tsx`:
  - [ ] Client Component for bulk actions
  - [ ] Export named `HashtagActions`
  - [ ] Props: `hashtags: Hashtag[]`
  - [ ] Merge similar tags, delete unused tags
- [ ] Create `components/HashtagActions/HashtagActions.test.tsx`

- [ ] Create `components/HashtagDetail/HashtagDetail.tsx`:
  - [ ] Server Component
  - [ ] Export named `HashtagDetail`
  - [ ] Props: `hashtag: HashtagWithVideos`, `stats`
  - [ ] Show all videos using hashtag
  - [ ] Aggregate performance metrics
  - [ ] Trend visualization
- [ ] Create `components/HashtagDetail/HashtagDetail.test.tsx`

### 4.6 Navigation Components
- [ ] Create `components/Navigation/Navigation.tsx`:
  - [ ] Server Component
  - [ ] Export named `Navigation`
  - [ ] Fetch draft count for badge
  - [ ] Render navigation structure
- [ ] Create `components/Navigation/Navigation.test.tsx`

- [ ] Create `components/Navigation/NavigationClient.tsx`:
  - [ ] Client Component for interactivity
  - [ ] Export named `NavigationClient`
  - [ ] Props: `draftCount: number`
  - [ ] Active route highlighting
  - [ ] Links: Dashboard, New Video, Hashtags, Drafts
- [ ] Create `components/Navigation/NavigationClient.test.tsx`

---

## Phase 5: Server Actions

### 5.1 Video Actions
- [ ] Create `app/videos/actions.ts`:
  - [ ] Export `createVideoAction(formData: FormData)` or `(data: unknown)`
  - [ ] Call `createVideo` service in try/catch
  - [ ] Return `{ success: boolean, error?: string, data?: Video }`
  - [ ] Handle validation errors from service
  - [ ] Revalidate paths on success

  - [ ] Export `updateVideoAction(videoId: string, data: unknown)`
  - [ ] Call `updateVideo` service in try/catch
  - [ ] Return structured response
  - [ ] Revalidate video page
  - [ ] Handle validation errors

  - [ ] Export `updateVideoStatusAction(videoId: string, newStatus: VideoStatus)`
  - [ ] Call `updateVideoStatus` service
  - [ ] Return structured response
  - [ ] Revalidate video page

  - [ ] Export `deleteVideoAction(videoId: string)`
  - [ ] Call `deleteVideo` service
  - [ ] Revalidate dashboard
  - [ ] Return response

- [ ] Create `app/videos/actions.test.ts` mocking services

### 5.2 Snapshot Actions
- [ ] Create `app/videos/[id]/snapshots/actions.ts`:
  - [ ] Export `createSnapshotAction(data: unknown)`
  - [ ] Call `createSnapshot` service
  - [ ] Handle errors (video not published, duplicate type)
  - [ ] Return structured response
  - [ ] Revalidate video page

  - [ ] Export `deleteSnapshotAction(snapshotId: string)`
  - [ ] Call `deleteSnapshot` service
  - [ ] Revalidate video page
  - [ ] Return response

- [ ] Create `app/videos/[id]/snapshots/actions.test.ts`

### 5.3 Hashtag Actions
- [ ] Create `app/hashtags/actions.ts`:
  - [ ] Export `mergeHashtagsAction(sourceTag: string, targetTag: string)`
  - [ ] Call `mergeHashtags` service
  - [ ] Revalidate hashtag pages
  - [ ] Return response

  - [ ] Export `deleteHashtagAction(tag: string)`
  - [ ] Call service
  - [ ] Revalidate hashtag list
  - [ ] Return response

- [ ] Create `app/hashtags/actions.test.ts`

---

## Phase 6: Pages & Views

### 6.1 Root Pages
- [ ] Update `app/page.tsx`:
  - [ ] Redirect to `/dashboard`
  - [ ] Server Component

- [ ] Update `app/layout.tsx`:
  - [ ] Import Navigation component
  - [ ] Responsive layout with sidebar/header
  - [ ] Tailwind v4 styling
  - [ ] Metadata

### 6.2 Dashboard Pages
- [ ] Create `app/dashboard/page.tsx`:
  - [ ] Server Component
  - [ ] Fetch all videos with latest snapshots
  - [ ] Status filter tabs (all/draft/published/archived)
  - [ ] Sort options (newest, oldest, most views, best engagement)
  - [ ] Render VideoGrid component
  - [ ] Display aggregate stats (total videos, total views, avg engagement)

- [ ] Create `app/drafts/page.tsx`:
  - [ ] Server Component
  - [ ] Fetch videos with status=DRAFT
  - [ ] Quick view/edit interface
  - [ ] Call to action to publish

### 6.3 Video Pages
- [ ] Create `app/videos/new/page.tsx`:
  - [ ] Server Component
  - [ ] Render VideoForm
  - [ ] Handle form submission via createVideoAction
  - [ ] Redirect on success

- [ ] Create `app/videos/[id]/page.tsx`:
  - [ ] Server Component
  - [ ] Fetch video with `getVideoWithAnalytics` service
  - [ ] Render VideoDetail component
  - [ ] Render SnapshotTimeline
  - [ ] Render VideoCharts (if snapshots exist)
  - [ ] Render SnapshotTable
  - [ ] Render hashtag chips with links
  - [ ] Render calculated metrics cards
  - [ ] "Add Snapshot" button linking to snapshot form

- [ ] Create `app/videos/[id]/edit/page.tsx`:
  - [ ] Server Component
  - [ ] Fetch video with hashtags
  - [ ] Render VideoForm with defaultValues
  - [ ] Handle form submission via updateVideoAction
  - [ ] Redirect to video detail on success

- [ ] Create `app/videos/[id]/snapshots/new/page.tsx`:
  - [ ] Server Component
  - [ ] Fetch video and existing snapshots
  - [ ] Calculate available snapshot types
  - [ ] Get suggested next snapshot
  - [ ] Fetch latest snapshot for pre-fill
  - [ ] Render SnapshotForm
  - [ ] Handle submission via createSnapshotAction
  - [ ] Redirect to video page on success

### 6.4 Hashtag Pages
- [ ] Create `app/hashtags/page.tsx`:
  - [ ] Server Component
  - [ ] Call `getAllHashtagsWithStats` service
  - [ ] Render HashtagList component
  - [ ] Render HashtagActions component
  - [ ] Search/filter functionality

- [ ] Create `app/hashtags/[tag]/page.tsx`:
  - [ ] Server Component
  - [ ] Decode tag from params
  - [ ] Call `getHashtagStats` service
  - [ ] Fetch videos with this hashtag (published only)
  - [ ] Render HashtagDetail component
  - [ ] Show aggregate metrics
  - [ ] Show performance comparison across videos
  - [ ] Trend charts

---

## Phase 7: Error Handling & Polish

### 7.1 Error Boundaries
- [ ] Create `app/error.tsx`:
  - [ ] Client Component
  - [ ] Props: `error`, `reset`
  - [ ] Display friendly error message
  - [ ] Reset button
  - [ ] Log error to console (or error tracking service)

- [ ] Create `app/videos/error.tsx`:
  - [ ] Client Component
  - [ ] Video-specific error handling
  - [ ] Link back to dashboard

- [ ] Create `app/hashtags/error.tsx`:
  - [ ] Client Component
  - [ ] Hashtag-specific errors

### 7.2 Loading States
- [ ] Create `app/dashboard/loading.tsx`:
  - [ ] Skeleton UI for dashboard

- [ ] Create `app/videos/[id]/loading.tsx`:
  - [ ] Skeleton UI for video detail

- [ ] Create `app/hashtags/loading.tsx`:
  - [ ] Skeleton UI for hashtag list

### 7.3 Not Found Pages
- [ ] Create `app/videos/[id]/not-found.tsx`:
  - [ ] Display when video not found
  - [ ] Link to dashboard

- [ ] Create `app/hashtags/[tag]/not-found.tsx`:
  - [ ] Display when hashtag not found
  - [ ] Link to hashtags page

---

## Phase 8: Testing & Validation

### 8.1 Run All Tests
- [ ] Run `pnpm test` and verify all tests pass
- [ ] Check test coverage with `pnpm test:coverage`
- [ ] Ensure minimum 80% coverage on services and utilities

### 8.2 Manual Testing Scenarios
- [ ] Create draft video without analytics
- [ ] Edit draft video (update title, script, description, hashtags)
- [ ] Publish draft video (transition to PUBLISHED)
- [ ] Add 1h snapshot to published video
- [ ] Add subsequent snapshots (3h, 6h, 12h, 24h, etc.)
- [ ] Delete a snapshot
- [ ] Verify snapshot timeline shows completed/missed correctly
- [ ] Verify charts render correctly with multiple snapshots
- [ ] Verify calculated metrics are accurate
- [ ] Verify signal detection works (positive/negative/neutral)
- [ ] Test hashtag creation and linking
- [ ] View hashtag stats and video list
- [ ] Merge two hashtags
- [ ] Delete unused hashtag
- [ ] Archive published video (transition to ARCHIVED)
- [ ] Edit archived video metadata
- [ ] Attempt invalid status transitions (should fail)
- [ ] Attempt to add snapshot to draft video (should fail)
- [ ] Attempt to create duplicate snapshot type (should fail)
- [ ] Delete a video with snapshots (cascade deletion)

### 8.3 Edge Cases
- [ ] Test with video length = 0 (retention rate calculation)
- [ ] Test with snapshot views = 0 (avoid division by zero in metrics)
- [ ] Test with null values in optional fields (all snapshot metrics)
- [ ] Test with very large numbers (millions of views, hours of play time)
- [ ] Test with special characters in hashtags
- [ ] Test with very long video titles/scripts/descriptions
- [ ] Test time input with edge values (0 seconds, very large values)
- [ ] Test percentage input with values outside 0-100 range
- [ ] Test creating video with PUBLISHED status but no postDate (should fail)
- [ ] Test hashtag case-sensitivity (should normalize to lowercase)
- [ ] Test position tracking when adding/removing hashtags

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
**Current Phase**: Phase 2 (DAL Layer - Ready to start 2.5)  
**Phase 1**: ✅ Complete  
**Phase 2.1-2.4**: ✅ Complete  
**Next**: Phase 2.5 (DAL - Videos)

Update this document as you complete tasks by checking boxes with `[x]`.
