import express, { Request, Response } from "express";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";
import SolicitateRide from "./SolicitateRide";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/account/:accountId", async (req: Request, res: Response) => {
  try {
    const accountDAO = new AccountDAO();
    const getAccount = new GetAccount(accountDAO);
    const result = await getAccount.execute(req.params.accountId);
    res.status(200).send(result);
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const accountDAO = new AccountDAO();
    const signup = new Signup(accountDAO);
    const result = await signup.execute(req.body);
    res.status(201).send(result);
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
});

app.post("/solicitate-ride", async (req: Request, res: Response) => {
  try {
    const accountDAO = new AccountDAO();
    const rideDAO = new RideDAO();
    const solicitateRide = new SolicitateRide(accountDAO, rideDAO);
    const result = await solicitateRide.execute(req.body);
    res.status(201).send(result);
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
