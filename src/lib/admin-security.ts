import { z } from "zod";

export const adminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  password: z.string().min(10).max(200),
}).refine((data) => data.password !== data.currentPassword, {
  message: "Choose a different password from your temporary password.",
});

export function assertAdminReady(account: { status: string; must_change_password: boolean } | null, allowed: boolean) {
  if (!account || account.status !== "active" || account.must_change_password || !allowed) {
    throw new Error("Administrator permission denied. Complete password setup before continuing.");
  }
}