import IRideDAO from "./RideDAO";

interface StartRideInput {
  rideId: string;
}

export default class SolicitateRide {
  constructor(readonly rideDAO: IRideDAO) {}

  async execute(input: StartRideInput): Promise<void> {
    const ride = await this.rideDAO.getById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    if (ride.status !== "accepted")
      throw new Error("Ride is not in the accepted status");
    await this.rideDAO.startRide(input.rideId);
  }
}
