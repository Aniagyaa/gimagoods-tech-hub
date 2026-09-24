import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import logoAsset from "@/assets/gimatech-official-logo.png.asset.json";

const groups = [
  { title: "Quick links", links: ["Home", "Shop", "Categories", "Deals", "About Us", "Contact Us"] },
  { title: "Customer service", links: ["My Account", "Track Order", "FAQs", "Delivery Information", "Returns & Refunds", "Privacy Policy", "Terms & Conditions"] },
  { title: "Popular categories", links: ["Laptops", "Networking", "Accessories", "Storage", "Smartphones", "Audio", "Security"] },
];
const popularCategories = ["Laptops", "Networking", "Accessories", "Storage", "Smartphones", "Audio", "Security"];

export function SiteFooter() {
  const socialLinks = [
    { Icon: Facebook, label: "Facebook" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Music2, label: "TikTok" },
    { Icon: MessageCircle, label: "WhatsApp" },
  ];

  return <footer id="contact" className="border-t border-primary/20 bg-charcoal text-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.2fr_1fr_1.2fr_1fr] lg:px-8">
       <div><img src={logoAsset.url} alt="GIMA Technologies" className="h-auto w-44 object-contain object-left" /><p className="mt-3 font-display text-sm font-bold text-primary">Technology. Simplified.</p><p className="mt-3 max-w-xs text-sm leading-6 text-silver-muted">Your trusted technology store. Everything tech, thoughtfully selected for Ghana.</p><div className="mt-5 flex flex-wrap gap-2">{socialLinks.map(({ Icon, label }) => <a key={label} href="#contact" aria-label={label} className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-glow-soft"><Icon className="size-4" /></a>)}</div></div>
       {groups.slice(0,2).map((group) => <div key={group.title}><h3 className="text-xs font-bold uppercase text-primary">{group.title}</h3><ul className="mt-4 space-y-2.5">{group.links.map((link) => <li key={link}><a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#top">{link}</a></li>)}</ul></div>)}
       <div><h3 className="text-xs font-bold uppercase text-primary">Contact</h3><div className="mt-4 space-y-2.5 text-sm text-muted-foreground"><p>Phone number coming soon</p><p>Email address coming soon</p><p>Ghana · Location to be confirmed</p><p>Business hours to be confirmed</p></div><h3 className="mt-6 text-xs font-bold uppercase text-primary">Categories</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{popularCategories.join(" · ")} · Gaming</p></div>
    </div>
     <div className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8"><span>© 2026 GIMATech. All rights reserved.</span><span>Demo storefront · Sample inventory, prices and availability</span></div></div>
  </footer>;
}
