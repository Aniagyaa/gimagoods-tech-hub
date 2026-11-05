import { z } from "zod";

export const businessContact = {
  phone: "0598809921",
  telephone: "tel:+233598809921",
  email: "gimaTech@gmail.com",
  emailLink: "mailto:gimaTech@gmail.com",
  location: "Koforidua, Ghana",
  workingDays: "Monday – Saturday",
  whatsapp: "https://wa.me/233598809921",
} as const;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  phone: z.string().trim().min(7, "Enter your phone number.").max(25).regex(/^\+?[0-9 ()-]+$/, "Enter a valid phone number."),
  subject: z.string().trim().min(2, "Please enter a subject.").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(5000),
  website: z.string().max(0, "Message could not be submitted."),
});