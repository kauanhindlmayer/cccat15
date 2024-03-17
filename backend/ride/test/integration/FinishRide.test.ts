import SolicitateRide from "../../src/application/useCase/SolicitateRide";
import RideRepository from "../../src/infrastructure/repository/RideRepository";
import GetRide from "../../src/application/useCase/GetRide";
import AcceptRide from "../../src/application/useCase/AcceptRide";
import StartRide from "../../src/application/useCase/StartRide";
import PgPromiseAdapter from "../../src/infrastructure/database/DatabaseConnection";
import IDatabaseConnection from "../../src/infrastructure/database/DatabaseConnection";
import UpdatePosition from "../../src/application/useCase/UpdatePosition";
import PositionRepository from "../../src/infrastructure/repository/PositionRepository";
import GetPositions from "../../src/application/useCase/GetPositions";
import IAccountGateway from "../../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../../src/infrastructure/gateway/AccountGatewayHttp";
import FinishRide from "../../src/application/useCase/FinishRide";
import sinon from "sinon";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let accountGateway: IAccountGateway;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getPositions: GetPositions;
let finishRide: FinishRide;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  accountGateway = new AccountGatewayHttp();
  const rideRepository = new RideRepository(connection);
  const positionRepository = new PositionRepository(connection);
  solicitateRide = new SolicitateRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository, accountGateway);
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  getPositions = new GetPositions(positionRepository);
  finishRide = new FinishRide(rideRepository);
});

test("should finish ride on normal hours", async () => {
  const dateStub = sinon.useFakeTimers(new Date("2024-02-26T16:00:00-03:00"));
  const passengerSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const passengerSignupOutput = await accountGateway.signup(
    passengerSignupInput
  );
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
  const driverSignupOutput = await accountGateway.signup(driverSignupInput);
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
  await finishRide.execute(solicitateRideOutput.rideId);
  const outputGetRide = await getRide.execute(solicitateRideOutput.rideId);
  expect(outputGetRide.fare).toBe(21);
  expect(outputGetRide.status).toBe("completed");
  dateStub.restore();
});

test("should finish ride on night hours", async () => {
  const dateStub = sinon.useFakeTimers(new Date("2024-02-26T23:00:00-03:00"));
  const passengerSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const passengerSignupOutput = await accountGateway.signup(
    passengerSignupInput
  );
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
  const driverSignupOutput = await accountGateway.signup(driverSignupInput);
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
  await finishRide.execute(solicitateRideOutput.rideId);
  const outputGetRide = await getRide.execute(solicitateRideOutput.rideId);
  expect(outputGetRide.fare).toBe(39);
  expect(outputGetRide.status).toBe("completed");
  dateStub.restore();
});

afterEach(async () => {
  await connection.close();
});
