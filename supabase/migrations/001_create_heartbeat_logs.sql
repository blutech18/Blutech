-- Create heartbeat_logs table for tracking keep-alive operations
CREATE TABLE IF NOT EXISTS heartbeat_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('success', 'error')),
    message TEXT NOT NULL,
    response_time INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on timestamp for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_timestamp ON heartbeat_logs(timestamp);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_status ON heartbeat_logs(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE heartbeat_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (for admin purposes)
CREATE POLICY "Allow all operations for authenticated users" ON heartbeat_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow insert for anonymous users (for heartbeat operations)
CREATE POLICY "Allow insert for anonymous users" ON heartbeat_logs
    FOR INSERT WITH CHECK (true);

-- Create a function to clean up old heartbeat logs
CREATE OR REPLACE FUNCTION cleanup_old_heartbeat_logs(days_to_keep INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM heartbeat_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old logs (runs daily)
-- Note: This requires pg_cron extension which may not be available in free tier
-- You can manually call this function or set up a cron job

-- Grant necessary permissions
GRANT USAGE ON SEQUENCE heartbeat_logs_id_seq TO anon, authenticated;
GRANT ALL ON heartbeat_logs TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_heartbeat_logs TO anon, authenticated;
