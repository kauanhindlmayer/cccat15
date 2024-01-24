import express, { Request, Response } from "express";
import { signup } from "./signup";
import { getAccount } from "./getAccount";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/account/:accountId", async (req: Request, res: Response) => {
  try {
    const result = await getAccount(req.params.accountId);
    res.status(200).send(result);
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = await signup(req.body);
    res.status(201).send(result);
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
