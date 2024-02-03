import IRideRepository from "../../infrastructure/repository/RideRepository";

export default class SolicitateRide {
  constructor(readonly rideRepository: IRideRepository) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride does not exist");
    if (ride.status !== "accepted")
      throw new Error("Ride is not in the accepted status");
    await this.rideRepository.startRide(rideId);
  }
}
