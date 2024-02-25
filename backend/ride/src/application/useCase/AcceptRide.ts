import IRideRepository from "../../infrastructure/repository/RideRepository";
import IAccountGateway from "../gateway/AccountGateway";

export default class AcceptRide {
  constructor(
    readonly rideRepository: IRideRepository,
    readonly accountGateway: IAccountGateway
  ) {}

  async execute(input: AcceptRideInput): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    const account = await this.accountGateway.getById(input.driverId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isDriver) throw new Error("Account is not a driver");
    const hasActiveRide = await this.rideRepository.hasActiveRidesForDriver(
      input.driverId
    );
    if (hasActiveRide) throw new Error("Driver has an active ride");
    ride.accept(input.driverId);
    await this.rideRepository.update(ride);
  }
}

interface AcceptRideInput {
  rideId: string;
  driverId: string;
}
