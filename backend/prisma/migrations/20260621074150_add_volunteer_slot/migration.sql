-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('volunteer', 'organization', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "OppFormat" AS ENUM ('online', 'onsite', 'hybrid');

-- CreateEnum
CREATE TYPE "OppStatus" AS ENUM ('open', 'closed', 'draft');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_type" "UserType" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "dob" DATE,
    "phone" VARCHAR(20),
    "gender" VARCHAR(50),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "org_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(20),
    "location" VARCHAR(255),
    "logo" VARCHAR(500),
    "description" TEXT,
    "website" VARCHAR(500),
    "status" "OrgStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("org_id")
);

-- CreateTable
CREATE TABLE "volunteers" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "phone_num" VARCHAR(20),
    "profile_photo" VARCHAR(500),
    "dob" DATE,
    "location" VARCHAR(255),
    "gender" VARCHAR(50),
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "skills" (
    "skill_id" SERIAL NOT NULL,
    "skill_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "opp_id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "requirements" TEXT,
    "benefits" TEXT,
    "work_time" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "location" VARCHAR(255),
    "format" "OppFormat",
    "max_volunteers" INTEGER,
    "status" "OppStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("opp_id")
);

-- CreateTable
CREATE TABLE "opportunity_skills" (
    "opp_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "opportunity_skills_pkey" PRIMARY KEY ("opp_id","skill_id")
);

-- CreateTable
CREATE TABLE "volunteer_skills" (
    "profile_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "volunteer_skills_pkey" PRIMARY KEY ("profile_id","skill_id")
);

-- CreateTable
CREATE TABLE "applications" (
    "application_id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "opp_id" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_user_id_key" ON "organizations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_user_id_key" ON "volunteers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_skill_name_key" ON "skills"("skill_name");

-- CreateIndex
CREATE UNIQUE INDEX "applications_profile_id_opp_id_key" ON "applications"("profile_id", "opp_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "admins"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_skills" ADD CONSTRAINT "opportunity_skills_opp_id_fkey" FOREIGN KEY ("opp_id") REFERENCES "opportunities"("opp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_skills" ADD CONSTRAINT "opportunity_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "volunteers"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "volunteers"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_opp_id_fkey" FOREIGN KEY ("opp_id") REFERENCES "opportunities"("opp_id") ON DELETE CASCADE ON UPDATE CASCADE;
