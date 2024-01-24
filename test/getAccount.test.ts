import { signup } from "../src/signup";
import { getAccount } from "../src/getAccount";
import crypto from "crypto";

test("should get an account by id if it exists", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const { accountId } = await signup(input);
  const account = await getAccount(accountId);
  expect(account).toEqual({
    account_id: accountId,
    name: input.name,
    email: input.email,
    cpf: input.cpf,
    car_plate: null,
    is_passenger: true,
    is_driver: false,
  });
});

test("should throw an error if account does not exist", async () => {
  const invalidId = crypto.randomUUID();
  await expect(() => getAccount(invalidId)).rejects.toThrow(
    "Account not found"
  );
});
