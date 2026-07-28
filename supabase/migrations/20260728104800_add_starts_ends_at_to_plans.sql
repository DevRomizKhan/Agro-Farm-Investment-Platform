-- Migration: Add starts_at and ends_at columns to investment_plans
ALTER TABLE investment_plans 
ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ DEFAULT NULL;
