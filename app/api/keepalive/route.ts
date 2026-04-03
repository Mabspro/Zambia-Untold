/**
 * /api/keepalive
 * 
 * Lightweight Supabase ping to prevent free-tier project pausing.
 * Called daily by Vercel cron (see vercel.json).
 * Does a minimal read — no mutations, no secrets exposed.
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ ok: false, error: 'missing env' }, { status: 500 })
  }

  try {
    const supabase = createClient(url, key)
    const { error } = await supabase
      .from('isibalo_submissions')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      pinged_at: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
