import pgp from "pg-promise";

// Port
export default interface IAccountDAO {
  save(account: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
  getById(id: string): Promise<any>;
}

// Adapter Database
export default class AccountDAO implements IAccountDAO {
  async save(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.id,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
    await connection.$pool.end();
  }

  async getByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(
      "select * from cccat15.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return account;
  }

  async getById(id: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(
      "select * from cccat15.account where account_id = $1",
      [id]
    );
    await connection.$pool.end();
    return account;
  }
}

// Adapter In Memory
export class AccountDAOInMemory implements IAccountDAO {
  private accounts: any[] = [];

  async save(account: any) {
    this.accounts.push(account);
  }

  async getByEmail(email: string) {
    return this.accounts.find((account) => account.email === email);
  }

  async getById(id: string) {
    return this.accounts.find((account) => account.id === id);
  }
}
