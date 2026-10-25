// config.js

const SUPABASE_URL = "https://efxapcgcczmupvujjpl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZWYiOiJlZnhhcGNnY2N6bXVwdnVqanBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDY1Mjh9.KkP5LgZ1s9kE1kZ1s9kE1kZ1s9kE1kZ1s9kE1kZ1s9k";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
