import IAccountGateway from "../../application/gateway/AccountGateway";
import axios from "axios";

export default class AccountGatewayHttp implements IAccountGateway {
  async getById(accountId: string): Promise<any> {
    const response = await axios.get(
      `http://localhost:3001/account/${accountId}`
    );
    return response.data;
  }

  async signup(input: any): Promise<any> {
    const response = await axios.post("http://localhost:3001/signup", input);
    return response.data;
  }
}
