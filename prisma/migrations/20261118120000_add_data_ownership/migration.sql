-- Associate new and existing academic records with an account.
-- Nullable ownership preserves legacy rows; application queries never expose
-- rows without an owner to authenticated users.
ALTER TABLE "Teacher" ADD COLUMN "ownerId" INTEGER;
ALTER TABLE "Student" ADD COLUMN "ownerId" INTEGER;

CREATE INDEX "Teacher_ownerId_idx" ON "Teacher"("ownerId");
CREATE INDEX "Student_ownerId_idx" ON "Student"("ownerId");

ALTER TABLE "Teacher"
  ADD CONSTRAINT "Teacher_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Student"
  ADD CONSTRAINT "Student_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
