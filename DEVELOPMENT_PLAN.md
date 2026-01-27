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
- [ ] Create `lib/dal/videos.ts`:
  - [ ] Export `findVideoById(id: string)`
  - [ ] Export `findAllVideos()`
  - [ ] Export `findVideosByStatus(status: VideoStatus)`
  - [ ] Export `createVideo(data: CreateVideoData)`
  - [ ] Export `updateVideo(id: string, data: UpdateVideoData)`
  - [ ] Export `deleteVideo(id: string)`
- [ ] Create `lib/dal/videos.test.ts` with mocked Prisma client

### 2.6 DAL - Snapshots
- [ ] Create `lib/dal/snapshots.ts`:
  - [ ] Export `findSnapshotById(id: string)`
  - [ ] Export `findSnapshotsByVideoId(videoId: string)`
  - [ ] Export `findSnapshotByVideoAndType(videoId: string, type: SnapshotType)`
  - [ ] Export `createSnapshot(data: CreateSnapshotData)`
  - [ ] Export `updateSnapshot(id: string, data: UpdateSnapshotData)`
  - [ ] Export `deleteSnapshot(id: string)`
- [ ] Create `lib/dal/snapshots.test.ts`

### 2.7 DAL - Hashtags
- [ ] Create `lib/dal/hashtags.ts`:
  - [ ] Export `findHashtagByTag(tag: string)`
  - [ ] Export `findOrCreateHashtag(tag: string)`
  - [ ] Export `findAllHashtags()`
  - [ ] Export `findHashtagWithVideos(tag: string)`
  - [ ] Export `deleteHashtag(id: string)`
  - [ ] Export `mergeHashtags(sourceId: string, targetId: string)`
- [ ] Create `lib/dal/hashtags.test.ts`

---

## Phase 3: Service Layer & Utilities

### 3.1 Centralized Schemas
- [ ] Create `lib/schemas/video.ts`:
  - [ ] Export `createVideoSchema` (zod)
  - [ ] Export `updateVideoSchema` (zod)
  - [ ] Export `updateVideoStatusSchema` (zod, with forward-only validation)
  - [ ] Export inferred types using `z.infer`

- [ ] Create `lib/schemas/snapshot.ts`:
  - [ ] Export `createSnapshotSchema` (zod)
  - [ ] Export `updateSnapshotSchema` (zod)
  - [ ] Export inferred types

- [ ] Create `lib/schemas/hashtag.ts`:
  - [ ] Export `hashtagSchema` (zod, lowercase validation)
  - [ ] Export inferred types

### 3.2 Metric Calculations
- [ ] Create `lib/metrics/calculateEngagementRate.ts`:
  - [ ] Export `calculateEngagementRate(snapshot: AnalyticsSnapshot): number | null`
  - [ ] Formula: (likes + comments + shares) / views × 100
- [ ] Create `lib/metrics/calculateEngagementRate.test.ts`

- [ ] Create `lib/metrics/calculateShareRate.ts`:
  - [ ] Export `calculateShareRate(snapshot: AnalyticsSnapshot): number | null`
  - [ ] Formula: shares / views × 100
- [ ] Create `lib/metrics/calculateShareRate.test.ts`

- [ ] Create `lib/metrics/calculateRetentionRate.ts`:
  - [ ] Export `calculateRetentionRate(avgWatchTimeSeconds: number, videoLengthSeconds: number): number | null`
  - [ ] Formula: avgWatchTime / videoLength × 100
- [ ] Create `lib/metrics/calculateRetentionRate.test.ts`

- [ ] Create `lib/metrics/calculateFollowerConversion.ts`:
  - [ ] Export `calculateFollowerConversion(snapshot: AnalyticsSnapshot): number | null`
  - [ ] Formula: newFollowers / views × 100
- [ ] Create `lib/metrics/calculateFollowerConversion.test.ts`

- [ ] Create `lib/metrics/detectSignals.ts`:
  - [ ] Export `detectSignals(metrics: CalculatedMetrics): SignalResult`
  - [ ] Positive: completionRate >50% OR shareRate >3% OR followerConversion >0.5%
  - [ ] Negative: completionRate <20% OR engagementRate <1%
  - [ ] Neutral: otherwise
