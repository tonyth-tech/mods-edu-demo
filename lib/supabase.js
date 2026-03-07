import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://frjlnafdamqhpeletsxx.supabase.co'
const supabaseKey = 'sb_publishable_FjsiZ_8hieILa9ZqTf7cRQ__QK70pI2'

export const supabase = createClient(supabaseUrl, supabaseKey)