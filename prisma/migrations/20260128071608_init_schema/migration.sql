-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SnapshotType" AS ENUM ('ONE_HOUR', 'THREE_HOUR', 'SIX_HOUR', 'TWELVE_HOUR', 'ONE_DAY', 'TWO_DAY', 'SEVEN_DAY', 'FOURTEEN_DAY', 'THIRTY_DAY');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoLengthSeconds" INTEGER NOT NULL,
    "postDate" TIMESTAMP(3),
    "status" "VideoStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotType" "SnapshotType" NOT NULL,
    "views" INTEGER,
    "totalPlayTimeSeconds" INTEGER,
    "avgWatchTimeSeconds" DECIMAL(10,2),
    "completionRate" DECIMAL(5,4),
    "newFollowers" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "favorites" INTEGER,
    "profileViews" INTEGER,
    "reach" INTEGER,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashtag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoHashtag" (
    "videoId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "VideoHashtag_pkey" PRIMARY KEY ("videoId","hashtagId")
);

-- CreateIndex
CREATE INDEX "Video_status_idx" ON "Video"("status");

-- CreateIndex
CREATE INDEX "Video_createdAt_idx" ON "Video"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_videoId_idx" ON "AnalyticsSnapshot"("videoId");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_recordedAt_idx" ON "AnalyticsSnapshot"("recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSnapshot_videoId_snapshotType_key" ON "AnalyticsSnapshot"("videoId", "snapshotType");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_tag_key" ON "Hashtag"("tag");

-- CreateIndex
CREATE INDEX "Hashtag_tag_idx" ON "Hashtag"("tag");

-- CreateIndex
CREATE INDEX "VideoHashtag_hashtagId_idx" ON "VideoHashtag"("hashtagId");

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoHashtag" ADD CONSTRAINT "VideoHashtag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoHashtag" ADD CONSTRAINT "VideoHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
