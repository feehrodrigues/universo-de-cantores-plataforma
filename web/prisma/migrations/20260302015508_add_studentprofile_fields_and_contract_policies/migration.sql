-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "latePolicy" TEXT,
ADD COLUMN     "lgpdConsent" BOOLEAN,
ADD COLUMN     "otherImportantNotes" TEXT,
ADD COLUMN     "prepaymentPolicy" TEXT,
ADD COLUMN     "replacementPolicy" TEXT;

-- AlterTable
ALTER TABLE "payment_plans" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "student_profiles" ADD COLUMN     "generalGoal" TEXT,
ADD COLUMN     "overallGoal" TEXT,
ADD COLUMN     "vocalHistory" TEXT;
