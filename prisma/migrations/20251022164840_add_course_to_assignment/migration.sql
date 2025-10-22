/*
  Warnings:

  - Added the required column `course` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "course" TEXT NOT NULL;
