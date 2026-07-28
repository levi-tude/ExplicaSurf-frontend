# ExplicaSurf — Frontend (TCC)

Interface web do **ExplicaSurf**: aplicação que interpreta previsões oceânicas e climáticas com Inteligência Artificial, tornadas acessíveis para surfistas de diferentes níveis.

> **Protótipo acadêmico (TCC)** — Ciência da Computação, UNIJORGE (Salvador/BA).  
> Foco: **Stella Maris**. Site: [explicasurfstella.com.br](https://explicasurfstella.com.br)

Este repositório é **apenas o frontend**. O backend Flask está em  
[levi-tude/ExplicaSurf-backend](https://github.com/levi-tude/ExplicaSurf-backend).

---

## O que o projeto resolve

Plataformas como Surfline e Surfguru entregam dados técnicos (swell, período, vento, maré) que muitos surfistas — sobretudo iniciantes — têm dificuldade de interpretar. Isso afeta **performance e segurança**.

O ExplicaSurf parte do conceito de *ocean literacy* (alfabetização oceânica) e oferece:

- Dados do mar e do tempo em cards e gráficos
- Explicação em linguagem natural (Gemini), personalizada por nível, stance e experiência
- Conhecimento local de Stella Maris injetado no prompt (via backend)
- Login/perfil (Supabase) ou modo visitante (explicação genérica)
- Leitura em voz alta (TTS) da explicação

Artigo: *ExplicaSurf: Aplicação Web para Interpretação de Previsões de Maré e Clima para Surfistas* (Levi Davi Tude Silva; orient. Jailson Santos, Marcos Santos Leite).

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| React + Vite + TypeScript | SPA |
| Tailwind CSS + shadcn/ui | UI |
| Recharts / charts próprios | Gráficos (onda, energia, vento, maré, clima) |
| React Router | Rotas (home, auth, perfil) |
| Supabase Auth + `profiles` | Cadastro, login, perfil do surfista |
| Fetch HTTPS → Flask | Endpoint `/api/explain` |

---

## Funcionalidades da interface

- **Hero / home** — Stella Maris, seleção de nível e dia (hoje / amanhã / depois)
- **OceanDataCard** — altura, período, energia, vento, maré, tamanho percebido
- **Gráficos** — WaveHeight, Energy, Wind, Tide, Weather
- **ExplanationCard** — texto da IA + TTS (pt-BR)
- **Auth** — signup/login; perfil (nome, stance, surf_level, experience_months)
- **Warmup** — ping leve no backend para reduzir cold start do Render

---

## Estrutura (pasta `frontend/`)

```
frontend/
├── src/
│   ├── components/       # UI, OceanDataCard, ExplanationCard, charts/
│   ├── pages/            # Index, AuthPage, ProfilePage
│   ├── context/          # AuthContext
│   ├── lib/              # supabaseClient, utils
│   ├── App.tsx
│   └── main.tsx
├── public/               # assets (hero, backgrounds)
├── package.json
└── README.md             # este arquivo
```

No GitHub, os arquivos ficam sob o prefixo `frontend/` neste repositório.

---

## Pré-requisitos

- Node.js 18+
- Conta Supabase (Auth + tabela `profiles`)
- Backend ExplicaSurf em execução (local ou [Render](https://explicasurf-backend.onrender.com))

---

## Setup local

```bash
git clone https://github.com/levi-tude/ExplicaSurf-frontend.git
cd ExplicaSurf-frontend/frontend
npm install
cp .env.example .env   # se existir; senão crie .env (ver abaixo)
npm run dev
```

Abra a URL do Vite (geralmente `http://localhost:5173`).

### Variáveis de ambiente

Crie `frontend/.env` (não versionar):

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
VITE_API_BASE_URL=http://localhost:5000
```

Em produção, a home usa o backend no Render (`explicasurf-backend.onrender.com`). Prefira `VITE_API_BASE_URL` para apontar ao ambiente desejado.

Campos típicos em `profiles`: `name`, `stance`, `surf_level`, `experience_months`.

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |

---

## Fluxo com o backend

1. Frontend chama `GET /api/explain?level=...&day=...` (dados do mar; `ai=off` implícito ou sem IA).
2. Com usuário logado, envia também `name`, `stance`, `experience_months` e `ai=on` para gerar explicação personalizada.
3. Backend agrega Open-Meteo + WorldTides + Gemini e devolve JSON (série horária + texto).
4. UI renderiza cards, gráficos e `ExplanationCard`.

Detalhes da API: repositório [ExplicaSurf-backend](https://github.com/levi-tude/ExplicaSurf-backend).

---

## Produção

- **Frontend:** [explicasurfstella.com.br](https://explicasurfstella.com.br)
- **Backend:** Render — `explicasurf-backend.onrender.com` (free tier pode “dormir”; o warmup mitiga)

---

## Relação com o produto comercial

| | Este repo (TCC) | Produto comercial |
|--|-----------------|-------------------|
| Pasta local | `ExplicaSurf/frontend` | `ExplicaSurf-tio` |
| Escopo | 1 praia (Stella) | Multi-praia Salvador |
| Stack UI | React + Vite | Next.js 16 + Supabase |

O comercial **não depende** deste frontend em runtime; a lógica de domínio foi portada a partir do TCC.

---

## Autor

**Levi Davi Tude Silva** — TCC, UNIJORGE  
Contato: levidavitudesilva@gmail.com

---

## Licença

Projeto acadêmico / protótipo. Consulte o autor para uso além do TCC.
