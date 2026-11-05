import { describe, expect, it } from "vitest";
import { businessContact, contactSchema } from "./contact";

const valid = { fullName: "Test Customer", email: "test@example.com", phone: "0598809921", subject: "Product enquiry", message: "Please tell me about this laptop.", website: "" };
describe("official contact and message validation", () => {
  it("uses the official Ghana phone link", () => { expect(businessContact.telephone).toBe("tel:+233598809921"); });
  it("uses the official email link", () => { expect(businessContact.emailLink).toBe("mailto:gimaTech@gmail.com"); });
  it("uses the supplied location without a street address", () => { expect(businessContact.location).toBe("Koforidua, Ghana"); });
  it("uses the supplied working days", () => { expect(businessContact.workingDays).toBe("Monday – Saturday"); });
  it("requires every contact field", () => { for (const key of ["fullName", "email", "phone", "subject", "message"]) expect(contactSchema.safeParse({ ...valid, [key]: "" }).success).toBe(false); });
  it("rejects invalid email addresses", () => { expect(contactSchema.safeParse({ ...valid, email: "not-email" }).success).toBe(false); });
  it("accepts a complete message", () => { expect(contactSchema.safeParse(valid).success).toBe(true); });
  it("rejects filled bot trap fields", () => { expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false); });
});