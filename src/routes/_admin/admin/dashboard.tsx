import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Heart, Info, UserPlus, Users, type LucideIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getAdminAnalytics } from "@/lib/admin.functions";
import { products } from "@/data/catalog";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  head: () => ({ meta: [
    { title: "Admin Dashboard — GIMATech" },
    { name: "description", content: "GIMATech administrator analytics and operational overview." },
    { property: "og:title", content: "Admin Dashboard — GIMATech" },
    { property: "og:description", content: "Secure GIMATech administrator overview." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchAnalytics = useServerFn(getAdminAnalytics);
  const query = useQuery({ queryKey: ["admin-analytics"], queryFn: () => fetchAnalytics() });
  return (
    <AdminShell requiredPermission="dashboard.view">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Operational overview</p><h1 className="mt-2 text-3xl font-bold">Dashboard</h1><p className="mt-2 text-sm text-muted-foreground">Live customer and wishlist data. Demo catalog values are clearly separated.</p></div>
          <span className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">Updated when this page loads</span>
        </div>
        {query.isLoading ? <LoadingMetrics /> : query.isError || !query.data ? <AnalyticsError /> : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric icon={Users} label="Total customers" value={query.data.customers} />
              <Metric icon={UserPlus} label="New customers · 30 days" value={query.data.newCustomers} />
              <Metric icon={Heart} label="Wishlist saves" value={query.data.wishlistSaves} note={`${query.data.wishlistAdoption}% customer adoption`} />
              <Metric icon={Info} label="Demo catalog products" value={products.length} note="Not live inventory" />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-lg font-bold">Customer registrations</h2><p className="mt-1 text-xs text-muted-foreground">Recorded customer profiles by month</p>
                {query.data.registrations.length ? (
                  <ChartContainer config={{ customers: { label: "Customers", color: "var(--primary)" } }} className="mt-6 h-[260px] w-full">
                    <AreaChart data={query.data.registrations}><CartesianGrid vertical={false}/><XAxis dataKey="month" tickLine={false} axisLine={false}/><ChartTooltip content={<ChartTooltipContent/>}/><Area dataKey="customers" type="monotone" fill="var(--color-customers)" fillOpacity={0.2} stroke="var(--color-customers)" strokeWidth={2}/></AreaChart>
                  </ChartContainer>
                ) : <Empty label="No customer registration history yet." />}
              </section>
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-lg font-bold">Most wishlisted</h2><p className="mt-1 text-xs text-muted-foreground">Live saves matched to the demo catalog</p>
                <div className="mt-5 space-y-3">{query.data.popularWishlist.length ? query.data.popularWishlist.map((item) => { const product = products.find((entry) => entry.id === item.productId); return <div key={item.productId} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-3"><div><p className="text-sm font-semibold">{product?.name ?? item.productId}</p><p className="text-xs text-muted-foreground">{product?.brand ?? "Catalog item"}</p></div><span className="font-bold text-primary">{item.saves}</span></div>; }) : <Empty label="No wishlist activity yet." />}</div>
              </section>
            </div>
            <section className="mt-6 rounded-lg border border-border bg-surface p-5">
              <h2 className="text-lg font-bold">Metrics awaiting connected business data</h2><p className="mt-1 text-sm text-muted-foreground">These figures remain unavailable until orders, payments and inventory are connected. No values are fabricated.</p>
              <div className="mt-4 flex flex-wrap gap-2">{query.data.unavailable.map((label) => <span key={label} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-silver-muted">{label} · Unavailable</span>)}</div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  );
}

function LoadingMetrics() { return <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-28 animate-pulse rounded-lg border border-border bg-card"/>)}</div>; }
function AnalyticsError() { return <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 p-6"><h2 className="font-bold">Analytics unavailable</h2><p className="mt-2 text-sm text-muted-foreground">Live operational data could not be loaded. Try again shortly.</p></div>; }
function Metric({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: number; note?: string }) { return <div className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-extrabold text-foreground">{value.toLocaleString()}</p>{note && <p className="mt-1 text-xs text-offer">{note}</p>}</div><span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="size-5"/></span></div></div>; }
function Empty({ label }: { label: string }) { return <div className="mt-6 grid min-h-40 place-items-center rounded-md border border-dashed border-border text-sm text-muted-foreground">{label}</div>; }