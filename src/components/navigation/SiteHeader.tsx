import { useMemo, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/catalog";

const navItems = ["Home", "Shop", "Categories", "Deals", "About", "Contact"];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase().includes(normalized)).slice(0, 5);
  }, [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="border-b border-border/60 bg-foreground text-background">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4 text-center text-[11px] font-semibold sm:justify-between sm:px-6 lg:px-8">
          <span>Technology. Simplified.</span>
          <span className="hidden text-background/65 sm:inline">Demo storefront · Ghana-focused delivery experience</span>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="GIMATech home">
          <span className="grid size-9 place-items-center rounded-lg bg-foreground text-lg font-black text-primary">G</span>
          <span className="font-display text-lg font-bold">GIMA<span className="text-primary-strong">Tech</span></span>
        </a>
        <nav className="ml-3 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item} href={item === "Home" ? "#top" : `#${item.toLowerCase()}`} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{item}</a>)}
        </nav>
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 bg-muted/70 pl-9 pr-4 shadow-none" placeholder="Search products, brands, categories…" aria-label="Search products" />
          {query && <div className="absolute right-0 top-12 w-full rounded-lg border border-border bg-popover p-2 shadow-xl">
            {results.length ? results.map((product) => <a key={product.id} href="#featured" onClick={() => setQuery("")} className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-muted"><img src={product.image} alt="" className="size-11 rounded-md object-cover" /><span><strong className="block">{product.name}</strong><span className="text-xs text-muted-foreground">{product.category} · {product.brand}</span></span></a>) : <p className="px-3 py-5 text-center text-sm text-muted-foreground">No products found. Try another search.</p>}
          </div>}
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <Button variant="ghost" size="icon" aria-label="Account"><UserRound /></Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist"><Heart /></Button>
          <Button variant="secondary" size="icon" aria-label="Cart"><ShoppingBag /></Button>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <div className="border-t border-border bg-background px-4 pb-5 pt-4 lg:hidden">
        <div className="relative md:hidden"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 bg-muted/70 pl-9" placeholder="Search tech…" /></div>
        <nav className="mt-3 grid grid-cols-2 gap-1">{navItems.map((item) => <a key={item} href={item === "Home" ? "#top" : `#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted">{item}</a>)}</nav>
        <div className="mt-3 flex gap-2 border-t border-border pt-3"><Button variant="outline" className="flex-1"><UserRound /> Account</Button><Button variant="outline" className="flex-1"><Heart /> Wishlist</Button><Button className="flex-1"><ShoppingBag /> Cart</Button></div>
      </div>}
    </header>
  );
}
