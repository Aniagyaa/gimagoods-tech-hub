import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { getContactMessages } from "@/lib/contact.functions";
import { Button } from "@/components/ui/button";

export function ContactInbox() {
  const getMessages = useServerFn(getContactMessages);
  const messages = useQuery({ queryKey: ["admin-contact-messages"], queryFn: () => getMessages() });
  return <section className="mt-10"><h2 className="flex items-center gap-2 text-xl font-bold"><Mail className="size-5" />Contact messages</h2>{messages.isPending ? <p className="mt-4 text-muted-foreground">Loading messages…</p> : messages.isError ? <div className="mt-4"><p role="alert" className="text-destructive">Messages could not be loaded.</p><Button variant="outline" className="mt-3" onClick={() => messages.refetch()}>Try again</Button></div> : !messages.data?.length ? <p className="mt-4 text-muted-foreground">No contact messages yet.</p> : <div className="mt-5 space-y-4">{messages.data.map(message => <article key={message.id} className="rounded-lg border border-border bg-card p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold">{message.subject}</h3><time className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString("en-GB")}</time></div><p className="mt-2 text-sm font-semibold">{message.full_name}</p><div className="mt-1 flex flex-wrap gap-4 text-sm text-primary-strong"><a href={`mailto:${encodeURIComponent(message.email)}`}>{message.email}</a><a href={`tel:${message.phone.replace(/[^+0-9]/g, "")}`}>{message.phone}</a></div><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{message.message}</p></article>)}</div>}</section>;
}