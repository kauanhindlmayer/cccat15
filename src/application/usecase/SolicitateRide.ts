import IAccountRepository from "../../infrastructure/repository/AccountRepository";
import IRideRepository from "../../infrastructure/repository/RideRepository";
import Ride from "../../domain/entity/Ride";

export default class SolicitateRide {
  constructor(
    readonly accountRepository: IAccountRepository,
    readonly rideRepository: IRideRepository
  ) {}

  async execute(input: SolicitateRideInput): Promise<SolicitateRideOutput> {
    const account = await this.accountRepository.getById(input.passengerId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isPassenger) throw new Error("Account is not a passenger");
    const [hasActiveRide] =
      await this.rideRepository.getActiveRidesByPassengerId(input.passengerId);
    if (hasActiveRide) throw new Error("Passenger has an active ride");
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId,
    };
  }
}

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
