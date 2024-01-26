import { Account } from "./GetAccount";
import IRideDAO from "./RideDAO";

interface GetRideInput {
  rideId: string;
}

interface GetRideOutput {
  rideId: string;
  status: string;
  fare: number;
  distance: number;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
  passenger: Account;
  driver?: Account;
}

export default class GetRide {
  constructor(readonly rideDAO: IRideDAO) {}

  async execute(input: GetRideInput): Promise<GetRideOutput | null> {
    const ride = await this.rideDAO.getById(input.rideId);
    return ride;
  }
}
