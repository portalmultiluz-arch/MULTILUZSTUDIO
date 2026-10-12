# MultiLuz Studio — Vídeos YouTube de Kits Elétricos & Hidráulicos

Plataforma profissional para criação e geração de vídeos de alta conversão para o YouTube e YouTube Shorts (16:9 e 9:16), integrando catálogo técnico de kits elétricos e hidráulicos para condomínios, residências e empresas com geração por inteligência artificial através de **Veo 3** (`veo-3.1-fast-generate-preview`) e **Gemini 3.8 Flash**.

---

## 🚀 Principais Funcionalidades

- **Gerador de Vídeos YouTube & Shorts**:
  - Formato Horizontal 16:9 (1920x1080) para vídeos regulares no YouTube.
  - Formato Vertical 9:16 (1080x1920) para YouTube Shorts.
  - Modelo de vídeo de alta fidelidade: **Veo 3** (`veo-3.1-fast-generate-preview`).
- **Roteiros & SEO Automático (Gemini 3.8 Flash)**:
  - Títulos atrativos de alta taxa de clique (CTR).
  - Descrições completas com timestamps, lista de peças e chamada comercial.
  - Tags e hashtags de busca.
  - Texto de locução (voice-over) profissional com leitor de voz em português brasileiro integrado.
- **Importação de Planilhas Excel / CSV**:
  - Aceita arquivos separados por ponto-e-vírgula (`;`), vírgula (`,`) ou tabulação.
  - Detecção inteligente de colunas (Componente, Código, Produto, Fornecedor, Embalagem/Qtd, Observação e Custo R$).
  - Botão de 1 clique para carregar o modelo anexo de materiais elétricos e hidráulicos.
- **Ficha Técnica & Impressão Oficial em PDF**:
  - Visualização formatada em folha timbrada da Portal Multi Luz.
  - Tabela com códigos de itens, marcas, normas técnicas NBR 5410/5626 e cálculo de custos.
  - Exportação direta para PDF pelo navegador (`Ctrl + P` / Salvar como PDF) e download em CSV.
- **Segmentos & Nichos Personalizados**:
  - Suporte a Condomínios, Residencial, Empresas e criação ilimitada de novos nichos comerciais (ex: Agronegócio & Irrigação, Energia Solar, etc.).

---

## ❓ Posso fazer deploy no Cloud Gemini sem domínio oficial próprio?

**SIM! Absolutamente sim.**

1. **URL Pública Automática do Google**: Ao fazer deploy no **Google Cloud Run** (ou no próprio ambiente gerenciado pelo Google AI Studio), o Google gera automaticamente uma URL pública e segura com terminação oficial:
   ```
   https://multiluz-studio-xxxx.us-west1.run.app
   ```
2. **Certificado SSL Gratuito**: O Google gerencia o certificado HTTPS automaticamente, garantindo conexão criptografada sem custo.
3. **Sem Custo de Domínio**: Você **não** precisa comprar nem registrar um domínio `.com.br` ou `.com` para ter a aplicação funcionando 100% online na nuvem.
4. **Domínio Próprio Opcional no Futuro**: Se um dia você quiser usar um domínio próprio (ex: `multiluz.com.br` ou `videos.portalmultiluz.com.br`), basta cadastrá-lo no Cloudflare ou Google Cloud apontando o registro CNAME.

---

## 📦 Como Subir o Projeto para o GitHub

Abra o terminal na pasta do projeto e execute os seguintes comandos:

```bash
# 1. Inicializar o repositório Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Criar o primeiro commit
git commit -m "feat: MultiLuz Studio com Veo 3, Gemini 3.8 Flash, Importação CSV e PDF"

# 4. Renomear o branch principal para main
git branch -M main

# 5. Conectar com o seu repositório no GitHub (crie antes um repositório vazio em github.com/new)
git remote add origin https://github.com/SEU_USUARIO/multiluz-studio.git

# 6. Enviar para o GitHub
git push -u origin main
```

---

## ☁️ Opções de Deploy

### Opção 1: Google Cloud Run (Recomendado — Sem Domínio Próprio)

Como o projeto possui backend Express para proteger a chave do Gemini e gerenciar as chamadas de vídeo do Veo 3, o Google Cloud Run é a forma mais rápida e robusta:

```bash
# Instale a Google Cloud CLI (gcloud) e faça login
gcloud auth login
gcloud config set project SEU_ID_DO_PROJETO_GOOGLE

# Fazer o deploy direto do código-fonte (compila o Dockerfile automaticamente)
gcloud run deploy multiluz-studio \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
```

O comando retornará imediatamente sua URL pública oficial:
`https://multiluz-studio-xxxx.a.run.app`

---

### Opção 2: Cloudflare (Pages / Workers)

Para publicar no Cloudflare:

1. **Pelo Painel do Cloudflare Pages**:
   - Conecte sua conta do GitHub ao Cloudflare Dashboard.
   - Selecione o repositório `multiluz-studio`.
   - Em **Build Settings**:
     - **Framework preset**: `Vite`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Em **Environment Variables**, adicione:
     - `GEMINI_API_KEY`: sua chave de API do Google Gemini.
     - `NODE_VERSION`: `20`
   - Clique em **Save and Deploy**. O Cloudflare criará uma URL pública gratuita terminada em `.pages.dev` (ex: `https://multiluz-studio.pages.dev`).

2. **Via Wrangler CLI**:
   ```bash
   npm install -g wrangler
   wrangler login
   npm run build
   wrangler pages deploy dist --project-name multiluz-studio
   ```

---

### Opção 3: Outros Provedores (Render, Railway, Fly.io)

O projeto inclui um `Dockerfile` pronto para produção. Em plataformas como Render ou Railway:
1. Conecte o repositório do GitHub.
2. Defina a variável de ambiente `GEMINI_API_KEY`.
3. A plataforma detectará o `Dockerfile` e colocará a aplicação no ar com HTTPS gratuito.

---

## 💻 Como Rodar Localmente

### Pré-requisitos:
- Node.js versão 20 ou superior
- Chave de API do Gemini (obtenha em [Google AI Studio](https://aistudio.google.com/app/apikey))

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU_USUARIO/multiluz-studio.git
cd multiluz-studio

# 2. Instalar as dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Abra o arquivo .env e insira sua GEMINI_API_KEY

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse no seu navegador: `http://localhost:3000`

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **Inteligência Artificial**:
  - `@google/genai` TypeScript SDK
  - **Veo 3** (`veo-3.1-fast-generate-preview`) para geração e renderização cinematográfica de vídeos em 16:9 e 9:16
  - **Gemini 3.8 Flash** para elaboração de roteiros comerciais técnicos e metadados de YouTube
- **Engenharia e Normas**: Conformidade com as normas ABNT NBR 5410 e NBR 5626
- **Impressão e Documentos**: Ficha técnica e orçamento comercial com `@media print` e exportador CSV/Excel

---

© 2026 Portal Multi Luz. Todos os direitos reservados.