- [ ] Create `lib/metrics/detectSignals.test.ts`

### 3.3 Time Formatting Utilities
- [ ] Create `lib/metrics/formatSecondsToTime.ts`:
  - [ ] Export `formatSecondsToTime(seconds: number): string`
  - [ ] Format: "0h:18m:56s" or "4.3s"
- [ ] Create `lib/metrics/formatSecondsToTime.test.ts`

- [ ] Create `lib/metrics/parseTimeToSeconds.ts`:
  - [ ] Export `parseTimeToSeconds(hours: number, minutes: number, seconds: number): number`
- [ ] Create `lib/metrics/parseTimeToSeconds.test.ts`

### 3.4 Snapshot Helpers
- [ ] Create `lib/snapshots/getExpectedSnapshots.ts`:
  - [ ] Export `getExpectedSnapshots(postDate: Date): SnapshotType[]`
  - [ ] Return expected snapshots based on time elapsed
- [ ] Create `lib/snapshots/getExpectedSnapshots.test.ts`

- [ ] Create `lib/snapshots/getMissedSnapshots.ts`:
  - [ ] Export `getMissedSnapshots(postDate: Date, existingTypes: SnapshotType[]): SnapshotType[]`
  - [ ] Compare expected vs existing
- [ ] Create `lib/snapshots/getMissedSnapshots.test.ts`

- [ ] Create `lib/snapshots/getNextSuggestedSnapshot.ts`:
  - [ ] Export `getNextSuggestedSnapshot(postDate: Date, existingTypes: SnapshotType[]): SnapshotType | null`
- [ ] Create `lib/snapshots/getNextSuggestedSnapshot.test.ts`

### 3.5 Video Services
- [ ] Create `lib/services/createVideo.ts`:
  - [ ] Export `createVideo(input: unknown)`
  - [ ] Validate with `createVideoSchema.parse(input)`
  - [ ] Use Prisma transaction to create video + hashtags + optional snapshot
  - [ ] Return created video
- [ ] Create `lib/services/createVideo.test.ts`

- [ ] Create `lib/services/updateVideoStatus.ts`:
  - [ ] Export `updateVideoStatus(videoId: string, newStatus: VideoStatus)`
  - [ ] Validate forward-only transitions (DRAFT→PUBLISHED→ARCHIVED)
  - [ ] Throw error if invalid transition
- [ ] Create `lib/services/updateVideoStatus.test.ts`

- [ ] Create `lib/services/getVideoWithAnalytics.ts`:
  - [ ] Export `getVideoWithAnalytics(videoId: string)`
  - [ ] Fetch video with snapshots and hashtags
  - [ ] Calculate all metrics for each snapshot
  - [ ] Return enriched data
- [ ] Create `lib/services/getVideoWithAnalytics.test.ts`

- [ ] Create `lib/services/updateVideo.ts`:
  - [ ] Export `updateVideo(videoId: string, input: unknown)`
  - [ ] Validate with `updateVideoSchema.parse(input)`
  - [ ] Update video metadata (title, script, description, videoLength)
  - [ ] Handle hashtag updates (remove old, add new)
  - [ ] Use transaction for atomic updates
  - [ ] Return updated video
- [ ] Create `lib/services/updateVideo.test.ts`

- [ ] Create `lib/services/deleteVideo.ts`:
  - [ ] Export `deleteVideo(videoId: string)`
  - [ ] Handle cascade deletion (snapshots, video-hashtag relations)
- [ ] Create `lib/services/deleteVideo.test.ts`

### 3.6 Snapshot Services
- [ ] Create `lib/services/createSnapshot.ts`:
  - [ ] Export `createSnapshot(input: unknown)`
  - [ ] Validate with schema
  - [ ] Check video status is PUBLISHED
  - [ ] Check snapshot type not already exists for video
  - [ ] Create snapshot
- [ ] Create `lib/services/createSnapshot.test.ts`

- [ ] Create `lib/services/deleteSnapshot.ts`:
  - [ ] Export `deleteSnapshot(snapshotId: string)`
  - [ ] Delete snapshot by ID
