import { z } from "zod";

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (/^233[235]\d{8}$/.test(digits)) return `+${digits}`;
  if (/^0[235]\d{8}$/.test(digits)) return `+233${digits.slice(1)}`;
  return null;
};

export const customerCredentialsSchema = z.object({
  identifier: z.string().trim().min(1, "Please enter your email address or username.").max(254).transform(value => value.toLowerCase()),
  password: z.string().min(1, "Please enter your password.").max(200),
});
export const customerUsernameSchema = z.string().trim().min(3, "Username must be at least 3 characters.").max(80).regex(/^[a-zA-Z0-9_.-]+$/, "Use letters, numbers, dots, hyphens or underscores.");
export const customerRegistrationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(254).transform(value => value.toLowerCase()),
  username: customerUsernameSchema,
  contact: z.string().max(30).transform(normalizePhone).refine(value => value !== null, "Please enter a valid Ghana contact number."),
  fullName: z.string().trim().min(1, "Please enter your full name.").max(100),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(200),
  confirm: z.string().min(1, "Please confirm your password."),
}).refine(data => data.password === data.confirm, { path: ["confirm"], message: "Passwords do not match." });
export const isCustomerAccount = (profile: { account_status: string } | null, roles: { role: string }[] | null) => Boolean(profile?.account_status === "active" && roles?.some(row => row.role === "CUSTOMER") && !roles?.some(row => row.role === "ADMIN" || row.role === "SUPER_ADMIN"));
export const recoveryPasswordSchema = z.object({password:z.string().min(8,"Password must contain at least 8 characters.").max(200),confirm:z.string()}).refine(data=>data.password===data.confirm,{path:["confirm"],message:"Passwords do not match."});
export const safeCustomerDestination = (value?: string) => value && /^\/(?!\/)/.test(value) && !/[\\\r\n]/.test(value) && !value.startsWith("/admin") ? value : "/account";
export const authErrorMessage = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes("invalid login") || text.includes("invalid username")) return "Invalid email, username or password.";
  if (text.includes("email address is not allowed") || text.includes("email address is invalid")) return "Please use a real email address that can receive password recovery messages.";
  if (text.includes("username already")) return "Username already exists.";
  if (text.includes("contact number already")) return "Contact number already registered.";
  if (text.includes("rate") || text.includes("too many")) return "Too many attempts. Please wait 15 minutes and try again.";
  if (text.includes("fetch") || text.includes("network") || text.includes("connect")) return "Unable to connect to authentication service.";
  if (text.includes("already registered") || text.includes("already exists")) return "An account already exists for this email address.";
  if (text.includes("password")) return "Please use a stronger password with at least 8 characters.";
  return "We could not complete that request. Please check your details and try again.";
};