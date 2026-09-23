import { Heart, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCedis } from "@/data/catalog";
import type { Product } from "@/types/commerce";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const discount = product.previousPrice ? Math.round((1 - product.price / product.previousPrice) * 100) : 0;
  return <article className={`group shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover ${compact ? "w-[76vw] max-w-[270px] lg:w-auto lg:max-w-none" : ""}`}>
    <div className="relative overflow-hidden bg-muted">
      <img src={product.image} alt={product.imageAlt} width={400} height={400} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      <div className="absolute left-3 top-3 flex gap-2">{discount > 0 && <Badge variant="offer">-{discount}%</Badge>}<Badge variant="outline" className="border-border/70 bg-background/90 text-[10px]">DEMO</Badge></div>
      <Button variant="surface" size="icon" className="absolute right-3 top-3" aria-label={`Add ${product.name} to wishlist`}><Heart /></Button>
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{product.brand} · {product.category}</span><span className="flex items-center gap-1"><Star className="size-3.5 fill-offer text-offer" /> {product.rating}</span></div>
      <h3 className="mt-2 min-h-11 font-display text-[15px] font-bold leading-snug">{product.name}</h3>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2"><span className="font-display text-lg font-bold text-primary-strong">{formatCedis(product.price)}</span>{product.previousPrice && <span className="text-xs text-muted-foreground line-through">{formatCedis(product.previousPrice)}</span>}</div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-success"><span className="size-1.5 rounded-full bg-success" /> Sample stock status</div>
      <Button className="mt-4 w-full" aria-label={`Add ${product.name} to cart`}><Plus /> Add to cart</Button>
    </div>
  </article>;
}
