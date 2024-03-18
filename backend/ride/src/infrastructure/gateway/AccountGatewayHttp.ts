import IAccountGateway from "../../application/gateway/AccountGateway";
import IHttpClient from "../http/HttpClient";

// Interface Adapter
export default class AccountGatewayHttp implements IAccountGateway {
  constructor(readonly httpClient: IHttpClient) {}

  async getById(accountId: string): Promise<any> {
    return await this.httpClient.get(
      `http://localhost:3001/account/${accountId}`
    );
  }

  async signup(input: any): Promise<any> {
    return await this.httpClient.post("http://localhost:3001/signup", input);
  }
}
