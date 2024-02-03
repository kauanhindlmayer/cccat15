import crypto from "crypto";
import { validateName } from "./validateName";
import { validateEmail } from "./validateEmail";
import { validateCpf } from "./validateCpf";
import { validateCarPlate } from "./validateCarPlate";

export default class Account {
  private constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string
  ) {
    if (!validateName(name)) throw new Error("Invalid name");
    if (!validateEmail(email)) throw new Error("Invalid email");
    if (!validateCpf(cpf)) throw new Error("Invalid cpf");
    if (isDriver && carPlate && !validateCarPlate(carPlate!))
      throw new Error("Invalid car plate");
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ) {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    );
  }
}
