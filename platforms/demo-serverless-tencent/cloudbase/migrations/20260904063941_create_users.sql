CREATE TABLE public.users (
  user_id INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT SELECT, UPDATE ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_anon_select ON public.users
  FOR SELECT TO anon
  USING (TRUE);

CREATE POLICY users_anon_update ON public.users
  FOR UPDATE TO anon
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY users_authenticated_select ON public.users
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY users_authenticated_update ON public.users
  FOR UPDATE TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
