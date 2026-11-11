// Slim product records inlined as <script type="application/json" id="catalogue-data"> for client scripts.
// Paths are resolved relative to the page that inlines them.
export function slimProducts(ctx, products = ctx.data.products) {
  return products.map((p) => ({
    slug: p.slug, name: p.name, kind: p.kind, gamme: p.gamme, family: p.family,
    lead: p.lead || p.description?.[0] || '',
    img: ctx.asset(`img/cut/${p.img}.webp`),
    href: ctx.link(`produits/${p.slug}.html`),
    key: p.key,
  }));
}
