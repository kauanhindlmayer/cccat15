import axios from "axios";
import fetch from "node-fetch";

export default interface IHttpClient {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

// Frameworks and Drivers
export default class AxiosAdapter implements IHttpClient {
  async get(url: string) {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, body: any) {
    const response = await axios.post(url, body);
    return response.data;
  }
}

// Frameworks and Drivers
export class FetchAdapter implements IHttpClient {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, body: any) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
}
