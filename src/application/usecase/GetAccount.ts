import Account from "../../domain/Account";
import IAccountRepository from "../../infrastructure/repository/AccountRepository";

export default class GetAccount {
  constructor(readonly accountDAO: IAccountRepository) {}

  async execute(accountId: string): Promise<Account> {
    const account = await this.accountDAO.getById(accountId);
    if (!account) throw new Error("Account does not exist");
    return account;
  }
}
