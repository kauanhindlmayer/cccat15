import express from "express";

export default interface IHttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export default class ExpressAdapter implements IHttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (req: any, res: any) => {
      try {
        const result = await callback(req.params, req.body);
        res.json(result);
      } catch (e: any) {
        res.status(400).json({ message: e.message });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
