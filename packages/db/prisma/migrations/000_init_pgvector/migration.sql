CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "AssetContent" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

CREATE INDEX IF NOT EXISTS assetcontent_embedding_ivfflat
  ON "AssetContent"
  USING ivfflat ("embedding" vector_cosine_ops)
  WITH (lists = 100);
