import IAccountRepository from "../../infrastructure/repository/AccountRepository";
import IRideRepository from "../../infrastructure/repository/RideRepository";

interface AcceptRideInput {
  rideId: string;
  driverId: string;
}

export default class SolicitateRide {
  constructor(
    readonly accountRepository: IAccountRepository,
    readonly RideRepository: IRideRepository
  ) {}

  async execute(input: AcceptRideInput): Promise<void> {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isDriver) throw new Error("Account is not a driver");
    const ride = await this.RideRepository.getById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    if (ride.status !== "requested")
      throw new Error("Ride is not in the requested status");
    const [hasActiveRide] = await this.RideRepository.getActiveRidesByDriverId(
      input.driverId
    );
    if (hasActiveRide) throw new Error("Driver has an active ride");
    await this.RideRepository.acceptRide(input.rideId, input.driverId);
  }
}
