import IAccountDAO from "./AccountDAO";

export interface Account {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver: boolean;
}

export default class GetAccount {
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(accountId: string): Promise<Account | null> {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
