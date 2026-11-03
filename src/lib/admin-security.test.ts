import { describe, expect, test } from "bun:test";
import { adminPasswordChangeSchema, assertAdminReady } from "./admin-security";

describe("administrator security", () => {
  test("first login cannot access operational data before changing the password", () => {
    expect(() => assertAdminReady({ status: "active", must_change_password: true }, true)).toThrow();
  });
  test("disabled administrators cannot access operational data", () => {
    expect(() => assertAdminReady({ status: "disabled", must_change_password: false }, true)).toThrow();
  });
  test("missing permission denies access even after password setup", () => {
    expect(() => assertAdminReady({ status: "active", must_change_password: false }, false)).toThrow();
  });
  test("active authorized administrators may access operational data", () => {
    expect(() => assertAdminReady({ status: "active", must_change_password: false }, true)).not.toThrow();
  });
  test("temporary password cannot be reused", () => {
    expect(adminPasswordChangeSchema.safeParse({ currentPassword: "example-current-password", password: "example-current-password" }).success).toBe(false);
  });
});