import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, Boxes, CircleDollarSign, ClipboardList, Headphones, LayoutDashboard, LogOut, Menu, PackageSearch, Settings, ShieldCheck, ShoppingBag, Star, Tags, Truck, Users, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSession } from "@/lib/admin.functions";
import logoAsset from "@/assets/gimatech-official-logo.png.asset.json";

const items = [
  ["Overview", "/admin/dashboard", "dashboard.view", LayoutDashboard], ["Analytics", "/admin/analytics", "analytics.view", BarChart3],
  ["Products", "/admin/products", "products.view", ShoppingBag], ["Categories", "/admin/categories", "categories.view", Tags],
  ["Inventory", "/admin/inventory", "inventory.view", Boxes], ["Orders", "/admin/orders", "orders.view", ClipboardList],
  ["Customers", "/admin/customers", "customers.view", Users], ["Reviews", "/admin/reviews", "reviews.view", Star],
  ["Finance", "/admin/finance", "finance.view", CircleDollarSign], ["Payments", "/admin/payments", "payments.view", WalletCards],
  ["Discounts", "/admin/discounts", "discounts.view", PackageSearch], ["Delivery", "/admin/delivery", "delivery.view", Truck],
  ["WhatsApp", "/admin/whatsapp", "whatsapp.view", Headphones], ["Staff", "/admin/staff", "staff.view", ShieldCheck],
  ["Settings", "/admin/settings", "settings.view", Settings],
] as const;

export function AdminShell({ children, requiredPermission }: { children: ReactNode; requiredPermission?: string | undefined }) {
  const getSession = useServerFn(getAdminSession); const navigate = useNavigate(); const location = useLocation(); const queryClient = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => getSession() });
  useEffect(() => { if (session.data?.must_change_password && location.pathname !== "/admin/change-password") navigate({ to: "/admin/change-password", replace: true }); }, [location.pathname, navigate, session.data?.must_change_password]);
  if (session.isLoading) return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Verifying administrator access…</div>;
  if (session.isError || !session.data) return <div className="grid min-h-screen place-items-center bg-background px-4 text-center"><div><ShieldCheck className="mx-auto size-10 text-destructive"/><h1 className="mt-4 text-2xl font-bold">Administrator access denied</h1><Button className="mt-6" asChild><Link to="/admin/login">Return to admin login</Link></Button></div></div>;
  if (requiredPermission && !session.data.permissions.includes(requiredPermission)) return <div className="grid min-h-screen place-items-center bg-background px-4 text-center"><div><ShieldCheck className="mx-auto size-10 text-destructive"/><h1 className="mt-4 text-2xl font-bold">Permission required</h1><p className="mt-2 text-sm text-muted-foreground">Your administrator role cannot access this area.</p><Button className="mt-6" asChild><Link to="/admin/dashboard">Return to dashboard</Link></Button></div></div>;
  const visible = items.filter(([, , permission]) => session.data.permissions.includes(permission));
  const logout = async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); navigate({ to: "/admin/login", replace: true }); };
  const navigation = <><div className="border-b border-border p-5"><img src={logoAsset.url} className="h-12 w-36 object-contain object-left" alt="GIMA Technologies"/><p className="mt-3 text-xs font-bold uppercase text-primary">Admin workspace</p></div><nav className="flex-1 space-y-1 overflow-y-auto p-3">{visible.map(([label, to, , Icon]) => { const linkClass="flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-semibold text-silver-muted transition-colors hover:bg-muted hover:text-primary"; return to === "/admin/dashboard" ? <Link key={to} to="/admin/dashboard" activeProps={{ className: "bg-primary-soft text-primary border-primary/50" }} className={linkClass}><Icon className="size-4"/>{label}</Link> : <Link key={to} to="/admin/$module" params={{module:to.replace("/admin/","")}} activeProps={{ className: "bg-primary-soft text-primary border-primary/50" }} className={linkClass}><Icon className="size-4"/>{label}</Link>; })}</nav><div className="border-t border-border p-4"><p className="truncate text-sm font-bold">{session.data.full_name}</p><p className="mt-1 text-xs text-primary">{session.data.role.replace("_", " ")}</p><Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}><LogOut/>Sign out</Button></div></>;
  return <div className="min-h-screen bg-background lg:grid lg:grid-cols-[250px_1fr]"><aside className="hidden min-h-screen flex-col border-r border-border bg-charcoal lg:flex">{navigation}</aside><main className="min-w-0"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6"><Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu/></Button></SheetTrigger><SheetContent side="left" className="flex w-[280px] flex-col border-border bg-charcoal p-0">{navigation}</SheetContent></Sheet><div><p className="text-sm font-bold text-foreground">GIMATech Administration</p><p className="text-xs text-muted-foreground">Secure business operations</p></div><span className="rounded-md border border-primary/30 bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">{session.data.role.replace("_", " ")}</span></header>{children}</main></div>;
}