CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (user_id, user_name, age) VALUES
  (1, 'Alice', 28),
  (2, 'Bob', 34),
  (3, 'Charlie', 41)
ON CONFLICT (user_id) DO NOTHING;
