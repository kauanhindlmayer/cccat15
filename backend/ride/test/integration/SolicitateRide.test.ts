import SolicitateRide from "../../src/application/useCase/SolicitateRide";
import RideRepository from "../../src/infrastructure/repository/RideRepository";
import GetRide from "../../src/application/useCase/GetRide";
import crypto from "crypto";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infrastructure/gateway/AccountGatewayHttp";
import IAccountGateway from "../../src/application/gateway/AccountGateway";
import AxiosAdapter from "../../src/infrastructure/http/HttpClient";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let getRide: GetRide;
let accountGateway: IAccountGateway;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const rideRepository = new RideRepository(connection);
  accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  solicitateRide = new SolicitateRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository, accountGateway);
});

test("should create a new ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  expect(result.rideId).toBeDefined();
});

test("should throw an error if passenger is not a passenger", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: false,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  await expect(() => solicitateRide.execute(input)).rejects.toThrow(
    "Account is not a passenger"
  );
});

test("should throw an error if passenger does not exist", async () => {
  const invalidId = crypto.randomUUID();
  const input = {
    passengerId: invalidId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  await expect(() => solicitateRide.execute(input)).rejects.toThrow(
    "Account does not exist"
  );
});

test("should throw an error if passenger has an active ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  await solicitateRide.execute(input);
  await expect(() => solicitateRide.execute(input)).rejects.toThrow(
    "Passenger has an active ride"
  );
});

test("should generate a new ride id", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  expect(result.rideId).toBeDefined();
});

test("should create a new ride with the correct status", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  const ride = await getRide.execute(result.rideId);
  expect(ride).toBeDefined();
  expect(ride?.status).toBe("requested");
});

test("should define the correct date for the ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await accountGateway.signup(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  const ride = await getRide.execute(result.rideId);
  expect(ride).toBeDefined();
  expect(ride?.date).toBeDefined();
});

afterEach(async () => {
  await connection.close();
});
