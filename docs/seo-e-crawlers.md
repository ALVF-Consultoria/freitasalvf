# SEO, semântica e crawlers de IA

Auditoria feita em 2026-08-19 sobre o build estático em `out/`.
Status: **diagnóstico fechado, nada implementado ainda.**

## O que um crawler recebe hoje

Todo o texto presente no HTML servido:

```
"Sincronizando Módulos 0 %"
```

37 caracteres.

| Item | Estado |
|---|---|
| `<h1>` / `<h2>` / `<h3>` | 0 |
| `<a href>` | 0 |
| `<section>`, `<nav>`, `<header>`, `<footer>`, `<article>` | 0 |
| `<main>` | 1 |
| `<title>` | `FreitasALVF` |
| `<meta name="description">` | ausente (string vazia em `layout.tsx`) |
| Open Graph / Twitter | 0 tags |
| canonical | ausente |
| JSON-LD | ausente |
| `robots.txt` / `sitemap.xml` / manifest | ausentes |
| `<html lang>` | `pt-BR` (ok) |

### Reproduzir a medição

```bash
npm run build
node -e "
const h=require('fs').readFileSync('out/index.html','utf8');
const t=h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<svg[\s\S]*?<\/svg>/gi,'');
const b=(t.match(/<body[\s\S]*<\/body>/i)||[''])[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
console.log(JSON.stringify(b), '\n', b.length, 'caracteres');
"
```

## Causa

Duas portas fechadas, não uma:

1. **Cortina de loading.** `page.tsx` inicia com `isAppLoading = true` e todo o resto está atrás
   de `!isAppLoading`. O prerender do build captura apenas o `LoadingCurtain`.

2. **Estado de navegação.** Mesmo após a cortina, `activeSection` renderiza uma seção por vez.
   Heritage, B2B, Educação, Metaverso e Storytelling só entram no DOM após clique.
   Blockchain saiu dessa lista: virou a rota `/blockchain`, com `<title>` e `description`
   próprios no HTML — o mesmo que já valia para `/solucoes-ia`. O corpo da página ainda
   depende de JS, mas a identidade da área agora existe estática.
   Crawler não clica.

Consequência: todo o texto real do site vive em `src/constants/*.ts` e nunca chega ao HTML.

## Busca vs. IA

| | Executa JS? | O que enxerga |
|---|---|---|
| Googlebot | sim | apenas a Hero |
| GPTBot, ClaudeBot, PerplexityBot | em geral **não** | os 37 caracteres |

Para busca, o site é uma página só. Para crawlers de IA, é praticamente invisível.
É por isso que texto estático no HTML é o item que realmente move o ponteiro.

## Plano

### Camada 1 — barata, sem tocar na experiência

Só adições ao `<head>` e arquivos novos. Risco zero para as animações.

- Preencher `description`, `openGraph`, `twitter`, `metadataBase`, canonical em `src/app/layout.tsx`
- `src/app/robots.ts` e `src/app/sitemap.ts` — a Metadata API do Next funciona com
  `output: 'export'` e gera arquivos estáticos no build
- **JSON-LD** (`Organization` / `ProfessionalService` / `Person`) com serviços, trajetória e links.
  Peso desproporcional para IA e painéis de conhecimento; é uma tag no layout
- Um `<h1>` real — hoje o nome da marca existe só dentro do SVG, invisível como texto

Resolve identidade e descoberta. **Não** resolve conteúdo: os 37 caracteres continuam 37.

### Camada 2 — a correção de verdade

Dar URL própria para cada área. Com `output: 'export'` cada rota vira um HTML estático
prerenderizado com o texto real dentro, alimentado pelos mesmos `src/constants/*.ts`.
A experiência animada continua como está.

Ganho extra: links compartilháveis. Hoje o site inteiro é uma URL só.

### Descartado

- **`<noscript>` com o conteúdo** — buscadores dão peso baixo e o comportamento entre crawlers
  de IA é irregular. Serve como complemento, não como solução.
- **Conteúdo oculto via CSS** para alimentar crawler — é cloaking, risco de penalização.

### Talvez

- **`llms.txt`** — convenção emergente, custo quase nulo, mas adoção ainda irregular.
  Complemento, não estratégia.

## Bloqueio

Falta definir o **domínio canônico**. Nos fontes aparecem `alvf.net.br` e
`storytellingnaia.alvf.net.br`; um commit antigo cita `naia.freitasalvf.net`.
`canonical`, `og:url`, `metadataBase` e o sitemap dependem dessa definição.
