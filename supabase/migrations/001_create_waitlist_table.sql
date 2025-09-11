-- Create waitlist table for storing email signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  source VARCHAR(50) DEFAULT 'website',
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows insert only (for public signups)
CREATE POLICY "Enable insert for all users" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create a policy that allows authenticated users to view all records
CREATE POLICY "Enable read access for authenticated users" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Add a comment to the table
COMMENT ON TABLE waitlist IS 'Stores email waitlist signups for Domani app';