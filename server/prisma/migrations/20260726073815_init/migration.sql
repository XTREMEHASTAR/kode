-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PENDING', 'UPLOADING', 'ACTIVE', 'TRANSCRIBING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ScriptVersionType" AS ENUM ('ORIGINAL', 'AI_HOOK', 'AI_SCRIPT', 'USER_EDIT');

-- CreateEnum
CREATE TYPE "AiGenerationType" AS ENUM ('HOOK_IMPROVEMENT', 'HOOK_VARIANTS', 'SCRIPT_IMPROVEMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verify_token" VARCHAR(255),
    "reset_token" VARCHAR(255),
    "reset_expires" TIMESTAMP(3),
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login_at" TIMESTAMPTZ,
    "last_login_ip" VARCHAR(45),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMPTZ,
    "device_name" VARCHAR(255),
    "device_type" VARCHAR(50),
    "browser_name" VARCHAR(100),
    "os_name" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "last_used_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "avatar_text" VARCHAR(10) NOT NULL,
    "avatar_bg" VARCHAR(100),
    "avatar_color" VARCHAR(100),
    "tagline" TEXT,
    "prohibited_terms" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "storage_path" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "transcript" TEXT,
    "caption" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "poster_url" TEXT,
    "retention_profile" JSONB NOT NULL DEFAULT '[]',
    "hook_score" INTEGER NOT NULL DEFAULT 0,
    "hook_analysis" TEXT,
    "visual_score" INTEGER NOT NULL DEFAULT 0,
    "visual_analysis" TEXT,
    "audio_score" INTEGER NOT NULL DEFAULT 0,
    "audio_analysis" TEXT,
    "thumbnail_suggestions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "theme" VARCHAR(50) NOT NULL DEFAULT 'dark',
    "border_radius" VARCHAR(10) NOT NULL DEFAULT '12',
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'ist',
    "date_format" VARCHAR(20) NOT NULL DEFAULT 'ddmmyyyy',
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_analyses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "script_text" TEXT NOT NULL,
    "original_script_text" TEXT,
    "content_type" VARCHAR(100) NOT NULL DEFAULT 'Other',
    "hook_score" INTEGER NOT NULL DEFAULT 0,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "character_count" INTEGER NOT NULL DEFAULT 0,
    "estimated_speaking_time" INTEGER NOT NULL DEFAULT 0,
    "hook_text" TEXT,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "analysis_result" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "script_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_versions" (
    "id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "script_text" TEXT NOT NULL,
    "hook_score" INTEGER NOT NULL DEFAULT 0,
    "version_type" "ScriptVersionType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "script_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generations" (
    "id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "version_id" UUID,
    "user_id" UUID NOT NULL,
    "generation_type" "AiGenerationType" NOT NULL,
    "provider" VARCHAR(100),
    "model" VARCHAR(100),
    "attempt_index" INTEGER NOT NULL DEFAULT 0,
    "output_summary" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_revoked_idx" ON "refresh_tokens"("user_id", "revoked");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "projects_workspace_id_idx" ON "projects"("workspace_id");

-- CreateIndex
CREATE INDEX "videos_project_id_idx" ON "videos"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "settings"("user_id");

-- CreateIndex
CREATE INDEX "script_analyses_user_id_idx" ON "script_analyses"("user_id");

-- CreateIndex
CREATE INDEX "script_analyses_created_at_idx" ON "script_analyses"("created_at" DESC);

-- CreateIndex
CREATE INDEX "script_analyses_user_id_is_favorite_idx" ON "script_analyses"("user_id", "is_favorite");

-- CreateIndex
CREATE INDEX "script_versions_analysis_id_idx" ON "script_versions"("analysis_id");

-- CreateIndex
CREATE INDEX "script_versions_user_id_idx" ON "script_versions"("user_id");

-- CreateIndex
CREATE INDEX "ai_generations_analysis_id_idx" ON "ai_generations"("analysis_id");

-- CreateIndex
CREATE INDEX "ai_generations_user_id_idx" ON "ai_generations"("user_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_analyses" ADD CONSTRAINT "script_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_versions" ADD CONSTRAINT "script_versions_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "script_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_versions" ADD CONSTRAINT "script_versions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "script_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
