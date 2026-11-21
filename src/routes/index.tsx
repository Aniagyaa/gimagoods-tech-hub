import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealsBanner, ProductSections, TrustStrip, WhyGimaTech } from "@/components/home/StoreSections";
import heroImage from "@/assets/gimatech-bright-workspace.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GIMATech Ghana — Technology. Simplified." },
      { name: "description", content: "Discover laptops, networking equipment, storage, accessories and more from GIMATech, a technology-focused store built for Ghana." },
      { property: "og:title", content: "GIMATech Ghana — Technology. Simplified." },
      { property: "og:description", content: "A modern Ghanaian technology store for students, professionals, businesses and everyday users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div id="top" className="min-h-screen overflow-x-clip bg-background">
    <SiteHeader />
    <main>
      <section className="dark-band relative min-h-[560px] overflow-hidden border-b border-border bg-charcoal sm:min-h-[570px] lg:min-h-[540px]">
          <img src={heroImage} alt="Bright professional technology workspace with laptop, networking equipment, keyboard, mouse, smartphone and headphones" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[64%_center] lg:object-center" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="section-shell relative flex min-h-[560px] flex-col justify-end py-12 sm:min-h-[570px] sm:py-16 lg:min-h-[540px] lg:justify-center">
            <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-brand-lemon/50 bg-brand-lemon px-3 py-1.5 text-xs font-bold text-brand-brown backdrop-blur"><Sparkles className="size-3.5 text-brand-brown" /> Ghana's technology destination</div>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-bold leading-[1.08] text-foreground sm:text-6xl">GIMATech<span className="mt-3 block text-3xl leading-tight sm:text-4xl">Everything Tech.<br /><span className="text-brand-orange">One Place.</span></span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-silver-muted sm:text-lg">Discover laptops, computers, networking equipment, accessories and more — all in one place.</p>
             <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link to="/shop">Shop Now <ArrowRight /></Link></Button><Button asChild variant="secondary" size="lg"><Link to="/shop" search={{ category: "all" }}>Explore Categories</Link></Button></div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-silver-muted"><ShieldCheck className="size-4 text-primary" /> Demo products and prices are shown for development only.</div>
            </div>
          </div>
      </section>
      <CategoryGrid />
      <TrustStrip />
      <ProductSections />
      <DealsBanner />
      <WhyGimaTech />
    </main>
    <SiteFooter />
    <a href="https://wa.me/233598809921" target="_blank" rel="noopener noreferrer" aria-label="Contact GIMATech on WhatsApp" className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-3.5 py-3 text-sm font-bold text-whatsapp-foreground shadow-xl transition hover:-translate-y-1 hover:shadow-glow sm:px-4"><MessageCircle className="size-5" /><span className="hidden sm:inline">WhatsApp support</span></a>
  </div>;
}
