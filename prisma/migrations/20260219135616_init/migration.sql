-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sex" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "scoreYesNo" DOUBLE PRECISION NOT NULL,
    "scoreAccountability" DOUBLE PRECISION NOT NULL,
    "lean" TEXT NOT NULL,
    "strength" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);
