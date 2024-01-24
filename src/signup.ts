import crypto from "crypto";
import pgp from "pg-promise";
import {
  validateName,
  validateEmail,
  validateCpf,
  validateCarPlate,
} from "./utils";
import { SignupInput, SignupOutput } from "../types/signup.interfaces";

export async function signup(input: SignupInput): Promise<SignupOutput> {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();
    const [accountAlreadyExists] = await connection.query(
      "select * from cccat15.account where email = $1",
      [input.email]
    );
    if (accountAlreadyExists) throw new Error("Email already in use");
    if (!validateName(input.name)) throw new Error("Invalid name");
    if (!validateEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !validateCarPlate(input.carPlate!))
      throw new Error("Invalid car plate");
    await connection.query(
      "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ]
    );
    return {
      accountId: id,
    };
  } finally {
    await connection.$pool.end();
  }
}
