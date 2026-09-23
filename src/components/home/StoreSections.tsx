import { BadgeCheck, CircleDollarSign, Headphones, LockKeyhole, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/catalog";
import { ProductCard } from "@/components/products/ProductCard";
import setupBanner from "@/assets/setup-banner.jpg";

export function TrustStrip() {
  const items = [
    [BadgeCheck, "Quality products", "Trusted technology, clearly specified."],
    [LockKeyhole, "Secure shopping", "A protected shopping experience."],
    [Truck, "Delivery in Ghana", "Regions and rates will be configurable."],
    [Headphones, "Helpful support", "Get guidance before and after buying."],
  ] as const;
  return <section aria-label="Store benefits" className="border-y border-border bg-background"><div className="section-shell grid grid-cols-2 gap-px bg-border py-px lg:grid-cols-4">{items.map(([Icon, title, text]) => <div key={title} className="flex gap-3 bg-background px-3 py-6 sm:px-6"><Icon className="mt-0.5 size-5 shrink-0 text-primary-strong" /><div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}</div></section>;
}

export function ProductSections() {
  return <>
    <section id="featured" className="section-shell py-16 sm:py-20"><div className="section-heading"><div><p className="eyebrow">Demo collection</p><h2>Featured Products</h2><p>Every item shown is sample data for storefront development.</p></div><a href="#trending" className="section-link">See trending</a></div><div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">{products.filter((p) => p.featured).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section id="trending" className="bg-muted/60"><div className="section-shell py-16 sm:py-20"><div className="section-heading"><div><p className="eyebrow">Popular demo products</p><h2>Trending in Tech</h2><p>Popular technology products customers are checking out.</p></div><span className="hidden text-xs font-semibold text-muted-foreground sm:block">Swipe on mobile →</span></div><div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">{products.filter((p) => p.trending).slice(0,4).map((product) => <ProductCard key={product.id} product={product} compact />)}</div></div></section>
  </>;
}

export function DealsBanner() {
  return <section id="deals" className="section-shell py-16 sm:py-20"><div className="relative overflow-hidden rounded-xl bg-foreground text-background"><img src={setupBanner} alt="A complete professional desk setup with dual monitors, laptop, keyboard and audio equipment" width={1600} height={800} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center opacity-70" /><div className="relative max-w-xl px-6 py-16 sm:px-10 sm:py-20"><span className="inline-flex rounded-md bg-offer px-2.5 py-1 text-xs font-bold text-offer-foreground">SPECIAL OFFERS</span><h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Upgrade Your Setup</h2><p className="mt-4 max-w-md text-sm leading-6 text-background/70">Discover selected technology products at special demo prices. Live offers will appear when the catalogue is connected.</p><Button variant="light" size="lg" className="mt-7">Shop deals</Button></div></div></section>;
}

export function WhyGimaTech() {
  const points = [[PackageCheck,"Genuine products","Clear specifications and sourcing information."],[CircleDollarSign,"Great value","Competitive, transparent prices in Ghana Cedis."],[MapPin,"Convenient shopping","Browse from anywhere and prepare for local delivery."],[Headphones,"Customer support","Guidance before and after your purchase."],[ShieldCheck,"Secure checkout ready","Built for a trusted payment experience in a later phase."]] as const;
  return <section id="about" className="section-shell py-16 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">A better way to buy tech</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Why GIMATech?</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A focused technology store for students, professionals, schools, businesses and everyday users across Ghana.</p></div><div className="grid gap-3 sm:grid-cols-2">{points.map(([Icon,title,text], index) => <div key={title} className={`flex gap-4 rounded-lg border border-border bg-card p-5 ${index === 4 ? "sm:col-span-2" : ""}`}><span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-strong"><Icon className="size-5" /></span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div></div>)}</div></div></section>;
}

export function Newsletter() {
  return <section className="bg-primary-soft"><div className="section-shell flex flex-col gap-7 py-12 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow">GIMATech updates</p><h2 className="font-display text-3xl font-bold">Stay Ahead of the Tech</h2><p className="mt-2 text-sm text-muted-foreground">Get updates about new products, special deals and technology offers.</p></div><form className="flex w-full max-w-lg flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()}><Input type="email" required placeholder="Enter your email" className="h-11 bg-background" aria-label="Email address" /><Button type="submit" size="lg">Subscribe</Button></form></div></section>;
}
