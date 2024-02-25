import GetAccount from "../../application/useCase/GetAccount";
import IHttpServer from "./HttpServer";
import Signup from "../../application/useCase/Signup";
import { resolve } from "../di/Registry";

// Interface Adapter
export default class MainController {
  @resolve("signup")
  signup?: Signup;
  @resolve("getAccount")
  getAccount?: GetAccount;

  constructor(httpServer: IHttpServer) {
    httpServer.register("post", "/signup", async (params: any, body: any) => {
      const result = await this.signup?.execute(body);
      return result;
    });

    httpServer.register(
      "get",
      "/account/:accountId",
      async (params: any, body: any) => {
        const result = await this.getAccount?.execute(params.accountId);
        return result;
      }
    );
  }
}
