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
  return <section aria-label="Store benefits" className="border-y border-border bg-surface"><div className="section-shell grid grid-cols-2 gap-px bg-border py-px lg:grid-cols-4">{items.map(([Icon, title, text]) => <div key={title} className="flex gap-3 bg-surface px-3 py-6 sm:px-6"><Icon className="mt-0.5 size-5 shrink-0 text-primary" /><div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}</div></section>;
}

export function ProductSections() {
  return <>
    <section id="featured" className="section-shell py-16 sm:py-24"><div className="section-heading"><div><p className="eyebrow">Demo collection</p><h2>Featured Products</h2><p>Every item shown is sample data for storefront development.</p></div><a href="#trending" className="section-link">See trending</a></div><div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">{products.filter((p) => p.featured).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section id="trending" className="bg-surface"><div className="section-shell py-16 sm:py-24"><div className="section-heading"><div><p className="eyebrow">Popular demo products</p><h2>Trending in Tech</h2><p>Explore technology products customers are checking out.</p></div><span className="hidden text-xs font-semibold text-muted-foreground sm:block">Swipe on mobile →</span></div><div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">{products.filter((p) => p.trending).slice(0,4).map((product) => <ProductCard key={product.id} product={product} compact />)}</div></div></section>
  </>;
}

export function DealsBanner() {
  return <section id="deals" className="section-shell py-16 sm:py-24"><div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-charcoal text-foreground shadow-card"><img src={setupBanner} alt="A complete professional desk setup with dual monitors, laptop, keyboard and audio equipment" width={1600} height={800} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center opacity-35 transition duration-700 group-hover:scale-[1.02]" /><div className="absolute inset-0 bg-deal-overlay"/><div className="relative max-w-xl px-6 py-16 sm:px-10 sm:py-20"><span className="inline-flex rounded-md bg-offer px-2.5 py-1 text-xs font-bold text-offer-foreground">SPECIAL OFFERS</span><h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Upgrade Your Setup</h2><p className="mt-4 max-w-md text-sm leading-6 text-silver-muted">Discover selected technology products at special prices. Live offers will appear when the catalogue is connected.</p><Button size="lg" className="mt-7">Shop Deals</Button></div></div></section>;
}

export function WhyGimaTech() {
  const points = [[PackageCheck,"Quality Technology","Carefully selected technology products."],[CircleDollarSign,"Great Value","Competitive prices across our product range."],[ShieldCheck,"Secure Shopping","A safe and reliable shopping experience."],[MapPin,"Convenient Delivery","Get your technology delivered conveniently."],[Headphones,"Customer Support","We're here to help before and after your purchase."]] as const;
  return <section id="about" className="section-shell py-16 sm:py-24"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Technology with confidence</p><h2 className="font-display text-3xl font-bold sm:text-4xl">Why Shop With GIMATech?</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A focused technology store for students, professionals, schools, businesses and everyday users across Ghana.</p></div><div className="grid gap-3 sm:grid-cols-2">{points.map(([Icon,title,text], index) => <div key={title} className={`group flex gap-4 rounded-lg border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow-soft ${index === 4 ? "sm:col-span-2" : ""}`}><span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div></div>)}</div></div></section>;
}

export function Newsletter() {
  return <section className="relative overflow-hidden border-y border-primary/20 bg-surface"><div className="cta-grid absolute inset-0 opacity-30"/><div className="section-shell relative flex flex-col gap-7 py-16 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow">GIMATech updates</p><h2 className="font-display text-3xl font-bold">Stay Ahead of Technology</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Get updates about new products, exclusive deals and the latest technology available at GIMATech.</p></div><form className="flex w-full max-w-lg flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()}><Input type="email" required placeholder="Enter your email" className="h-11 border-border bg-background" aria-label="Email address" /><Button type="submit" size="lg">Subscribe</Button></form></div></section>;
}
