import { validateCarPlate } from "../../src/domain/validateCarPlate";

test.each(["ABC1234", "TRH4328", "KCO4309"])(
  `Should test if car plate is valid: %s`,
  async function (carPlate: string) {
    const isValid = validateCarPlate(carPlate);
    expect(isValid).toBe(true);
  }
);

test.each(["", undefined, null, "ABC12345", "ABC123456", "ABC1234567"])(
  `Should test if car plate is invalid: %s`,
  async function (carPlate: any) {
    const isValid = validateCarPlate(carPlate);
    expect(isValid).toBe(false);
  }
);
