import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  isValidSecretCode,
  verifySessionToken
} from "./auth";

describe("auth", () => {
  it("accepts the exact configured secret code", () => {
    expect(isValidSecretCode("abc123", "abc123")).toBe(true);
  });

  it("rejects missing or different secret codes", () => {
    expect(isValidSecretCode("", "abc123")).toBe(false);
    expect(isValidSecretCode("wrong", "abc123")).toBe(false);
  });

  it("creates verifiable session tokens bound to the secret", () => {
    const token = createSessionToken("abc123");

    expect(verifySessionToken(token, "abc123")).toBe(true);
    expect(verifySessionToken(token, "changed")).toBe(false);
  });
});
