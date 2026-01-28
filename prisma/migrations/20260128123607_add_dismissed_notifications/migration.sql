-- CreateTable
CREATE TABLE "DismissedNotification" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "dismissedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DismissedNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DismissedNotification_notificationId_key" ON "DismissedNotification"("notificationId");

-- CreateIndex
CREATE INDEX "DismissedNotification_notificationId_idx" ON "DismissedNotification"("notificationId");
