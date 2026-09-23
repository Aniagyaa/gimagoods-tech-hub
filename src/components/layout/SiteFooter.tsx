import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";

const groups = [
  { title: "Quick links", links: ["Home", "Shop", "Categories", "Deals", "About", "Contact"] },
  { title: "Customer service", links: ["My Account", "Track Order", "Delivery Information", "Returns & Refunds", "FAQs"] },
  { title: "Popular categories", links: ["Laptops", "Networking", "Accessories", "Storage", "Smartphones", "Audio", "Security"] },
];

export function SiteFooter() {
  const socialLinks = [
    { Icon: Facebook, label: "Facebook" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Music2, label: "TikTok" },
    { Icon: MessageCircle, label: "WhatsApp" },
  ];

  return <footer id="contact" className="bg-foreground text-background">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.2fr_1fr_1.2fr_1fr] lg:px-8">
      <div><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary text-lg font-black text-primary-foreground">G</span><span className="font-display text-xl font-bold">GIMATech</span></div><p className="mt-4 max-w-xs text-sm leading-6 text-background/60">Your trusted technology store. Everything tech, thoughtfully selected for Ghana.</p><div className="mt-5 flex gap-2">{socialLinks.map(({ Icon, label }) => <a key={label} href="#contact" aria-label={label} className="grid size-9 place-items-center rounded-md border border-background/15 text-background/70 transition hover:border-primary hover:text-primary"><Icon className="size-4" /></a>)}</div></div>
      {groups.slice(0,2).map((group) => <div key={group.title}><h3 className="text-xs font-bold uppercase text-primary">{group.title}</h3><ul className="mt-4 space-y-2.5">{group.links.map((link) => <li key={link}><a className="text-sm text-background/65 hover:text-primary" href="#top">{link}</a></li>)}</ul></div>)}
      <div><h3 className="text-xs font-bold uppercase text-primary">Contact</h3><div className="mt-4 space-y-2.5 text-sm text-background/65"><p>Phone number coming soon</p><p>Email address coming soon</p><p>Ghana · Location to be confirmed</p><p>Business hours to be confirmed</p></div><h3 className="mt-6 text-xs font-bold uppercase text-primary">Popular categories</h3><p className="mt-3 text-sm leading-6 text-background/65">{groups[2].links.join(" · ")}</p></div>
    </div>
    <div className="border-t border-background/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-background/45 sm:flex-row sm:justify-between sm:px-6 lg:px-8"><span>© 2026 GIMATech. All rights reserved.</span><span>Demo storefront · Sample inventory, prices and availability</span></div></div>
  </footer>;
}
