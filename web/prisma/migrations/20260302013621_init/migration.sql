-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonBalance" INTEGER NOT NULL DEFAULT 0,
    "totalClassesBought" INTEGER NOT NULL DEFAULT 0,
    "monthlyLessonsUsed" INTEGER NOT NULL DEFAULT 0,
    "lastProgressUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "lessonsIncluded" INTEGER NOT NULL,
    "validityDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentPlanId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentDeadline" TIMESTAMP(3) NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentDate" TIMESTAMP(3),
    "pixQrCode" TEXT,
    "lessonsRemaining" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT,

    CONSTRAINT "class_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'terms',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),
    "imageRightsConsent" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructorId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "classType" TEXT NOT NULL DEFAULT 'online',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "jitsiRoomId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_class_briefings" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocalFocus" TEXT,
    "emotionalState" TEXT,
    "physicalState" TEXT,
    "musicChoice" TEXT,
    "specificGoals" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_class_briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_reports" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "technicalAnalysis" TEXT,
    "studentObservations" TEXT,
    "homework" TEXT,
    "nextFocusAreas" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structure_evaluations" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "breathSupport" INTEGER,
    "glotticClosure" INTEGER,
    "vocalRegisters" INTEGER,
    "laryngealStability" INTEGER,
    "compensationReduction" INTEGER,
    "finalGrade" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "structure_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modeling_evaluations" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "vocalTractAdjust" INTEGER,
    "sourceFilterEff" INTEGER,
    "diction" INTEGER,
    "timbre" INTEGER,
    "finalGrade" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modeling_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expression_evaluations" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "interpretation" INTEGER,
    "repertoireSelection" INTEGER,
    "artisticCoherence" INTEGER,
    "finalGrade" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expression_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocal_profiles" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "totalClassesTaken" INTEGER NOT NULL DEFAULT 0,
    "avgStructureGrade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgModelingGrade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgExpressionGrade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallGrade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastClassDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocal_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_lesson_plans" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "structureFocus" TEXT,
    "modelingFocus" TEXT,
    "expressionFocus" TEXT,
    "repertoireGoals" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_lesson_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_leads" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "interestedIn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentEnrollment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentEnrollment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_userId_key" ON "admin_profiles"("userId");

-- CreateIndex
CREATE INDEX "classes_instructorId_idx" ON "classes"("instructorId");

-- CreateIndex
CREATE INDEX "classes_scheduledAt_idx" ON "classes"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "pre_class_briefings_classId_key" ON "pre_class_briefings"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "class_reports_classId_key" ON "class_reports"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "vocal_profiles_studentProfileId_key" ON "vocal_profiles"("studentProfileId");

-- CreateIndex
CREATE INDEX "_StudentEnrollment_B_index" ON "_StudentEnrollment"("B");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_purchases" ADD CONSTRAINT "class_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_purchases" ADD CONSTRAINT "class_purchases_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_purchases" ADD CONSTRAINT "class_purchases_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_class_briefings" ADD CONSTRAINT "pre_class_briefings_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_class_briefings" ADD CONSTRAINT "pre_class_briefings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_reports" ADD CONSTRAINT "class_reports_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_reports" ADD CONSTRAINT "class_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structure_evaluations" ADD CONSTRAINT "structure_evaluations_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structure_evaluations" ADD CONSTRAINT "structure_evaluations_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modeling_evaluations" ADD CONSTRAINT "modeling_evaluations_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modeling_evaluations" ADD CONSTRAINT "modeling_evaluations_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expression_evaluations" ADD CONSTRAINT "expression_evaluations_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expression_evaluations" ADD CONSTRAINT "expression_evaluations_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocal_profiles" ADD CONSTRAINT "vocal_profiles_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_lesson_plans" ADD CONSTRAINT "monthly_lesson_plans_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_leads" ADD CONSTRAINT "contact_leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentEnrollment" ADD CONSTRAINT "_StudentEnrollment_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentEnrollment" ADD CONSTRAINT "_StudentEnrollment_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
