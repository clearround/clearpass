-- CreateTable
CREATE TABLE "Horse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rider" TEXT NOT NULL,
    "box" TEXT,
    "class" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,

    CONSTRAINT "Horse_pkey" PRIMARY KEY ("id")
);
