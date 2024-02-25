import SolicitateRide from "../../application/useCase/SolicitateRide";
import GetRide from "../../application/useCase/GetRide";
import IHttpServer from "./HttpServer";
import { resolve } from "../di/Registry";

// Interface Adapter
export default class MainController {
  @resolve("solicitateRide")
  solicitateRide?: SolicitateRide;
  @resolve("getRide")
  getRide?: GetRide;

  constructor(httpServer: IHttpServer) {
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
