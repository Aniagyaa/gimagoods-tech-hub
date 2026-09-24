import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatCedis } from "@/data/catalog";
import type { Product } from "@/types/commerce";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const discount = product.previousPrice ? Math.round((1 - product.price / product.previousPrice) * 100) : 0;
  const { addItem } = useCart(); const wishlist = useWishlist(); const saved = wishlist.isSaved(product.id);
  return <article className={`group shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/55 hover:shadow-card-hover ${compact ? "w-[76vw] max-w-[270px] lg:w-auto lg:max-w-none" : ""}`}>
    <div className="relative overflow-hidden bg-muted"><Link to="/products/$productId" params={{ productId: product.id }} aria-label={`View ${product.name}`}><img src={product.image} alt={product.imageAlt} width={400} height={400} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.06]" /></Link><div className="absolute left-3 top-3 flex gap-2">{discount > 0 && <Badge variant="offer">-{discount}%</Badge>}<Badge variant="outline" className="border-border/70 bg-background/90 text-[10px]">DEMO</Badge></div><Button variant="surface" size="icon" onClick={() => wishlist.toggle(product.id)} className={`absolute right-3 top-3 ${saved ? "border-primary bg-primary text-primary-foreground" : "opacity-90 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"}`} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}><Heart className={saved ? "fill-current" : ""} /></Button></div>
    <div className="p-4"><div className="flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{product.brand} · {product.category}</span><span className="flex items-center gap-1"><Star className="size-3.5 fill-offer text-offer" /> {product.rating}</span></div><h3 className="mt-2 min-h-11 font-display text-[15px] font-bold leading-snug"><Link to="/products/$productId" params={{ productId: product.id }} className="hover:text-primary">{product.name}</Link></h3><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p><div className="mt-3 flex flex-wrap items-baseline gap-2"><span className="font-display text-lg font-bold text-primary">{formatCedis(product.price)}</span>{product.previousPrice && <span className="text-xs text-muted-foreground line-through">{formatCedis(product.previousPrice)}</span>}</div><div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-success"><span className="size-1.5 rounded-full bg-success" /> Sample stock status</div><Button className="mt-4 w-full" onClick={() => addItem(product.id)} aria-label={`Add ${product.name} to cart`}><Plus /> Add to cart</Button></div>
  </article>;
}