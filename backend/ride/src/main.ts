import RideRepository from "./infrastructure/repository/RideRepository";
import SolicitateRide from "./application/useCase/SolicitateRide";
import GetRide from "./application/useCase/GetRide";
import PgPromiseAdapter from "./infrastructure/database/DatabaseConnection";
import ExpressAdapter from "./infrastructure/http/HttpServer";
import MainController from "./infrastructure/http/MainController";
import Registry from "./infrastructure/di/Registry";
import AccountGatewayHttp from "./infrastructure/gateway/AccountGatewayHttp";
import AxiosAdapter from "./infrastructure/http/HttpClient";
import { RabbitMQAdapter } from "./infrastructure/queue/Queue";
import QueueController from "./infrastructure/queue/QueueController";
// import Mediator from "./infrastructure/mediator/Mediator";
import FinishRide from "./application/useCase/FinishRide";
import ProcessPayment from "./application/useCase/ProcessPayment";

const main = async () => {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter();
  const rideRepository = new RideRepository(connection);
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const solicitateRide = new SolicitateRide(rideRepository, accountGateway);
  const getRide = new GetRide(rideRepository, accountGateway);
  const processPayment = new ProcessPayment(rideRepository);
  // const mediator = new Mediator();
  // mediator.register("ride:finished", async (data: any) => {
  //   await processPayment.execute(data.rideId);
  // });
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const finishRide = new FinishRide(rideRepository, queue);
  const registry = Registry.getInstance();
  registry.register("solicitateRide", solicitateRide);
  registry.register("getRide", getRide);
  registry.register("finishRide", finishRide);
  new MainController(httpServer);
  new QueueController(queue, processPayment);
  httpServer.listen(3000);
};

main();
