import SolicitateRide from "../../src/application/useCase/SolicitateRide";
import Signup from "../../src/application/useCase/Signup";
import AccountRepository from "../../src/infrastructure/repository/AccountRepository";
import RideRepository from "../../src/infrastructure/repository/RideRepository";
import GetRide from "../../src/application/useCase/GetRide";
import AcceptRide from "../../src/application/useCase/AcceptRide";
import StartRide from "../../src/application/useCase/StartRide";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";
import UpdatePosition from "../../src/application/useCase/UpdatePosition";
import PositionRepository from "../../src/infrastructure/repository/PositionRepository";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let signup: Signup;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepository(connection);
  const rideRepository = new RideRepository(connection);
  const positionRepository = new PositionRepository(connection);
  signup = new Signup(accountRepository);
  solicitateRide = new SolicitateRide(accountRepository, rideRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(accountRepository, rideRepository);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
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
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
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
  const updatePositionInput = {
    rideId: solicitateRideOutput.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  };
  await updatePosition.execute(updatePositionInput);
  const getRideOutput = await getRide.execute(solicitateRideOutput.rideId);
  expect(getRideOutput.distance).toBe(10);
  expect(getRideOutput.lastLat).toBe(-27.496887588317275);
  expect(getRideOutput.lastLong).toBe(-48.522234807851476);
});

afterEach(async () => {
  await connection.close();
});
