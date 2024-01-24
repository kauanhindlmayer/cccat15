import { signup } from "../src/signup";

test("should create a new driver account", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isDriver: true,
  };
  const result = await signup(input);
  expect(result.accountId).toBeDefined();
});

test("should create a new passenger account", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const result = await signup(input);
  expect(result.accountId).toBeDefined();
});

test("should throw an error if email is already in use", async () => {
  const input = {
    name: "John Doe",
    email: "john.doe@email.com",
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup(input)).rejects.toThrow("Email already in use");
});

test("should throw an error if name is invalid", async () => {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid name");
});

test("should throw an error if email is invalid", async () => {
  const input = {
    name: "John Doe",
    email: "john.doe",
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid email");
});

test("should throw an error if cpf is invalid", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-31",
    isPassenger: true,
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid cpf");
});

test("should throw an error if car plate is invalid", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC123",
    isDriver: true,
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid car plate");
});
