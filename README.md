# Pocket Store MVP

Catálogo web **mobile-first** para gestão de microestoque e vitrine pública. O lojista cadastra produtos com foto, preço e quantidade em uma área restrita; o cliente acessa a vitrine e finaliza o interesse pelo WhatsApp com uma mensagem pré-formatada.

## Stack

- [Next.js 16](https://nextjs.org) (App Router + Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres, Auth e Storage)

## Funcionalidades

**Vitrine pública**

- Grid de produtos em 2 colunas no celular, com busca por nome/descrição
- Produtos sem estoque aparecem com a tarja "Esgotado" e CTA desabilitado
- Página de detalhe com foto ampliada, descrição completa e preço
- Botão "Comprar via WhatsApp" com mensagem contendo nome e preço do produto

**Área do admin**

- Login com e-mail e senha via Supabase Auth
- Listagem de produtos com miniatura, preço e estoque
- Cadastro, edição e exclusão de produtos
- Ajuste rápido de estoque (+/-) direto na listagem
- Upload de uma foto por produto, comprimida automaticamente no navegador antes do envio (máx. 800px, JPEG 70%)

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Vitrine pública |
| `/product/[id]` | Detalhe do produto |
| `/admin/login` | Login do lojista |
| `/admin` | Dashboard de estoque (requer autenticação) |

## Estrutura do projeto

```
app/
  page.tsx                # Vitrine pública
  layout.tsx              # Layout raiz e fontes
  globals.css             # Estilos globais (Tailwind)
  product/[id]/page.tsx   # Detalhe do produto
  admin/page.tsx          # Dashboard de estoque
  admin/login/page.tsx    # Login do admin
lib/
  supabase.ts             # Client Supabase (browser)
types/
  database.ts             # Tipo Product
utils/
  image.ts                # Compressão de imagens no client
supabase/
  schema.sql              # Tabela, RLS e bucket de imagens
```

## Como rodar

### Pré-requisitos

- Node.js 20+
- Projeto no [Supabase](https://supabase.com)

### Passos

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env.local
   ```

   Preencha com a URL e a chave pública (anon/publishable) do seu projeto Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   ```

3. No painel do Supabase, abra o **SQL Editor** e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Ele cria:
   - a tabela `products`
   - as políticas de RLS (leitura pública, escrita apenas autenticada)
   - o bucket público `product-images` e suas políticas

4. Crie o usuário administrador em **Authentication > Users** (e-mail e senha). Não há tela de cadastro — o acesso é restrito ao lojista.

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000). Para testar no celular na mesma rede, use o IP da máquina (ex.: `http://192.168.0.180:3000`).

## Configuração do WhatsApp

O número do lojista está na constante `WHATSAPP_NUMBER` em:

- `app/page.tsx`
- `app/product/[id]/page.tsx`

Altere para o número no formato internacional (ex.: `5511999999999`, sem `+`, espaços ou traços).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm run lint` | Executa o ESLint |

## Segurança

- A leitura de `products` e do bucket `product-images` é pública.
- Inserção, atualização e exclusão exigem usuário autenticado (políticas RLS).
- Apenas a chave **pública** do Supabase é usada no client. Nunca exponha a `service_role` key em variáveis `NEXT_PUBLIC_*`.

## Referência

A especificação do produto está em [`SPEC.md`](SPEC.md).
