import crypto from "crypto";
import Name from "../valueObject/Name";
import Email from "../valueObject/Email";
import CarPlate from "../valueObject/CarPlate";
import Cpf from "../valueObject/Cpf";

export default class Account {
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate?: CarPlate;

  private constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    carPlate?: string
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    if (isDriver && carPlate) {
      this.carPlate = new CarPlate(carPlate);
    }
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

  setName(name: string) {
    // Value Objects são imutáveis, então não é possível alterar o valor de name
    // precisamos criar um novo Name
    this.name = new Name(name);
  }

  public getName(): string {
    return this.name.getValue();
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getCpf(): string {
    return this.cpf.getValue();
  }

  public getCarPlate(): string | undefined {
    return this.carPlate?.getValue();
  }
}
