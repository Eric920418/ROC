-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" SERIAL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentBlock_key_key" ON "ContentBlock" ("key");

-- CreateTable
CREATE TABLE "ip_blocklist" (
    "id" SERIAL PRIMARY KEY,
    "ipAddress" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "blockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ip_blocklist_ipAddress_key" ON "ip_blocklist"("ipAddress");
