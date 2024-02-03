import IAccountRepository from "../../infrastructure/repository/AccountRepository";
import Account from "../../domain/Account";

// Use Case
export default class Signup {
  constructor(readonly accountRepository: IAccountRepository) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount) throw new Error("Email already in use");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      !!input.isPassenger,
      !!input.isDriver,
      input.carPlate
    );
    await this.accountRepository.save(account);
    return {
      accountId: account.accountId,
    };
  }
}

interface SignupInput {
  accountId?: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}

interface SignupOutput {
  accountId: string;
}
