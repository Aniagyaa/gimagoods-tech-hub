import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock3, ArrowUpRight, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { businessContact, contactSchema } from "@/lib/contact";
import { submitContact } from "@/lib/contact.functions";
import { StorePage } from "@/components/layout/StorePage";

export const Route=createFileRoute("/contact")({head:()=>({meta:[{title:"Contact GIMATech — Ghana Technology Support"},{name:"description",content:"Contact GIMATech for product and shopping support in Ghana."},{property:"og:title",content:"Contact GIMATech"},{property:"og:description",content:"GIMATech product and shopping support."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:ContactPage});
function ContactPage() {
  const submit = useServerFn(submitContact);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    setSaved(false); setError("");
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your message details."); return; }
    setPending(true);
    try { await submit({ data: parsed.data }); setSaved(true); form.reset(); }
    catch (err) { setError(err instanceof Error ? err.message : "Your message could not be submitted."); }
    finally { setPending(false); }
  };
  return <StorePage><main className="section-shell py-12 sm:py-20"><p className="eyebrow">We’re here to help</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Contact Us</h1><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Have a question about a product or your shopping experience? Get in touch with the GIMATech team.</p>
    <div className="mt-12 grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-8">
      {[{ Icon: Phone, label: "Call us", value: businessContact.phone, href: businessContact.telephone }, { Icon: Mail, label: "Email us", value: businessContact.email, href: businessContact.emailLink }, { Icon: MapPin, label: "Our location", value: businessContact.location, href: undefined }, { Icon: Clock3, label: "Working days", value: businessContact.workingDays, href: undefined }].map(({ Icon, label, value, href }) => <div key={label} className="flex gap-4 border-b border-border pb-7"><span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-strong"><Icon className="size-5" /></span><div><h2 className="text-sm text-muted-foreground">{label}</h2>{href ? <a href={href} className="mt-1 inline-flex items-center gap-2 break-all text-lg font-bold hover:underline">{value}<ArrowUpRight className="size-4 shrink-0" /></a> : <p className="mt-1 text-lg font-bold">{value}</p>}</div></div>)}
    </div><form onSubmit={onSubmit} className="space-y-5"><h2 className="text-2xl font-bold">Send us a message</h2><div className="grid gap-5 sm:grid-cols-2">{[{ name: "fullName", label: "Full Name", type: "text", max: 100, auto: "name" }, { name: "email", label: "Email Address", type: "email", max: 255, auto: "email" }, { name: "phone", label: "Phone Number", type: "tel", max: 25, auto: "tel" }, { name: "subject", label: "Subject", type: "text", max: 150, auto: "off" }].map(({ name, label, type, max, auto }) => <div key={name}><label htmlFor={`contact-${name}`} className="mb-2 block text-sm font-semibold">{label}</label><Input id={`contact-${name}`} name={name} type={type} maxLength={max} autoComplete={auto} required disabled={pending} className="h-12 bg-card" /></div>)}</div><div><label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">Message</label><Textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} disabled={pending} className="bg-card" /></div><div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{saved && <p role="status" className="border-l-2 border-success bg-primary-soft p-4 text-sm text-foreground">Your message has been submitted to GIMATech. Thank you for getting in touch.</p>}<Button type="submit" size="lg" disabled={pending}><Send />{pending ? "Submitting…" : "Submit Message"}</Button></form></div>
  </main></StorePage>;
}