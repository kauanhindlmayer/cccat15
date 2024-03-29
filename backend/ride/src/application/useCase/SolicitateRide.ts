import IRideRepository from "../../infrastructure/repository/RideRepository";
import Ride from "../../domain/entity/Ride";
import IAccountGateway from "../gateway/AccountGateway";
import IUsecase from "./IUsecase";

export default class SolicitateRide implements IUsecase {
  constructor(
    readonly rideRepository: IRideRepository,
    readonly accountGateway: IAccountGateway
  ) {}

  async execute(input: SolicitateRideInput): Promise<SolicitateRideOutput> {
    const account = await this.accountGateway.getById(input.passengerId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isPassenger) throw new Error("Account is not a passenger");
    const hasActiveRide = await this.rideRepository.hasActiveRidesForPassenger(
      input.passengerId
    );
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
