import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeAdminPasswordChange } from "@/lib/admin.functions";

export const Route=createFileRoute("/_admin/admin/change-password")({head:()=>({meta:[{title:"Change Temporary Password — GIMATech"},{name:"description",content:"Secure GIMATech administrator password update."},{property:"og:title",content:"Change Temporary Password — GIMATech"},{property:"og:description",content:"Secure administrator password update."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:ChangePassword});

function ChangePassword(){
  const navigate=useNavigate(); const queryClient=useQueryClient(); const complete=useServerFn(completeAdminPasswordChange);
  const[current,setCurrent]=useState(""); const[p,setP]=useState(""); const[c,setC]=useState(""); const[e,setE]=useState(""); const[busy,setBusy]=useState(false);
  const submit=async(ev:FormEvent)=>{ev.preventDefault();setE("");if(p.length<10)return setE("Use at least 10 characters for your new password.");if(p!==c)return setE("The passwords do not match.");setBusy(true);try{await complete({data:{password:p,currentPassword:current}});await queryClient.invalidateQueries({queryKey:["admin-session"]});toast.success("Password changed securely");navigate({to:"/admin/dashboard",replace:true});}catch{setE("Your password could not be updated. Check your current password and choose a different, strong new password.");}finally{setBusy(false);}};
  return <AdminShell><div className="mx-auto max-w-xl p-4 py-12 sm:p-8"><form onSubmit={submit} className="rounded-lg border border-primary/30 bg-card p-6 shadow-card sm:p-8"><p className="eyebrow">Required security step</p><h1 className="mt-2 text-3xl font-bold">Change your temporary password</h1><p className="mt-3 text-sm text-muted-foreground">Please change your temporary password before continuing.</p><div className="mt-7 space-y-2"><Label htmlFor="current-password">Current password</Label><Input id="current-password" required type="password" value={current} onChange={x=>setCurrent(x.target.value)} autoComplete="current-password"/></div><div className="mt-7 space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" required type="password" value={p} onChange={x=>setP(x.target.value)} autoComplete="new-password"/></div><div className="mt-5 space-y-2"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" required type="password" value={c} onChange={x=>setC(x.target.value)} autoComplete="new-password"/></div>{e&&<p className="mt-4 text-sm text-destructive">{e}</p>}<Button className="mt-6 w-full" size="lg" disabled={busy}>{busy?"Updating…":"Change Password"}</Button></form></div></AdminShell>;
}