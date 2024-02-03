import SolicitateRide from "../../src/application/usecase/SolicitateRide";
import Signup from "../../src/application/usecase/Signup";
import AccountRepository from "../../src/infrastructure/repository/AccountRepository";
import RideRepository from "../../src/infrastructure/repository/RideRepository";
import GetRide from "../../src/application/usecase/GetRide";
import crypto from "crypto";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import StartRide from "../../src/application/usecase/StartRide";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let signup: Signup;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepository(connection);
  const rideRepository = new RideRepository(connection);
  signup = new Signup(accountRepository);
  solicitateRide = new SolicitateRide(accountRepository, rideRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(accountRepository, rideRepository);
  startRide = new StartRide(rideRepository);
});

test("should throw an error if ride does not exist", async () => {
  const invalidRideId = crypto.randomUUID();
  await expect(() => startRide.execute(invalidRideId)).rejects.toThrow(
    "Ride does not exist"
  );
});

test("should throw an error if ride is not in the accepted status", async () => {
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
  await expect(() =>
    startRide.execute(solicitateRideOutput.rideId)
  ).rejects.toThrow("Ride is not in the accepted status");
});

test("should start ride", async () => {
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
  const acceptRideInput = {
    rideId: solicitateRideOutput.rideId,
    driverId: driverSignupOutput.accountId,
  };
  await acceptRide.execute(acceptRideInput);
  await startRide.execute(solicitateRideOutput.rideId);
  const ride = await getRide.execute(solicitateRideOutput.rideId);
  expect(ride.status).toBe("in_progress");
  expect(ride.passengerName).toBe(passengerSignupInput.name);
});

afterEach(async () => {
  await connection.close();
});
