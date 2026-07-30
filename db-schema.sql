-- KONTAGI Supabase PostgreSQL Database Schema

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WORKSPACES
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    avatar_text VARCHAR(10) NOT NULL,
    avatar_bg VARCHAR(100),
    avatar_color VARCHAR(100),
    tagline TEXT,
    prohibited_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. VIDEOS (ASSETS & AI ANALYSIS)
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    storage_path TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, uploading, active, transcribing, completed, failed
    error_message TEXT,
    
    -- Creative Performance Analysis
    score INTEGER DEFAULT 0,
    transcript TEXT,
    caption TEXT,
    tags TEXT[],
    poster_url TEXT,
    retention_profile JSONB DEFAULT '[]'::jsonb,      -- array of frame/second metrics
    hook_score INTEGER DEFAULT 0,
    hook_analysis TEXT,
    visual_score INTEGER DEFAULT 0,
    visual_analysis TEXT,
    audio_score INTEGER DEFAULT 0,
    audio_analysis TEXT,
    thumbnail_suggestions JSONB DEFAULT '[]'::jsonb,  -- list of dynamic recommendations
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'dark',
    border_radius VARCHAR(10) DEFAULT '12',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'ist',
    date_format VARCHAR(20) DEFAULT 'ddmmyyyy',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SCRIPT ANALYSES (CANONICAL CLOUD STORE FOR SCRIPT INTELLIGENCE)
CREATE TABLE IF NOT EXISTS script_analyses (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    script_text TEXT NOT NULL,
    original_script_text TEXT,
    content_type VARCHAR(100) DEFAULT 'Other',
    hook_score INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT FALSE,
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    estimated_speaking_time INTEGER DEFAULT 0,
    hook_text TEXT,
    signals JSONB DEFAULT '[]'::jsonb,
    engine_version VARCHAR(50) DEFAULT '1.0.0',
    analysis_mode VARCHAR(100) DEFAULT 'Rule-Based Analysis',
    analysis_confidence VARCHAR(50) DEFAULT 'High',
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for script_analyses
CREATE INDEX IF NOT EXISTS idx_script_analyses_user_id ON script_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_script_analyses_created_at ON script_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_script_analyses_favorite ON script_analyses(user_id, is_favorite);

-- Row Level Security (RLS) Policies for script_analyses
ALTER TABLE script_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own script_analyses" 
    ON script_analyses FOR SELECT 
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own script_analyses" 
    ON script_analyses FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own script_analyses" 
    ON script_analyses FOR UPDATE 
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own script_analyses" 
    ON script_analyses FOR DELETE 
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 6. SCRIPT VERSIONS
CREATE TABLE IF NOT EXISTS script_versions (
    id VARCHAR(255) PRIMARY KEY,
    analysis_id VARCHAR(255) REFERENCES script_analyses(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    script_text TEXT NOT NULL,
    hook_score INTEGER DEFAULT 0,
    version_type VARCHAR(50) NOT NULL, -- original | ai-hook | ai-script | user-edit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_script_versions_analysis ON script_versions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_script_versions_user ON script_versions(user_id);

ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own script_versions" 
    ON script_versions FOR ALL 
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 7. AI GENERATIONS AUDIT LOG
CREATE TABLE IF NOT EXISTS ai_generations (
    id VARCHAR(255) PRIMARY KEY,
    analysis_id VARCHAR(255) REFERENCES script_analyses(id) ON DELETE CASCADE,
    version_id VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    generation_type VARCHAR(100) NOT NULL, -- HOOK_IMPROVEMENT | HOOK_VARIANTS | SCRIPT_IMPROVEMENT
    provider VARCHAR(100),
    model VARCHAR(100),
    attempt_index INTEGER DEFAULT 0,
    output_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_analysis ON ai_generations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user ON ai_generations(user_id);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ai_generations" 
    ON ai_generations FOR ALL 
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Insert Default Workspaces for bootstrap
INSERT INTO workspaces (id, name, slug, avatar_text, avatar_bg, avatar_color, tagline, prohibited_terms)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Pulse Energy', 'pulse-energy', 'PE', 'var(--brand-primary-glow)', 'var(--brand-primary)', 'Charging clean Gen-Z visual focus states with zero additives.', 'tired, old-fashioned, slow, additives')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO workspaces (id, name, slug, avatar_text, avatar_bg, avatar_color, tagline, prohibited_terms)
VALUES 
  ('b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'Retro Denim', 'retro-denim', 'RD', 'rgba(245, 158, 11, 0.15)', 'var(--accent-orange)', 'Sleek retro-streetwear visual aesthetics built for long-duration wear.', 'hyper-futuristic, synthetic, neon glow, glitch')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO workspaces (id, name, slug, avatar_text, avatar_bg, avatar_color, tagline, prohibited_terms)
VALUES 
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'AuraSmart IoT', 'smart-home', 'AS', 'rgba(16, 185, 129, 0.15)', 'var(--accent-green)', 'AuraSmart IoT assistant systems integrating seamlessly with family flow.', 'cluttered, complex setup, loud sounds, intrusive')
ON CONFLICT (slug) DO NOTHING;

-- Insert a Default Project to start
INSERT INTO projects (id, workspace_id, name, description)
VALUES 
  ('d4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Pulse Energy Campaign 2026', 'Visual assets promoting Pulse Energy drinks.')
ON CONFLICT DO NOTHING;

-- 8. COMING SOON CONFIGURATION
CREATE TABLE IF NOT EXISTS coming_soon_config (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'kontagi_secret_lab_v2',
    feature_name VARCHAR(255) NOT NULL,
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Secret AI Laboratory',
    launch_date TIMESTAMP WITH TIME ZONE,
    progress JSONB DEFAULT '{"research": 100, "design": 92, "development": 84, "testing": 68, "deployment": 45}'::jsonb,
    enable_waitlist BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    theme VARCHAR(50) DEFAULT 'off-white',
    release_notes JSONB DEFAULT '[]'::jsonb,
    community_stats JSONB DEFAULT '{"waitingCount": 14892, "companiesCount": 342, "countriesCount": 68}'::jsonb,
    custom_messages JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. WAITLIST REGISTRATIONS
CREATE TABLE IF NOT EXISTS waitlist_registrations (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    use_case VARCHAR(100),
    referral_source VARCHAR(100),
    ticket_number INTEGER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_registrations(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_ticket ON waitlist_registrations(ticket_number);


