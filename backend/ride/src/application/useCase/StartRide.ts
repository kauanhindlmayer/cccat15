import IRideRepository from "../../infrastructure/repository/RideRepository";

export default class StartRide {
  constructor(readonly rideRepository: IRideRepository) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.start();
    await this.rideRepository.update(ride);
  }
}
