import { Phone, Mail, MapPin, Clock3, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { businessContact } from "@/lib/contact";
import logoAsset from "@/assets/gimatech-official-logo.png.asset.json";

const popularCategories = ["Laptops", "Networking", "Accessories", "Storage", "Smartphones", "Audio", "Security"];

export function SiteFooter() {
  return <footer id="contact" className="dark-band border-t border-border bg-charcoal text-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.2fr_1fr_1.2fr_1fr] lg:px-8">
       <div><img src={logoAsset.url} alt="GIMA Technologies" className="h-auto w-44 object-contain object-left" /><p className="mt-3 font-display text-sm font-bold text-primary">Technology. Simplified.</p><p className="mt-3 max-w-xs text-sm leading-6 text-silver-muted">Your technology store in Koforidua. Everything tech, thoughtfully selected for Ghana.</p><a href={businessContact.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-primary"><MessageCircle className="size-4" /> WhatsApp support</a></div>
       <div><h3 className="text-xs font-bold uppercase text-primary">Quick links</h3><ul className="mt-4 space-y-2.5 text-sm text-muted-foreground"><li><Link to="/">Home</Link></li><li><Link to="/shop">Shop</Link></li><li><Link to="/shop" search={{category:"all"}}>Categories</Link></li><li><Link to="/shop" search={{deals:true}}>Demo Deals</Link></li><li><Link to="/about">About Us</Link></li><li><Link to="/contact">Contact Us</Link></li><li><Link to="/account">My Account</Link></li><li><Link to="/privacy">Privacy Policy</Link></li><li><Link to="/terms">Terms &amp; Conditions</Link></li></ul></div>
       <div><h3 className="text-xs font-bold uppercase text-primary">Product categories</h3><ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">{popularCategories.map(category => <li key={category}><Link to="/shop" search={{category}}>{category}</Link></li>)}</ul></div>
       <div><h3 className="text-xs font-bold uppercase text-primary">Contact Us</h3><div className="mt-4 space-y-4 text-sm text-silver-muted"><a href={businessContact.telephone} className="flex items-center gap-3 hover:text-primary"><Phone className="size-4 shrink-0" />{businessContact.phone}</a><a href={businessContact.emailLink} className="flex items-center gap-3 break-all hover:text-primary"><Mail className="size-4 shrink-0" />{businessContact.email}</a><p className="flex items-center gap-3"><MapPin className="size-4 shrink-0" />{businessContact.location}</p><p className="flex items-center gap-3"><Clock3 className="size-4 shrink-0" />{businessContact.workingDays}</p></div></div>
    </div>
     <div className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8"><span>© 2026 GIMATech. All rights reserved.</span><span>Demo storefront · Sample inventory, prices and availability</span></div></div>
  </footer>;
}
