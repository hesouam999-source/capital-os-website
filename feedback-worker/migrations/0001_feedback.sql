CREATE TABLE IF NOT EXISTS feedback_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('web', 'desktop')),
  report_type TEXT NOT NULL CHECK (report_type IN ('bug', 'ux', 'feature', 'question')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_email TEXT,
  app_version TEXT,
  screenshot_key TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'verified', 'duplicate', 'resolved')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified')),
  priority TEXT NOT NULL DEFAULT 'untriaged' CHECK (priority IN ('untriaged', 'critical', 'high', 'normal', 'low')),
  duplicate_of TEXT,
  github_issue_number INTEGER,
  github_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (github_sync_status IN ('pending', 'synced', 'retry_pending', 'failed')),
  github_sync_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_feedback_retention ON feedback_submissions(expires_at);
CREATE INDEX IF NOT EXISTS idx_feedback_sync ON feedback_submissions(github_sync_status, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_duplicate ON feedback_submissions(duplicate_of);
