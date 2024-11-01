import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klwenuauytemcqpcnivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2VudWF1eXRlbWNxcGNuaXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0NjExNjksImV4cCI6MjA0NjAzNzE2OX0.hmx8rAxDvkWo1jDDAKVoH6hHcsdDH1yWNeiYr8xzo6s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);