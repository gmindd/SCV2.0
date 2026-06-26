# `imagens/blog/` — Capas dos artigos

Foto de capa de cada artigo do blog.

## Convenção de nomes

Usa o **mesmo slug** do artigo. Exemplo:

- Artigo `scv-no-circuito-mundial` → `imagens/blog/scv-no-circuito-mundial.jpg`

Depois, no artigo (admin ou base de dados), define:

```
cover_url = /imagens/blog/scv-no-circuito-mundial.jpg
```

## Recomendações

- Proporção **16:9** (ex.: 1600×900 px) para encaixar nos cartões.
- `.webp` ou `.jpg`, < 400 KB.
