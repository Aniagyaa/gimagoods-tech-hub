import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { z } from "zod";
import { AuthShell, Field } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage } from "@/lib/validation";
export const Route = createFileRoute("/forgot-password")({ head:()=>({meta:[{title:"Forgot Password — GIMATech"},{name:"description",content:"Request a password recovery email for your GIMATech account."},{property:"og:title",content:"Password Recovery — GIMATech"},{property:"og:description",content:"Recover access to your GIMATech account securely."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:ForgotPassword });
function ForgotPassword(){
 const [email,setEmail]=useState("");const [error,setError]=useState("");const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);
 async function submit(event:FormEvent){event.preventDefault();const parsed=z.string().trim().email().safeParse(email);if(!parsed.success){setError("Please enter a valid email address.");return;}setBusy(true);setError("");try{const {error}=await supabase.auth.resetPasswordForEmail(parsed.data,{redirectTo:`${window.location.origin}/reset-password`});if(error)throw error;setSent(true);}catch(e){setError(authErrorMessage(e instanceof Error?e.message:"Unable to connect."));}finally{setBusy(false);}}
 return <AuthShell title="Forgot your password?" subtitle="Recover your account.">{sent?<p role="status" className="text-sm leading-6">If this email belongs to an account, a password recovery email has been requested. Check your inbox and spam folder.</p>:<form onSubmit={submit} noValidate className="space-y-4"><Field label="Email Address"><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="Enter your email address" className="h-11 bg-surface"/></Field>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" size="lg" className="w-full" disabled={busy}><Mail/>{busy?"Requesting email…":"Send Recovery Email"}</Button></form>}<Button asChild variant="link" className="mt-4 w-full"><Link to="/login">Back to Login</Link></Button></AuthShell>;
}