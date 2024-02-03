import crypto from "crypto";
import { validateCpf } from "./validateCpf";

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
    if (!this.isNameValid(name)) throw new Error("Invalid name");
    if (!this.isEmailValid(email)) throw new Error("Invalid email");
    if (!validateCpf(cpf)) throw new Error("Invalid cpf");
    if (isDriver && carPlate && !this.isCarPlateValid(carPlate))
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

  private isNameValid(name: string) {
    const nameRegex = /[a-zA-Z] [a-zA-Z]+/;
    return name.match(nameRegex);
  }

  private isEmailValid(email: string) {
    const emailRegex = /^(.+)@(.+)$/;
    return email.match(emailRegex);
  }

  private isCarPlateValid(carPlate: string) {
    const carPlateRegex = /[A-Z]{3}[0-9]{4}/;
    return carPlate.match(carPlateRegex);
  }
}
