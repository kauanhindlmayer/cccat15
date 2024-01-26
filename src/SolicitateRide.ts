import IAccountDAO from "./AccountDAO";
import IRideDAO from "./RideDAO";
import crypto from "crypto";

interface SolicitateRideInput {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

interface SolicitateRideOutput {
  rideId: string;
}

export default class SolicitateRide {
  constructor(readonly accountDAO: IAccountDAO, readonly rideDAO: IRideDAO) {}

  async execute(input: SolicitateRideInput): Promise<SolicitateRideOutput> {
    const account = await this.accountDAO.getById(input.passengerId);
    if (account === null) throw new Error("Account does not exist");
    if (!account.isPassenger) throw new Error("Account is not a passenger");
    const rides = await this.rideDAO.getByPassengerId(input.passengerId);
    const hasActiveRide = rides.some(
      (ride: any) => ride.status !== "completed"
    );
    if (hasActiveRide) throw new Error("Passenger has an active ride");
    const rideId = crypto.randomUUID();
    await this.rideDAO.save({
      rideId: rideId,
      passengerId: input.passengerId,
      fromLat: input.fromLat,
      fromLong: input.fromLong,
      toLat: input.toLat,
      toLong: input.toLong,
      status: "requested",
      date: new Date(),
    });
    return { rideId };
  }
}
