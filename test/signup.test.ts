import { signup } from "../src/signup";

test("should create a new driver account", async () => {
  // Given
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isPassenger: false,
    isDriver: true,
  };

  // When
  const result = await signup(input);

  // Then
  expect(result.accountId).toBeDefined();
});

test("should create a new passenger account", async () => {
  // Given
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
    isDriver: false,
  };

  // When
  const result = await signup(input);

  // Then
  expect(result.accountId).toBeDefined();
});
