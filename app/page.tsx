'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/database'
import Link from 'next/link'

const WHATSAPP_NUMBER = '5511936189184'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Catálogo de Produtos</h1>
          <p className="text-xs text-gray-500">Microestoque & Vitrine</p>
        </div>
        <Link
          href="/admin/login"
          className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Área Admin
        </Link>
      </header>

      {/* Search bar */}
      <div className="p-4 bg-white border-b border-gray-100">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:outline-hidden transition-all text-gray-900"
        />
      </div>

      {/* Main Content (Grid) */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl p-3 shadow-xs animate-pulse flex flex-col h-64">
                <div className="bg-gray-200 rounded-lg w-full h-32 mb-3"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2 mb-auto"></div>
                <div className="bg-gray-200 h-8 rounded w-full mt-2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0
              const whatsappMessage = encodeURIComponent(
                `Olá, tenho interesse no produto ${product.name} que custa R$ ${product.price.toFixed(2)}. Ainda tem no estoque?`
              )
              const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between transition-transform active:scale-[0.99]"
                >
                  <Link href={`/product/${product.id}`} className="block relative">
                    <div className="w-full h-36 sm:h-44 bg-gray-100 relative overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 400px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sem foto
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Esgotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 pb-1">
                      <h2 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h2>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description || 'Sem descrição'}</p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-bold text-gray-900 text-sm">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Estoque: {product.stock}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-3 pt-2">
                    {isOutOfStock ? (
                      <button
                        disabled
                        className="w-full bg-gray-100 text-gray-400 text-xs font-semibold py-2 px-3 rounded-lg cursor-not-allowed"
                      >
                        Indisponível
                      </button>
                    ) : (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Comprar via WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer / Mobile Nav bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-400 z-30">
        Catálogo Web Mobile • Desenvolvido com Supabase & Next.js
      </footer>
    </div>
  )
}
