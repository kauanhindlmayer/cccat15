import Cpf from "../../src/domain/valueObject/Cpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Should test if cpf is valid: %s",
  async (cpf: string) => {
    expect(new Cpf(cpf).getValue()).toBe(cpf);
  }
);

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Should throw an error for invalid cpf: %s",
  async (cpf: any) => {
    expect(() => new Cpf(cpf)).toThrow("Invalid cpf");
  }
);
