import * as Icons from "lucide-react";
import { categories } from "@/data/catalog";

export function CategoryGrid() {
  return <section id="categories" className="section-shell py-16 sm:py-20">
    <div className="section-heading"><div><p className="eyebrow">Explore the range</p><h2>Shop by Category</h2><p>Find the technology you need, all in one place.</p></div><a href="#featured" className="section-link">View products <Icons.ArrowRight /></a></div>
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {categories.map((category) => { const Icon = Icons[category.icon as keyof typeof Icons] as typeof Icons.Laptop; return <a href="#featured" key={category.id} className="group rounded-lg border border-border bg-card p-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-card-hover"><span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary-strong"><Icon className="size-4.5" /></span><h3 className="mt-5 text-sm font-bold leading-tight">{category.name}</h3><p className="mt-1 hidden text-[11px] leading-4 text-muted-foreground sm:block">{category.description}</p><span className="mt-3 block text-[10px] font-semibold uppercase text-muted-foreground">{category.itemCount} demo items</span></a>})}
    </div>
  </section>;
}
