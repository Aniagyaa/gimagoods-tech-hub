import type { ReactNode } from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function StorePage({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}