import SolicitateRide from "../../application/useCase/SolicitateRide";
import GetAccount from "../../application/useCase/GetAccount";
import GetRide from "../../application/useCase/GetRide";
import IHttpServer from "./HttpServer";
import Signup from "../../application/useCase/Signup";
import { resolve } from "../di/Registry";

// Interface Adapter
export default class MainController {
  @resolve("signup")
  signup?: Signup;
  @resolve("getAccount")
  getAccount?: GetAccount;
  @resolve("solicitateRide")
  solicitateRide?: SolicitateRide;
  @resolve("getRide")
  getRide?: GetRide;

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

    httpServer.register(
      "post",
      "/solicitate-ride",
      async (params: any, body: any) => {
        const result = await this.solicitateRide?.execute(body);
        return result;
      }
    );

    httpServer.register(
      "get",
      "/ride/:rideId",
      async (params: any, body: any) => {
        const result = await this.getRide?.execute(params.rideId);
        return result;
      }
    );
  }
}
