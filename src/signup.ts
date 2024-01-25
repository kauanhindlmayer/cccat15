import crypto from "crypto";
import {
  validateName,
  validateEmail,
  validateCpf,
  validateCarPlate,
} from "./utils";
import { SignupInput, SignupOutput } from "../types/signup.interfaces";
import IAccountDAO from "./AccountDAO";

export default class Signup {
  // Port
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    input.id = crypto.randomUUID();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Email already in use");
    if (!validateName(input.name)) throw new Error("Invalid name");
    if (!validateEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !validateCarPlate(input.carPlate!))
      throw new Error("Invalid car plate");
    this.accountDAO.save(input);
    return {
      accountId: input.id,
    };
  }
}
