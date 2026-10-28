'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database'
import Link from 'next/link'

const WHATSAPP_NUMBER = '5511936189184'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return

      if (error) {
        console.error('Error fetching product:', error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-lg font-bold text-gray-900 mb-2">Produto não encontrado</h1>
        <p className="text-sm text-gray-500 mb-4">O item que você procura pode ter sido removido.</p>
        <Link
          href="/"
          className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0
  const whatsappMessage = encodeURIComponent(
    `Olá, tenho interesse no produto ${product.name} que custa R$ ${product.price.toFixed(2)}. Ainda tem no estoque?`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-20">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Voltar
        </button>
        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Detalhes</span>
        <div className="w-12"></div>
      </header>

      {/* Product content */}
      <main className="flex-1 max-w-lg mx-auto w-full p-4 flex flex-col pb-24">
        <div className="w-full h-72 sm:h-96 bg-gray-100 rounded-2xl overflow-hidden relative shadow-xs mb-6">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sem foto disponível
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                Esgotado
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h1>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-gray-900">
              R$ {product.price.toFixed(2)}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isOutOfStock ? 'Esgotado' : `${product.stock} em estoque`}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || 'Nenhuma descrição fornecida para este produto.'}
          </p>
        </div>

        {/* Floating CTA for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-35 max-w-lg mx-auto">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 text-sm font-semibold py-3 px-4 rounded-xl cursor-not-allowed text-center"
            >
              Produto Esgotado
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Comprar via WhatsApp</span>
            </a>
          )}
        </div>
      </main>
    </div>
  )
}
