# Supabase Setup

1. Create a project at supabase.com
2. Run `supabase/schema.sql` in the SQL editor
3. Enable Email / Magic-link auth (or preferred provider)
4. (Future) Add client with `@supabase/supabase-js` and sync `projects` table

Current app works fully offline without Supabase. Schema + RLS are ready for optional cloud backup.
