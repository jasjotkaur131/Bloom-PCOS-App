import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://odvnredkdodvxvtirwtg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm5yZWRrZG9kdnh2dGlyd3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDg1MDAsImV4cCI6MjA5MjIyNDUwMH0.MCDLSKnghJfk1vDZ-hZpeoIgDEsg9r_XxlzxsedA620";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);