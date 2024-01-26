import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountDAO from "../src/AccountDAO";
import crypto from "crypto";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAO();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

test("should get an account by id if it exists", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const result = await signup.execute(input);
  const account = await getAccount.execute(result.accountId);
  expect(account).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
  expect(account?.isPassenger).toBe(true);
  expect(account?.isDriver).toBe(false);
  expect(account?.carPlate).toBeNull();
});

test("should return undefined if account does not exist", async () => {
  const invalidId = crypto.randomUUID();
  const account = await getAccount.execute(invalidId);
  expect(account).toBeNull();
});
