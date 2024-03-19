import IRideRepository from "../../infrastructure/repository/RideRepository";

export default class ProcessPayment {
  constructor(readonly rideRepository: IRideRepository) {}

  async execute(rideId: string): Promise<void> {
    console.log(`Processing payment for ride ${rideId}`);
  }
}
