import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field } from "@/components/auth/AuthForm";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { recoveryPasswordSchema } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";
export const Route=createFileRoute("/reset-password")({head:()=>({meta:[{title:"Reset Password — GIMATech"},{name:"description",content:"Set a new GIMATech password using your secure recovery email."},{property:"og:title",content:"Set Your New Password — GIMATech"},{property:"og:description",content:"Restore access to your GIMATech account."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:ResetPassword});
function ResetPassword(){
 // Auth consumes type=recovery and clears the fragment before rendering; the
 // shared listener retains the verified PASSWORD_RECOVERY event, not a URL flag.
 const {recoverySession,user,loading}=useAuth();const ready=recoverySession&&Boolean(user);const checked=!loading;
 const [done,setDone]=useState(false);const [values,setValues]=useState({password:"",confirm:""});const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();if(!ready)return;const parsed=recoveryPasswordSchema.safeParse(values);if(!parsed.success){setError(parsed.error.issues[0]?.message??"Check your password.");return;}setBusy(true);setError("");try{const {error}=await supabase.auth.updateUser({password:parsed.data.password});if(error)throw error;setValues({password:"",confirm:""});setDone(true);}catch{setError("Your password could not be updated. Request a new recovery email or choose a stronger password.");}finally{setBusy(false);}}
 return <AuthShell title="Set a new password" subtitle="Your GIMATech account.">{!checked?<p className="text-sm text-muted-foreground">Checking recovery access…</p>:done?<div><p role="status" className="text-sm">Your password has been changed.</p><Button asChild className="mt-5"><Link to="/account">Open My Account</Link></Button></div>:!ready?<div><p role="alert" className="text-sm text-destructive">Open this page from a valid password recovery email.</p><Button asChild className="mt-5"><Link to="/forgot-password">Request Recovery Email</Link></Button></div>:<form onSubmit={submit} className="space-y-4" noValidate><Field label="New Password"><PasswordInput value={values.password} onChange={e=>setValues({...values,password:e.target.value})} autoComplete="new-password"/></Field><Field label="Confirm New Password"><PasswordInput value={values.confirm} onChange={e=>setValues({...values,confirm:e.target.value})} autoComplete="new-password"/></Field>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" size="lg" className="w-full" disabled={busy}>{busy?"Saving…":"Save New Password"}</Button></form>}</AuthShell>;
}