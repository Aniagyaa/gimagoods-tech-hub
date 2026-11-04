import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { updateCustomerProfile, changeCustomerPassword } from "@/lib/customer-auth.functions";
import { Field } from "@/routes/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./PasswordInput";

export function CustomerSettings() {
  const { profile, refreshProfile } = useAuth();
  const save = useServerFn(updateCustomerProfile); const change = useServerFn(changeCustomerPassword);
  const [fullName, setFullName] = useState(profile?.full_name ?? ""); const [username, setUsername] = useState(profile?.username ?? "");
  const [passwords, setPasswords] = useState({ currentPassword: "", password: "", confirm: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent, password: boolean) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const result = password ? await change({ data: passwords }) : await save({ data: { fullName, username } });
      if (result.error) { setError(result.error); return; }
      if (password) setPasswords({ currentPassword: "", password: "", confirm: "" }); else await refreshProfile();
      toast.success(password ? "Password changed successfully." : "Profile updated successfully.");
    } catch { setError("Please check your details and try again."); } finally { setBusy(false); }
  }
  return <div className="mt-7 max-w-lg space-y-8">
    <form className="space-y-4" onSubmit={(event) => submit(event, false)}><h2 className="text-xl font-bold">Edit Profile</h2><Field label="Full Name"><Input value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={100}/></Field><Field label="Username"><Input value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} maxLength={80}/></Field><Field label="Contact"><Input value={profile?.contact ?? ""} readOnly/></Field><Button disabled={busy} type="submit">Save Profile</Button></form>
    <form className="space-y-4" onSubmit={(event) => submit(event, true)}><h2 className="text-xl font-bold">Change Password</h2><Field label="Current Password"><PasswordInput value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required autoComplete="current-password"/></Field><Field label="New Password"><PasswordInput value={passwords.password} onChange={(event) => setPasswords({ ...passwords, password: event.target.value })} required minLength={8} autoComplete="new-password"/></Field><Field label="Confirm New Password"><PasswordInput value={passwords.confirm} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} required minLength={8} autoComplete="new-password"/></Field><Button disabled={busy} type="submit">Change Password</Button></form>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}