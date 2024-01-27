import SolicitateRide from "../src/SolicitateRide";
import Signup from "../src/Signup";
import AccountDAO from "../src/AccountDAO";
import RideDAO from "../src/RideDAO";
import GetRide from "../src/GetRide";
import crypto from "crypto";
import AcceptRide from "../src/AcceptRide";
import StartRide from "../src/StartRide";

let solicitateRide: SolicitateRide;
let signup: Signup;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
  const accountDAO = new AccountDAO();
  const rideDAO = new RideDAO();
  signup = new Signup(accountDAO);
  solicitateRide = new SolicitateRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
  acceptRide = new AcceptRide(accountDAO, rideDAO);
  startRide = new StartRide(rideDAO);
});

test("should throw an error if ride does not exist", async () => {
  const input = {
    rideId: crypto.randomUUID(),
  };
  await expect(() => startRide.execute(input)).rejects.toThrow(
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
  const input = {
    rideId: solicitateRideOutput.rideId,
  };
  await expect(() => startRide.execute(input)).rejects.toThrow(
    "Ride is not in the accepted status"
  );
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
  const input = {
    rideId: solicitateRideOutput.rideId,
  };
  await startRide.execute(input);
  const ride = await getRide.execute({ rideId: solicitateRideOutput.rideId });
  expect(ride?.status).toBe("in_progress");
});
