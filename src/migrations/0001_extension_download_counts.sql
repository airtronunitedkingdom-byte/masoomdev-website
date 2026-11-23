CREATE TABLE IF NOT EXISTS public.extension_download_counts (
  extension_slug text PRIMARY KEY,
  download_count bigint NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
