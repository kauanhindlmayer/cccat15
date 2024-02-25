import crypto from "crypto";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import AccountModel from "../../src/infrastructure/orm/AccountModel";
import ORM from "../../src/infrastructure/orm/ORM";
import Account from "../../src/domain/entity/Account";

test("should test ORM", async () => {
  // Given
  const accountId = crypto.randomUUID();
  const accountModel = new AccountModel(
    accountId,
    "John Doe",
    "john.doe@gmail.com",
    "111.111.111-11",
    "",
    true,
    false
  );
  // When
  const connection = new PgPromiseAdapter();
  const orm = new ORM(connection);
  await orm.save(accountModel);
  // Then
  const savedAccountModel = await orm.findBy(
    AccountModel,
    "account_id",
    accountId
  );
  expect(savedAccountModel.name).toEqual("John Doe");
  expect(savedAccountModel.email).toEqual("john.doe@gmail.com");
  expect(savedAccountModel.cpf).toEqual("111.111.111-11");
  expect(savedAccountModel.carPlate).toEqual("");
  await connection.close();
});

test("should test ORM with real aggregate", async () => {
  // Given
  const accountId = crypto.randomUUID();
  const account = Account.restore(
    accountId,
    "John Doe",
    `john.doe${Math.random()}@email.com`,
    "968.896.412-30",
    true,
    false,
    ""
  );
  const accountModel = AccountModel.fromAggregate(account);
  // When
  const connection = new PgPromiseAdapter();
  const orm = new ORM(connection);
  await orm.save(accountModel);
  // Then
  const savedAccountModel = await orm.findBy(
    AccountModel,
    "account_id",
    accountId
  );
  expect(savedAccountModel.name).toEqual(accountModel.name);
  expect(savedAccountModel.email).toEqual(accountModel.email);
  expect(savedAccountModel.cpf).toEqual(accountModel.cpf);
  expect(savedAccountModel.carPlate).toEqual(accountModel.carPlate);
  await connection.close();
});
