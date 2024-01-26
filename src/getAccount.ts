import IAccountDAO from "./AccountDAO";

export default class GetAccount {
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
