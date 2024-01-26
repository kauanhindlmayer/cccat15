import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";
import AccountDAO from "../src/AccountDAO";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAO();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

test("should create a new driver account", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isDriver: true,
  };
  const result = await signup.execute(input);
  expect(result.accountId).toBeDefined();
  const account = await getAccount.execute(result.accountId);
  expect(account).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
  expect(account?.isDriver).toBe(true);
  expect(account?.carPlate).toBe(input.carPlate);
  expect(account?.isPassenger).toBe(false);
});

test("should create a new passenger account", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const result = await signup.execute(input);
  expect(result.accountId).toBeDefined();
  const account = await getAccount.execute(result.accountId);
  expect(account).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
  expect(account?.isPassenger).toBe(true);
  expect(account?.isDriver).toBe(false);
  expect(account?.carPlate).toBeNull();
});

test("should throw an error if email is already in use", async () => {
  const input = {
    name: "John Doe",
    email: "john.doe@email.com",
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    "Email already in use"
  );
});

test("should throw an error if name is invalid", async () => {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid name");
});

test("should throw an error if email is invalid", async () => {
  const input = {
    name: "John Doe",
    email: "john.doe",
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid email");
});

test("should throw an error if cpf is invalid", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-31",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid cpf");
});

test("should throw an error if car plate is invalid", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@email.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC123",
    isDriver: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    "Invalid car plate"
  );
});
