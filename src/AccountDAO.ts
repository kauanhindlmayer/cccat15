import { connection } from "./databaseConnection";

// Port
export default interface IAccountDAO {
  save(account: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
  getById(accountId: string): Promise<any>;
}

// Adapter Database
export default class AccountDAO implements IAccountDAO {
  async save(account: any) {
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
  }

  async getByEmail(email: string) {
    const [account] = await connection.query(
      "select * from cccat15.account where email = $1",
      [email]
    );
    if (!account) return null;
    return this.mapAccount(account);
  }

  async getById(accountId: string) {
    const [account] = await connection.query(
      "select * from cccat15.account where account_id = $1",
      [accountId]
    );
    if (!account) return null;
    return this.mapAccount(account);
  }

  mapAccount(account: any) {
    return {
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.car_plate,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
    };
  }
}

// Adapter In Memory
// export class AccountDAOInMemory implements IAccountDAO {
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
