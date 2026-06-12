// build: 2026-06-01
import { supabase } from '@/lib/supabase'
import FooterClient from './FooterClient'

export const revalidate = 0

async function getFooterConfig() {
  const chaves = [
    'empresa_whatsapp','empresa_telefone','empresa_email',
    'empresa_endereco','empresa_cidade','empresa_estado',
    'empresa_facebook','empresa_instagram',
    'horario_seg_sex','horario_sabado','horario_domingo',
  ]
  const [{ data: site }, { data: erp }] = await Promise.all([
    supabase.from('site_config').select('chave,valor').in('chave', chaves),
    supabase.from('parametros').select('chave,valor').eq('chave', 'empresa_logo_url'),
  ])
  const map: Record<string,string> = {}
  ;(site ?? []).forEach((r: any) => { map[r.chave] = r.valor ?? '' })
  ;(erp ?? []).forEach((r: any) => { map['empresa_logo'] = r.valor ?? '' })
  return map
}

export default async function Footer() {
  const config = await getFooterConfig()
  return <FooterClient config={config} />
}
