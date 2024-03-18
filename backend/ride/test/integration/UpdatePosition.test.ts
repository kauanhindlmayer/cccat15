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
import AxiosAdapter from "../../src/infrastructure/http/HttpClient";

let connection: IDatabaseConnection;
let solicitateRide: SolicitateRide;
let accountGateway: IAccountGateway;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getPositions: GetPositions;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  const rideRepository = new RideRepository(connection);
  const positionRepository = new PositionRepository(connection);
  solicitateRide = new SolicitateRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository, accountGateway);
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  getPositions = new GetPositions(positionRepository);
});

test("should start ride", async () => {
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
  const outputGetRide = await getRide.execute(solicitateRideOutput.rideId);
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.lastLat).toBe(-27.496887588317275);
  expect(outputGetRide.lastLong).toBe(-48.522234807851476);
  const outputGetPositions = await getPositions.execute(
    solicitateRideOutput.rideId
  );
  expect(outputGetPositions[0].lat).toBe(-27.496887588317275);
  expect(outputGetPositions[0].long).toBe(-48.522234807851476);
});

afterEach(async () => {
  await connection.close();
});
