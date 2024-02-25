import Account from "../../domain/entity/Account";
import IAccountRepository from "../../infrastructure/repository/AccountRepository";

export default class GetAccount {
  constructor(readonly accountDAO: IAccountRepository) {}

  async execute(accountId: string): Promise<GetAccountOutput> {
    const account = await this.accountDAO.getById(accountId);
    if (!account) throw new Error("Account does not exist");
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.getCarPlate(),
    };
  }
}

interface GetAccountOutput {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
}
