import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { adminPasswordChangeSchema, assertAdminReady } from "./admin-security";

describe("administrator security", () => {
  test("first login cannot access operational data before changing the password", () => {
    assert.throws(() => assertAdminReady({ status: "active", must_change_password: true }, true));
  });
  test("disabled administrators cannot access operational data", () => {
    assert.throws(() => assertAdminReady({ status: "disabled", must_change_password: false }, true));
  });
  test("missing permission denies access even after password setup", () => {
    assert.throws(() => assertAdminReady({ status: "active", must_change_password: false }, false));
  });
  test("active authorized administrators may access operational data", () => {
    assert.doesNotThrow(() => assertAdminReady({ status: "active", must_change_password: false }, true));
  });
  test("temporary password cannot be reused", () => {
    assert.equal(adminPasswordChangeSchema.safeParse({ currentPassword: "example-current-password", password: "example-current-password" }).success, false);
  });
});