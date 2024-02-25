import Account from "../../domain/entity/Account";
import IDatabaseConnection from "../database/DatabaseConnection";
import AccountModel from "../orm/AccountModel";
import ORM from "../orm/ORM";

// Port
// Como agora está fazendo mediação de objetos de domínio, faz
// sentido que seja chamado de Repository ao invés de DAO
export default interface IAccountRepository {
  save(account: Account): Promise<void>;
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account | undefined>;
}

// Database Adapter
export default class AccountRepository implements IAccountRepository {
  constructor(readonly connection: IDatabaseConnection) {}

  async save(account: Account): Promise<void> {
    await this.connection.query(
      "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.accountId,
        account.getName(),
        account.getEmail(),
        account.getCpf(),
        account.getCarPlate(),
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat15.account where email = $1",
      [email]
    );
    if (!account) return;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate
    );
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat15.account where account_id = $1",
      [accountId]
    );
    if (!account) return;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate
    );
  }
}

// ORM Adapter
export class AccountRepositoryORM implements IAccountRepository {
  orm: ORM;

  constructor(readonly connection: IDatabaseConnection) {
    this.orm = new ORM(connection);
  }

  async save(account: Account) {
    await this.orm.save(AccountModel.fromAggregate(account));
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const account = await this.orm.findBy(AccountModel, "email", email);
    if (!account) return;
    const aggregate = account.getAggregate();
    return aggregate;
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const account = await this.orm.findBy(
      AccountModel,
      "account_id",
      accountId
    );
    if (!account) return;
    const aggregate = account.getAggregate();
    return aggregate;
  }
}

// In Memory Adapter
// export class AccountRepositoryInMemory implements IAccountRepository {
//   private accounts: any[] = [];

//   async save(account: any) {
//     this.accounts.push(account);
//   }

//   async getByEmail(email: string) {
//     return this.accounts.find((account) => account.email === email);
//   }

//   async getById(id: string) {
//     return this.accounts.find((account) => account.id === id);
//   }
// }
