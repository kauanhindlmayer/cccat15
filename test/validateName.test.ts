import { validateName } from "../src/utils";

test.each(["John Doe", "João da Silva", "João da Silva Neto"])(
  `Should test if name is valid: %s`,
  async function (name: string) {
    const isValid = validateName(name);
    expect(isValid).toBe(true);
  }
);

test.each(["", undefined, null, "João"])(
  `Should test if name is invalid: %s`,
  async function (name: any) {
    const isValid = validateName(name);
    expect(isValid).toBe(false);
  }
);