- [ ] Create `lib/services/deleteSnapshot.test.ts`

### 3.7 Hashtag Services
- [ ] Create `lib/services/getHashtagStats.ts`:
  - [ ] Export `getHashtagStats(tag: string)`
  - [ ] Aggregate metrics across all PUBLISHED videos with tag
  - [ ] Calculate avg engagement, views, completion rate
- [ ] Create `lib/services/getHashtagStats.test.ts`

- [ ] Create `lib/services/getAllHashtagsWithStats.ts`:
  - [ ] Export `getAllHashtagsWithStats()`
  - [ ] Return all hashtags with usage counts and avg metrics
- [ ] Create `lib/services/getAllHashtagsWithStats.test.ts`

- [ ] Create `lib/services/mergeHashtags.ts`:
  - [ ] Export `mergeHashtags(sourceTag: string, targetTag: string)`
  - [ ] Use transaction to update VideoHashtag relations
- [ ] Create `lib/services/mergeHashtags.test.ts`

---

## Phase 4: UI Components

### 4.1 Form Input Components
- [ ] Create `components/TimeInput/TimeInput.tsx`:
  - [ ] Client Component with separate hours, minutes, seconds inputs
  - [ ] Export named `TimeInput`
  - [ ] Props: `value?: number`, `onChange: (seconds: number) => void`
  - [ ] Convert between seconds and h/m/s display
- [ ] Create `components/TimeInput/TimeInput.test.tsx`

- [ ] Create `components/PercentageInput/PercentageInput.tsx`:
  - [ ] Client Component
  - [ ] Export named `PercentageInput`
  - [ ] Props: `value?: number` (decimal), `onChange: (decimal: number) => void`
  - [ ] Display as percentage (10.55%), store as decimal (0.1055)
- [ ] Create `components/PercentageInput/PercentageInput.test.tsx`

- [ ] Create `components/HashtagInput/HashtagInput.tsx`:
  - [ ] Client Component with chip-based UI
  - [ ] Export named `HashtagInput`
  - [ ] Props: `value: string[]`, `onChange: (tags: string[]) => void`
  - [ ] Add/remove tags, enforce lowercase
- [ ] Create `components/HashtagInput/HashtagInput.test.tsx`

- [ ] Create `components/FormError/FormError.tsx`:
  - [ ] Server Component for displaying validation errors
  - [ ] Export named `FormError`
  - [ ] Props: `error?: string | string[]`
- [ ] Create `components/FormError/FormError.test.tsx`

### 4.2 Display Components
- [ ] Create `components/MetricCard/MetricCard.tsx`:
  - [ ] Server Component
  - [ ] Export named `MetricCard`
  - [ ] Props: `label`, `value`, `delta?`, `icon?`
  - [ ] Display metric with optional up/down indicator
- [ ] Create `components/MetricCard/MetricCard.test.tsx`

- [ ] Create `components/SignalBadge/SignalBadge.tsx`:
  - [ ] Server Component
  - [ ] Export named `SignalBadge`
  - [ ] Props: `signal: SignalResult`
  - [ ] Green (positive), Red (negative), Gray (neutral)
- [ ] Create `components/SignalBadge/SignalBadge.test.tsx`

- [ ] Create `components/StatusBadge/StatusBadge.tsx`:
  - [ ] Server Component
  - [ ] Export named `StatusBadge`
  - [ ] Props: `status: VideoStatus`
  - [ ] Color-coded badges (gray=draft, green=published, blue=archived)
- [ ] Create `components/StatusBadge/StatusBadge.test.tsx`

- [ ] Create `components/SnapshotTimeline/SnapshotTimeline.tsx`:
  - [ ] Server Component
  - [ ] Export named `SnapshotTimeline`
  - [ ] Props: `video: VideoWithSnapshots`
  - [ ] Visual timeline showing completed/missed/upcoming snapshots
  - [ ] Color-coded: green (completed), red (missed), gray (upcoming)
- [ ] Create `components/SnapshotTimeline/SnapshotTimeline.test.tsx`

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
