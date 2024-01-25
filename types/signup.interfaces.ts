export interface SignupInput {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}

export interface SignupOutput {
  accountId: string;
}
