### SPECIFICATION (SPEC) - Catálogo Web Mobile MVP

**1. Visão Geral do Produto**
Um sistema web _mobile-first_ (focado em telas de celular) para gestão de microestoque e vitrine pública. O objetivo é permitir que o administrador (lojista) cadastre produtos rapidamente com fotos, preços e quantidade. O cliente final acessa um link público, visualiza os produtos em estoque e clica em um botão que abre o WhatsApp do lojista com uma mensagem pré-formatada sobre o item de interesse.

**2. Atores do Sistema**

- **Admin (Lojista):** Acessa a área restrita para gerenciar o estoque.
- **Visitante (Cliente):** Acessa a URL pública apenas para visualização.

**3. Stack Tecnológica Sugerida (Para a IA gerar o código)**

- **Frontend:** React (Next.js) ou Vite + TailwindCSS (para responsividade rápida).
- **Backend/Database:** Firebase (Firestore para dados, Firebase Auth para login, Firebase Storage para imagens) ou Supabase. São ideais para MVP sem necessidade de configurar servidores.

**4. Estrutura de Dados (Data Models)**
**Coleção: `Products**`

- `id` (string, UUID)
- `name` (string)
- `description` (string)
- `price` (number)
- `stock` (number) - _Quantidade disponível. Se for 0, o produto aparece como esgotado._
- `image_url` (string) - _URL da foto armazenada no Storage._
- `created_at` (timestamp)

**5. Funcionalidades do MVP (Histórias de Usuário)**

**Área do Admin (Requer Login):**

- **Login Simples:** Tela de autenticação apenas com e-mail e senha para o administrador.
- **Dashboard de Estoque:** Uma lista (lista simples, sem paginação complexa no MVP) mostrando todos os produtos cadastrados, com a foto em miniatura, nome, preço e quantidade atual.
- **CRUD de Produtos:**
- Botão flutuante para "Adicionar Produto".
- Formulário simples: Nome, Descrição, Preço, Quantidade e Upload de 1 (uma) foto diretamente da galeria do celular.
- Opção de editar a quantidade (para dar baixa manual quando vender) e deletar o produto.

**Área Pública (Catálogo do Cliente):**

- **Vitrine (Grid):** Uma página limpa mostrando os produtos em formato de grade (2 colunas no celular). Apenas itens com `stock > 0` devem estar visíveis para compra. Itens com `stock = 0` devem aparecer com uma tarja "Esgotado" e botão desabilitado.
- **Detalhe do Produto:** Ao clicar em um produto, abre uma visualização maior da foto, descrição completa e o botão CTA.
- **Botão "Comprar via WhatsApp":** O botão deve utilizar a API de links do WhatsApp (`wa.me/<NUMERO>`).
- _Lógica da URL:_ Ao clicar, o sistema injeta o nome do produto na URL. Exemplo de link gerado: `[https://wa.me/5511999999999?text=Olá](https://wa.me/5511999999999?text=Olá), tenho interesse no produto [Nome do Produto] que custa [Preço]. Ainda tem no estoque?`

**6. Requisitos Não-Funcionais (Restrições)**

- **Performance:** As imagens devem sofrer compressão automática antes do upload, pois fotos de celular (Paraguai/compras diretas) costumam ter mais de 5MB e deixariam o catálogo lento.
- **UX/UI:** O design deve imitar a experiência de um aplicativo nativo no celular (menus na parte inferior, botões grandes e modais, sem necessidade de rolagem horizontal).
- **Segurança:** Apenas usuários autenticados podem gravar, editar ou deletar na coleção `Products`. O banco de dados deve ter regras rígidas de segurança (Firestore Rules) permitindo leitura pública, mas escrita restrita.
