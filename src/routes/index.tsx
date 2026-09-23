import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealsBanner, Newsletter, ProductSections, TrustStrip, WhyGimaTech } from "@/components/home/StoreSections";
import heroImage from "@/assets/gimatech-hero.jpg";

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
      <section className="section-shell py-6 sm:py-10">
        <div className="relative min-h-[600px] overflow-hidden rounded-xl bg-muted sm:min-h-[640px] lg:min-h-[570px]">
          <img src={heroImage} alt="Modern laptop, keyboard, mouse and smartphone arranged on a clean technology workspace" width={1600} height={1072} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="relative flex min-h-[600px] max-w-2xl flex-col justify-end px-6 py-10 sm:min-h-[640px] sm:px-10 sm:py-14 lg:min-h-[570px] lg:justify-center lg:px-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-foreground/10 bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm"><Sparkles className="size-3.5 text-primary-strong" /> Ghana's technology destination</div>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">Power Your Digital Life</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-foreground/70 sm:text-lg">Quality technology, computer accessories and IT equipment—organized clearly and ready for delivery across supported locations in Ghana.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="#featured">Shop Now <ArrowRight /></a></Button><Button asChild variant="surface" size="lg"><a href="#categories">Explore Categories</a></Button></div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-foreground/60"><ShieldCheck className="size-4 text-primary-strong" /> Demo products and prices are shown for development only.</div>
          </div>
        </div>
      </section>
      <TrustStrip />
      <CategoryGrid />
      <ProductSections />
      <DealsBanner />
      <WhyGimaTech />
      <Newsletter />
    </main>
    <SiteFooter />
    <a href="#contact" aria-label="Open WhatsApp support options" className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-3.5 py-3 text-sm font-bold text-whatsapp-foreground shadow-xl transition hover:-translate-y-0.5 sm:px-4"><MessageCircle className="size-5" /><span className="hidden sm:inline">WhatsApp support</span></a>
  </div>;
}
