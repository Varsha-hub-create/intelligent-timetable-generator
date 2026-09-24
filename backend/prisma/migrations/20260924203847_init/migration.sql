-- CreateTable
CREATE TABLE "Division" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "studentCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weeklyPeriods" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "roomType" TEXT NOT NULL DEFAULT 'CLASSROOM',
    "facultyId" INTEGER NOT NULL,
    CONSTRAINT "Subject_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DivisionSubject" (
    "divisionId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    PRIMARY KEY ("divisionId", "subjectId"),
    CONSTRAINT "DivisionSubject_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DivisionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacultyAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facultyId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "FacultyAvailability_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Timetable_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timetable_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timetable_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timetable_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Division_name_key" ON "Division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyAvailability_facultyId_day_period_key" ON "FacultyAvailability"("facultyId", "day", "period");

-- CreateIndex
CREATE UNIQUE INDEX "Timetable_day_period_divisionId_key" ON "Timetable"("day", "period", "divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "Timetable_day_period_facultyId_key" ON "Timetable"("day", "period", "facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "Timetable_day_period_roomId_key" ON "Timetable"("day", "period", "roomId");
