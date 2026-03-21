CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  student_type TEXT,
  student_type_label TEXT,
  grade TEXT,
  curriculum_summary TEXT,
  mode_label TEXT,
  top_direction TEXT,
  second_direction TEXT,
  top_major TEXT,
  second_major TEXT,
  top_match_index INTEGER,
  report_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_submitted_at ON reports(submitted_at DESC);
