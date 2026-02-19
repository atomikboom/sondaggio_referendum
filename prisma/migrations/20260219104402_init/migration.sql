-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sex" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "scoreYesNo" REAL NOT NULL,
    "scoreAccountability" REAL NOT NULL,
    "lean" TEXT NOT NULL,
    "strength" TEXT NOT NULL
);
