# `imagens/loja/` — Fotos dos produtos

Fotos dos produtos da loja.

## Convenção de nomes

Usa o **slug** do produto.

- **Foto principal (capa):** `imagens/loja/<slug>.jpg`
  - ex.: `imagens/loja/t-shirt-scv-1989.jpg`
- **Várias fotos do mesmo produto:** cria uma subpasta com o slug:
  - `imagens/loja/t-shirt-scv-1989/1.jpg`, `.../2.jpg`, `.../3.jpg`

No produto, define:

```
cover_url = /imagens/loja/t-shirt-scv-1989.jpg
images    = ["/imagens/loja/t-shirt-scv-1989/1.jpg", "/imagens/loja/t-shirt-scv-1989/2.jpg"]
```

## Recomendações

- Proporção **quadrada 1:1** (ex.: 1200×1200 px), fundo limpo e consistente.
- `.webp` ou `.jpg`, < 400 KB.
