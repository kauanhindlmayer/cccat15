import SolicitateRide from "../../application/usecase/SolicitateRide";
import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import IHttpServer from "./HttpServer";
import Signup from "../../application/usecase/Signup";

// Interface Adapter
export default class MainController {
  constructor(
    httpServer: IHttpServer,
    signup: Signup,
    getAccount: GetAccount,
    solicitateRide: SolicitateRide,
    getRide: GetRide
  ) {
    httpServer.register("post", "/signup", async (params: any, body: any) => {
      const result = await signup.execute(body);
      return result;
    });

    httpServer.register(
      "get",
      "/account/:accountId",
      async (params: any, body: any) => {
        const result = await getAccount.execute(params.accountId);
        return result;
      }
    );

    httpServer.register(
      "post",
      "/solicitate-ride",
      async (params: any, body: any) => {
        const result = await solicitateRide.execute(body);
        return result;
      }
    );

    httpServer.register(
      "get",
      "/ride/:rideId",
      async (params: any, body: any) => {
        const result = await getRide.execute(params.rideId);
        return result;
      }
    );
  }
}
