# `public/` — Ficheiros estáticos do site

Tudo o que está nesta pasta é servido na **raiz** do site. Exemplo: o ficheiro
`public/imagens/loja/t-shirt.jpg` fica acessível em `/imagens/loja/t-shirt.jpg`.

## Organização

| Pasta | O que colocar |
|---|---|
| `logo/` | Logótipos do clube (versão a cor, branca, símbolo) |
| `icones/` | Favicons e ícones do site (16x16, 32x32, apple-touch) |
| `marca/` | Imagem Open Graph (partilha em redes sociais) e elementos de marca |
| `imagens/hero/` | Imagens grandes de cabeçalho/fundo |
| `imagens/blog/` | Capas dos artigos do blog |
| `imagens/agenda/` | Capas dos eventos da agenda |
| `imagens/loja/` | Fotos dos produtos da loja |
| `imagens/escola/` | Imagens da página Escola |
| `imagens/alto-rendimento/` | Imagens do Centro de Alto Rendimento |
| `imagens/galeria/` | Fotos da comunidade / galeria |
| `videos/` | Vídeos usados no site |

## Regras gerais de nomes

- Tudo em **minúsculas**, sem espaços nem acentos, palavras separadas por `-`.
  - ✔️ `open-cabedelo-2026.jpg`  ❌ `Open Cabedelo 2026.JPG`
- Para conteúdo do blog/agenda/loja, usa o **mesmo slug** do artigo/evento/produto.
  - Artigo com slug `scv-no-circuito-mundial` → capa `imagens/blog/scv-no-circuito-mundial.jpg`
- Formatos recomendados: **`.webp`** ou `.jpg` para fotos, **`.svg`** ou `.png` para logos/ícones.

## Imagens locais vs. Supabase Storage

Há duas formas de ligar uma imagem ao conteúdo dinâmico (blog, agenda, loja):

1. **Local (esta pasta):** no campo `cover_url` põe um caminho que começa por `/`,
   ex.: `/imagens/blog/scv-no-circuito-mundial.jpg`.
2. **Supabase Storage:** no campo `cover_url` põe o URL público devolvido pelo Supabase.

O site aceita as duas. Para começar rápido, usa as pastas locais; mais tarde podes
migrar para o Supabase sem mudar código.
