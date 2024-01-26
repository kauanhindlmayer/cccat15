import SolicitateRide from "../src/SolicitateRide";
import Signup from "../src/Signup";
import AccountDAO from "../src/AccountDAO";
import RideDAO from "../src/RideDAO";
import GetRide from "../src/GetRide";
import crypto from "crypto";

let solicitateRide: SolicitateRide;
let signup: Signup;
let getRide: GetRide;

beforeEach(() => {
  const accountDAO = new AccountDAO();
  const rideDAO = new RideDAO();
  signup = new Signup(accountDAO);
  solicitateRide = new SolicitateRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
});

test("should create a new ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await signup.execute(signupInput);
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
  const signupOutput = await signup.execute(signupInput);
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
    "Passenger does not exist"
  );
});

test("should throw an error if passenger has an active ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await signup.execute(signupInput);
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
  const signupOutput = await signup.execute(signupInput);
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
  const signupOutput = await signup.execute(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  const ride = await getRide.execute({ rideId: result.rideId });
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
  const signupOutput = await signup.execute(signupInput);
  const input = {
    passengerId: signupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const result = await solicitateRide.execute(input);
  const ride = await getRide.execute({ rideId: result.rideId });
  expect(ride).toBeDefined();
  expect(ride?.date).toBeDefined();
});
