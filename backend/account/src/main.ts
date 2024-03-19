import Signup from "./application/useCase/Signup";
import GetAccount from "./application/useCase/GetAccount";
import AccountRepository from "./infrastructure/repository/AccountRepository";
import PgPromiseAdapter from "./infrastructure/database/DatabaseConnection";
import ExpressAdapter from "./infrastructure/http/HttpServer";
import MainController from "./infrastructure/http/MainController";
import Registry from "./infrastructure/di/Registry";
import { RabbitMQAdapter } from "./infrastructure/queue/Queue";
import QueueController from "./infrastructure/queue/QueueController";

const main = () => {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepository(connection);
  const signup = new Signup(accountRepository);
  const getAccount = new GetAccount(accountRepository);
  const registry = Registry.getInstance();
  const queue = new RabbitMQAdapter();
  registry.register("signup", signup);
  registry.register("getAccount", getAccount);
  registry.register("queue", queue);
  new MainController(httpServer);
  new QueueController(queue, signup);
  httpServer.listen(3001);
};

main();
