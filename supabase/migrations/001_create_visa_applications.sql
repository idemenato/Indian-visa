-- ============================================================
-- Migration 001: Create visa_applications table
-- Run this in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste & run
-- ============================================================

CREATE TABLE IF NOT EXISTS visa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Step 1: Basic Info
  nationality               TEXT,
  passport_type             TEXT,
  port_of_arrival           TEXT,
  date_of_birth             DATE,
  email                     TEXT NOT NULL,
  visa_service              TEXT,
  expected_arrival_date     DATE,

  -- Step 2: Personal Details
  surname                   TEXT,
  given_names               TEXT,
  changed_name              BOOLEAN DEFAULT FALSE,
  prev_surname              TEXT,
  prev_given_names          TEXT,
  gender                    TEXT,
  town_of_birth             TEXT,
  country_of_birth          TEXT,
  id_number                 TEXT,
  religion                  TEXT,
  visible_marks             TEXT,
  educational_qualification TEXT,
  college_qualification     TEXT,
  nationality_by            TEXT,
  prev_nationality          TEXT,
  lived_two_years           TEXT,

  -- Step 3: Passport Details
  passport_number           TEXT,
  place_of_issue            TEXT,
  date_of_issue             DATE,
  date_of_expiry            DATE,
  any_other_passport        TEXT DEFAULT 'No',
  other_passport_country    TEXT,
  other_passport_number     TEXT,
  other_passport_doi        DATE,
  other_passport_poi        TEXT,
  other_passport_nationality TEXT,

  -- Step 4: Present Address
  pres_house_street         TEXT,
  pres_village_city         TEXT,
  pres_country              TEXT,
  pres_state                TEXT,
  pres_zip                  TEXT,
  pres_phone                TEXT,
  pres_mobile               TEXT,

  -- Step 4: Permanent Address
  same_address              BOOLEAN DEFAULT FALSE,
  perm_house_street         TEXT,
  perm_village_city         TEXT,
  perm_state                TEXT,

  -- Step 5: Family Details
  father_name               TEXT,
  father_nationality        TEXT,
  father_prev_nationality   TEXT,
  father_place_of_birth     TEXT,
  father_country_of_birth   TEXT,
  mother_name               TEXT,
  mother_nationality        TEXT,
  mother_prev_nationality   TEXT,
  mother_place_of_birth     TEXT,
  mother_country_of_birth   TEXT,
  marital_status            TEXT,
  spouse_name               TEXT,
  spouse_nationality        TEXT,
  spouse_prev_nationality   TEXT,
  spouse_place_of_birth     TEXT,
  spouse_country_of_birth   TEXT,
  pakistan_ancestry         TEXT DEFAULT 'No',
  pakistan_details          TEXT,

  -- Step 5: Occupation
  occupation                TEXT,
  employer_name             TEXT,
  employer_designation      TEXT,
  occupation_address        TEXT,
  occupation_phone          TEXT,
  past_occupation           TEXT,
  military_service          TEXT DEFAULT 'No',
  military_org              TEXT,
  military_designation      TEXT,
  military_rank             TEXT,
  military_posting          TEXT,

  -- Step 6: Travel Details
  places_to_be_visited      TEXT,
  places_to_be_visited2     TEXT,
  hotel_booked              TEXT DEFAULT 'No',
  port_of_exit              TEXT,
  visited_india_before      TEXT DEFAULT 'No',
  visited_india_details     TEXT,
  visa_refused              TEXT DEFAULT 'No',
  visa_refused_details      TEXT,
  countries_visited_10_years JSONB DEFAULT '[]'::JSONB,
  visited_saarc             TEXT DEFAULT 'No',
  visited_saarc_details     TEXT,

  -- Step 6: References in India
  ref_name_india            TEXT,
  ref_address_india1        TEXT,
  ref_address_india2        TEXT,
  ref_state_india           TEXT,
  ref_district_india        TEXT,
  ref_phone_india           TEXT,

  -- Step 6: References in Home Country
  ref_name_home             TEXT,
  ref_address_home1         TEXT,
  ref_address_home2         TEXT,
  ref_phone_home            TEXT,

  -- Step 7: Photos (Base64 encoded)
  passport_photo            TEXT,
  personal_photo            TEXT,

  -- Payment & Application Status
  payment_status            TEXT NOT NULL DEFAULT 'pending',
  application_status        TEXT NOT NULL DEFAULT 'draft',
  stripe_session_id         TEXT,

  -- Timestamps
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON visa_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;

-- Allow the frontend (anon key) to INSERT new applications
CREATE POLICY "public_insert" ON visa_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- SELECT and UPDATE are intentionally NOT allowed for anon/public.
-- Only the service role key (used in the stripe-webhook serverless
-- function) can read and update records — service role bypasses RLS.

-- ============================================================
-- Indexes for common lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_visa_applications_email
  ON visa_applications(email);

CREATE INDEX IF NOT EXISTS idx_visa_applications_stripe_session
  ON visa_applications(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_visa_applications_status
  ON visa_applications(payment_status, application_status);
