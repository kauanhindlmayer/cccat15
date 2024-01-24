import { validateEmail } from "../src/utils";

test.each([
  "user@example.com",
  "user123@example.co.uk",
  "john.doe@mydomain.net",
  "test.email123@company.org",
  "valid_email123@sub.domain.co",
])("Should test if email is valid: %s", async function (email: string) {
  const isValid = validateEmail(email);
  expect(isValid).toBe(true);
});

test.each([
  "",
  undefined,
  null,
  "test",
  "test@",
  "test@domain",
  "test@domain.",
  "test@.com",
  "test@com",
  "test@.com.",
])("Should test if email is invalid: %s", async function (email: any) {
  const isValid = validateEmail(email);
  expect(isValid).toBe(false);
});
