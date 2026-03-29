CREATE TABLE "PostFaq" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostFaq_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PostFaq_postId_sortOrder_idx" ON "PostFaq"("postId", "sortOrder");

ALTER TABLE "PostFaq" ADD CONSTRAINT "PostFaq_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
