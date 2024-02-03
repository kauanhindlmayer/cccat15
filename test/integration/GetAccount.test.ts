import Signup from "../../src/application/usecase/Signup";
import GetAccount from "../../src/application/usecase/GetAccount";
import AccountRepository from "../../src/infrastructure/repository/AccountRepository";
import crypto from "crypto";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";

let connection: IDatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepository(connection);
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);
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

afterEach(async () => {
  await connection.close();
});
