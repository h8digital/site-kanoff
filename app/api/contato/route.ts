// build: 2026-05-29 17:55:15
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const runtime = 'nodejs'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, mensagem } = await req.json()
    if (!nome?.trim() || !mensagem?.trim())
      return NextResponse.json({ ok:false, error:'Nome e mensagem são obrigatórios.' })

    await sb.from('site_contatos').insert({ nome, email, telefone, mensagem })
    return NextResponse.json({ ok:true })
  } catch(e:any) {
    return NextResponse.json({ ok:false, error:e.message })
  }
}
