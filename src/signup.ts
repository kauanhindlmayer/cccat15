import crypto from "crypto";
import {
  validateName,
  validateEmail,
  validateCpf,
  validateCarPlate,
} from "./utils";
import IAccountDAO from "./AccountDAO";

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

export default class Signup {
  // Port
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    input.accountId = crypto.randomUUID();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Email already in use");
    if (!validateName(input.name)) throw new Error("Invalid name");
    if (!validateEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !validateCarPlate(input.carPlate!))
      throw new Error("Invalid car plate");
    await this.accountDAO.save(input);
    return {
      accountId: input.accountId,
    };
  }
}
