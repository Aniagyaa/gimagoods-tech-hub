import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoAsset from "@/assets/gimatech-official-logo.png.asset.json";

const navItems = [
  { label: "Home", to: "/" as const }, { label: "Shop", to: "/shop" as const },
  { label: "Categories", to: "/shop" as const, search: { category: "all" } },
  { label: "Deals", to: "/shop" as const, search: { deals: true } },
  { label: "About", to: "/about" as const }, { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => `${product.name} ${product.brand} ${product.category} ${product.description} ${(product.keywords ?? []).join(" ")}`.toLowerCase().includes(normalized)).slice(0, 5);
  }, [query]);
  const submitSearch = (event: FormEvent) => { event.preventDefault(); const q = query.trim(); if (q) navigate({ to: "/shop", search: { q } }); setMenuOpen(false); };

  return <header className="sticky top-0 z-50 border-b border-border bg-charcoal/95 shadow-lg backdrop-blur-xl">
    <div className="border-b border-border bg-surface"><div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4 text-center text-[11px] font-semibold text-silver sm:justify-between sm:px-6 lg:px-8"><span>Technology. Simplified.</span><span className="hidden text-silver-muted sm:inline">Demo storefront · Ghana-focused shopping</span></div></div>
    <div className="mx-auto flex h-[70px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex h-12 w-[116px] shrink-0 items-center sm:w-[134px]" aria-label="GIMATech home"><img src={logoAsset.url} alt="GIMA Technologies" className="h-11 w-full object-contain object-left" /></Link>
      <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">{navItems.map((item) => <Link key={item.label} to={item.to} search={item.search} activeOptions={{ exact: item.to === "/" }} activeProps={{ className: "text-primary bg-primary-soft" }} inactiveProps={{ className: "text-silver hover:bg-muted hover:text-primary" }} className="rounded-md px-2.5 py-2 text-sm font-semibold transition-colors">{item.label}</Link>)}</nav>
      <form onSubmit={submitSearch} className="relative ml-auto hidden w-full max-w-xs md:block">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-silver-muted" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 border-border bg-card pl-9 pr-4 text-foreground shadow-none" placeholder="Search products, brands, categories..." aria-label="Search products" />
        {query && <div className="absolute right-0 top-12 w-full overflow-hidden rounded-md border border-border bg-popover p-2 shadow-2xl">{results.length ? results.map((product) => <Link key={product.id} to="/products/$productId" params={{ productId: product.id }} onClick={() => setQuery("")} className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-muted"><img src={product.image} alt="" className="size-11 rounded-md object-cover" /><span><strong className="block text-foreground">{product.name}</strong><span className="text-xs text-muted-foreground">{product.category} · {product.brand}</span></span></Link>) : <div className="px-3 py-5 text-center"><p className="text-sm font-semibold">No products found</p><Link to="/shop" className="mt-2 inline-block text-xs font-bold text-primary">Return to shop</Link></div>}</div>}
      </form>
      <div className="hidden items-center gap-1 sm:flex">
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="px-2 text-silver hover:text-primary" aria-label="Account"><UserRound /><span className="hidden xl:inline">{user ? `Hi, ${profile?.username ?? "Customer"}` : "Account"}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">{user ? <><DropdownMenuLabel>{profile?.full_name ?? "My Account"}</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/account">My Account</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/account" search={{ section: "orders" }}>My Orders</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/wishlist">Wishlist</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/account" search={{ section: "addresses" }}>Addresses</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/account" search={{ section: "settings" }}>Settings</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => signOut()}><LogOut /> Logout</DropdownMenuItem></> : <><DropdownMenuItem asChild><Link to="/login">Login</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/register">Create Account</Link></DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu>
        <Button asChild variant="ghost" size="icon"><Link to="/wishlist" aria-label="Wishlist"><Heart /></Link></Button>
        <Button asChild size="icon" className="relative"><Link to="/cart" aria-label={`Cart with ${itemCount} items`}><ShoppingBag />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full border-2 border-charcoal bg-silver px-1 text-[10px] font-extrabold text-charcoal">{itemCount > 99 ? "99+" : itemCount}</span>}</Link></Button>
      </div>
      <Button asChild size="icon" className="relative sm:hidden"><Link to="/cart" aria-label={`Cart with ${itemCount} items`}><ShoppingBag />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full border-2 border-charcoal bg-silver px-1 text-[10px] font-extrabold text-charcoal">{itemCount}</span>}</Link></Button>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
    </div>
    {menuOpen && <div className="border-t border-border bg-surface px-4 pb-5 pt-4 shadow-2xl lg:hidden"><form onSubmit={submitSearch} className="relative md:hidden"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 bg-card pl-9" placeholder="Search products, brands, categories..." aria-label="Search products" /></form><nav className="mt-3 grid grid-cols-2 gap-1">{navItems.map((item) => <Link key={item.label} to={item.to} search={item.search} onClick={() => setMenuOpen(false)} activeProps={{ className: "bg-primary-soft text-primary" }} className="rounded-md px-3 py-2.5 text-sm font-semibold text-silver hover:bg-muted hover:text-primary">{item.label}</Link>)}</nav><div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3"><Button asChild variant="outline"><Link to={user ? "/account" : "/login"}><UserRound />{user ? "My Account" : "Login"}</Link></Button><Button asChild variant="outline"><Link to="/wishlist"><Heart />Wishlist</Link></Button>{!user && <Button asChild className="col-span-2"><Link to="/register">Create Account</Link></Button>}</div></div>}
  </header>;
}