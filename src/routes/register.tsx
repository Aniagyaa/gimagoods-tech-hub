import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { UserPlus } from "lucide-react";
import { AuthShell, Field } from "@/components/auth/AuthForm";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { customerRegistrationSchema, authErrorMessage } from "@/lib/validation";
import { registerCustomer } from "@/lib/customer-auth.functions";
export const Route=createFileRoute("/register")({head:()=>({meta:[{title:"Create Account — GIMATech"},{name:"description",content:"Create your GIMATech customer account with email and password for immediate access."},{property:"og:title",content:"Create a Customer Account — GIMATech"},{property:"og:description",content:"Join GIMATech with your name, email, contact number and username."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:RegisterPage});
function RegisterPage(){
 const register=useServerFn(registerCustomer);const navigate=useNavigate();const [values,setValues]=useState({fullName:"",email:"",contact:"",username:"",password:"",confirm:""});const [errors,setErrors]=useState<Record<string,string>>({});const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();const parsed=customerRegistrationSchema.safeParse(values);if(!parsed.success){const next:Record<string,string>={};for(const issue of parsed.error.issues)next[String(issue.path[0])]=issue.message;setErrors(next);return;}setErrors({});setBusy(true);
 try{const result=await register({data:values});if(result.error||!result.session){setErrors({form:result.error??"Unable to create your account."});return;}const {error}=await supabase.auth.setSession(result.session);if(error)throw error;await navigate({to:"/account"});}catch(e){setErrors({form:authErrorMessage(e instanceof Error?e.message:"Unable to connect.")});}finally{setBusy(false);}}
 return <AuthShell title="Create your GIMATech account" subtitle="Your technology journey starts here."><form onSubmit={submit} className="space-y-4" noValidate>
 <Field label="Full Name" error={errors['fullName']}><Input value={values.fullName} onChange={e=>setValues({...values,fullName:e.target.value})} placeholder="Enter your full name" autoComplete="name" className="h-11 bg-surface"/></Field>
 <Field label="Email Address" error={errors['email']}><Input type="email" value={values.email} onChange={e=>setValues({...values,email:e.target.value})} placeholder="Enter your email address" autoComplete="email" className="h-11 bg-surface"/></Field>
 <Field label="Contact Number" error={errors['contact']}><Input value={values.contact} onChange={e=>setValues({...values,contact:e.target.value})} placeholder="024 123 4567" inputMode="tel" autoComplete="tel" className="h-11 bg-surface"/></Field>
 <Field label="Username" error={errors['username']}><Input value={values.username} onChange={e=>setValues({...values,username:e.target.value})} placeholder="Choose a username" autoComplete="username" className="h-11 bg-surface"/></Field>
 <Field label="Password" error={errors['password']}><PasswordInput value={values.password} onChange={e=>setValues({...values,password:e.target.value})} placeholder="Create a password" autoComplete="new-password"/></Field>
 <Field label="Confirm Password" error={errors['confirm']}><PasswordInput value={values.confirm} onChange={e=>setValues({...values,confirm:e.target.value})} placeholder="Confirm your password" autoComplete="new-password"/></Field>
 {errors['form']&&<p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{errors['form']}</p>}
 <Button type="submit" size="lg" className="w-full" disabled={busy}><UserPlus/>{busy?"Creating account…":"Create Account"}</Button>
 <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-bold text-primary-strong hover:underline">Login</Link></p>
 </form></AuthShell>;
}
