import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogIn } from "lucide-react";
import { z } from "zod";
import { AuthShell, Field } from "@/components/auth/AuthForm";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { customerCredentialsSchema, authErrorMessage, safeCustomerDestination } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";
import { loginCustomer } from "@/lib/customer-auth.functions";
export const Route = createFileRoute("/login")({ validateSearch: z.object({redirect:z.string().optional()}), head:()=>({meta:[{title:"Login — GIMATech"},{name:"description",content:"Sign in to GIMATech with your email address or username and password."},{property:"og:title",content:"Customer Login — GIMATech"},{property:"og:description",content:"Access your private GIMATech customer account."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}), component: LoginPage });
function LoginPage() {
 const login=useServerFn(loginCustomer); const navigate=useNavigate(); const search=Route.useSearch(); const {user}=useAuth();
 const [values,setValues]=useState({identifier:"",password:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent) { e.preventDefault(); const parsed=customerCredentialsSchema.safeParse(values); if(!parsed.success){setError(parsed.error.issues[0]?.message??"Check your details.");return;} setError("");setBusy(true);
 try { const result=await login({data:parsed.data}); if(result.error||!result.session){setError(result.error??"Unable to sign in.");return;} const {error}=await supabase.auth.setSession(result.session);if(error)throw error;await navigate({to:safeCustomerDestination(search.redirect)}); }
 catch(e){setError(authErrorMessage(e instanceof Error?e.message:"Unable to connect."));}finally{setBusy(false);} }
 return <AuthShell title="Welcome back to GIMATech" subtitle="Your customer account.">{user?<Button asChild className="w-full"><Link to="/account">Open My Account</Link></Button>:<form onSubmit={submit} className="space-y-4" noValidate>
 <Field label="Email Address or Username"><Input value={values.identifier} onChange={e=>setValues({...values,identifier:e.target.value})} placeholder="Email address or username" autoComplete="username" className="h-11 bg-surface"/></Field>
 <Field label="Password"><PasswordInput value={values.password} onChange={e=>setValues({...values,password:e.target.value})} autoComplete="current-password" placeholder="Enter your password"/></Field>
 <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-primary-strong hover:underline">Forgot Password?</Link></div>
 {error&&<p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
 <Button type="submit" size="lg" className="w-full" disabled={busy}><LogIn/>{busy?"Signing in…":"Login"}</Button>
 <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="font-bold text-primary-strong hover:underline">Create Account</Link></p>
 </form>}</AuthShell>;
}
