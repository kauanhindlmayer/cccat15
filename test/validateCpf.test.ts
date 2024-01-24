import { validateCpf } from "../src/validateCpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Should test if cpf is valid: %s",
  async function (cpf: string) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
  }
);

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Should test if cpf is invalid: %s",
  async function (cpf: any) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
  }
);
