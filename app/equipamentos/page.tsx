// build: 2026-05-29 17:55:15
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CatalogoClient from './CatalogoClient'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Equipamentos para Locação',
  description: 'Catálogo completo de equipamentos para locação: andaimes, betoneiras, ferramentas elétricas e muito mais. Monte sua cotação online.',
  alternates: { canonical: '/equipamentos' },
}

async function getCategorias() {
  const { data } = await supabase.from('categorias').select('id,nome').order('nome')
  return data ?? []
}

export default async function EquipamentosPage() {
  const categorias = await getCategorias()
  return (
    <div style={{ paddingTop:72 }}>
      <Suspense fallback={<div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'var(--primary)' }}>Carregando...</span></div>}>
        <CatalogoClient categorias={categorias} />
      </Suspense>
    </div>
  )
}
