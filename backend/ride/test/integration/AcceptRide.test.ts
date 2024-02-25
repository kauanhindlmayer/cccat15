import SolicitateRide from "../../src/application/useCase/SolicitateRide";
import Signup from "../../src/application/useCase/Signup";
import AccountRepository from "../../src/infrastructure/repository/AccountRepository";
import RideRepository from "../../src/infrastructure/repository/RideRepository";
import GetRide from "../../src/application/useCase/GetRide";
import crypto from "crypto";
import AcceptRide from "../../src/application/useCase/AcceptRide";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let signup: Signup;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepository(connection);
  const rideRepository = new RideRepository(connection);
  signup = new Signup(accountRepository);
  solicitateRide = new SolicitateRide(accountRepository, rideRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(accountRepository, rideRepository);
});

test("should accept a ride", async () => {
  const passengerSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const passengerSignupOutput = await signup.execute(passengerSignupInput);
  const solicitateRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const solicitateRideOutput = await solicitateRide.execute(
    solicitateRideInput
  );
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isDriver: true,
  };
  const driverSignupOutput = await signup.execute(driverSignupInput);
  const input = {
    rideId: solicitateRideOutput.rideId,
    driverId: driverSignupOutput.accountId,
  };
  await acceptRide.execute(input);
  const ride = await getRide.execute(input.rideId);
  expect(ride.status).toBe("accepted");
});

test("should throw an error if driver is not a driver", async () => {
  const passengerSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const passengerSignupOutput = await signup.execute(passengerSignupInput);
  const solicitateRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const solicitateRideOutput = await solicitateRide.execute(
    solicitateRideInput
  );
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isDriver: false,
  };
  const driverSignupOutput = await signup.execute(driverSignupInput);
  const input = {
    rideId: solicitateRideOutput.rideId,
    driverId: driverSignupOutput.accountId,
  };
  await expect(() => acceptRide.execute(input)).rejects.toThrow(
    "Account is not a driver"
  );
});

test("should throw an error if ride does not exist", async () => {
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    carPlate: "ABC1234",
    isDriver: true,
  };
  const driverSignupOutput = await signup.execute(driverSignupInput);
  const input = {
    rideId: crypto.randomUUID(),
    driverId: driverSignupOutput.accountId,
  };
  await expect(() => acceptRide.execute(input)).rejects.toThrow(
    "Ride does not exist"
  );
});

afterEach(async () => {
  await connection.close();
});
