const SUPABASE_URL = "https://cbljaffqrthfysndiyse.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibGphZmZxcnRoZnlzbmRpeXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NjM1MDMsImV4cCI6MjA5OTAzOTUwM30.C2BzGRQKy1kTq0jy_ulw8TYgfgGVa6RZTZU1hkzxptg";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase conectado:", supabaseClient);