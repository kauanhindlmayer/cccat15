import IAccountRepository from "../../infrastructure/repository/AccountRepository";
import IRideRepository from "../../infrastructure/repository/RideRepository";

// O Ride em questão, não é a entidade Ride, é o conceito Ride que é resultado
// da junção de informações de Ride e de Account
export default class GetRide {
  constructor(
    readonly rideRepository: IRideRepository,
    readonly accountRepository: IAccountRepository
  ) {}

  async execute(rideId: string): Promise<GetRideOutput> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride does not exist");
    const passenger = await this.accountRepository.getById(ride.passengerId);
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      date: ride.date,
      status: ride.getStatus(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      passengerName: passenger!.getName(),
    };
  }
}

interface GetRideOutput {
  passengerId: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  passengerName: string;
}
