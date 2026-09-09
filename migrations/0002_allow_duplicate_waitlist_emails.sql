-- Rebuild the table without email uniqueness, preserving all existing submissions.
CREATE TABLE waitlist_submissions_new (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE
    CHECK (length(email) <= 320),
  name TEXT
    CHECK (name IS NULL OR length(name) <= 100),
  company TEXT
    CHECK (company IS NULL OR length(company) <= 100),
  role TEXT
    CHECK (role IS NULL OR length(role) <= 100),
  current_ai TEXT
    CHECK (current_ai IS NULL OR length(current_ai) <= 300),
  ai_feelings TEXT
    CHECK (ai_feelings IS NULL OR length(ai_feelings) <= 1000),
  ai_era_change TEXT
    CHECK (ai_era_change IS NULL OR length(ai_era_change) <= 1000),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT INTO waitlist_submissions_new (
  id, email, name, company, role, current_ai, ai_feelings, ai_era_change,
  created_at, updated_at
)
SELECT
  id, email, name, company, role, current_ai, ai_feelings, ai_era_change,
  created_at, updated_at
FROM waitlist_submissions;

DROP TABLE waitlist_submissions;
ALTER TABLE waitlist_submissions_new RENAME TO waitlist_submissions;
