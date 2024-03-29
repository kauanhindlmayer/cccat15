import IRideRepository from "../../infrastructure/repository/RideRepository";
import IAccountGateway from "../gateway/AccountGateway";

// O Ride em questão, não é a entidade Ride, é o conceito Ride que é resultado
// da junção de informações de Ride e de Account
// API Composition
export default class GetRide {
  constructor(
    readonly rideRepository: IRideRepository,
    readonly accountGateway: IAccountGateway
  ) {}

  async execute(rideId: string): Promise<GetRideOutput> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride does not exist");
    const passenger = await this.accountGateway.getById(ride.passengerId);
    if (!passenger) throw new Error("Passenger does not exist");
    const driverId = ride.getDriverId();
    let driver;
    if (driverId) {
      driver = await this.accountGateway.getById(driverId);
    }
    // DTO - converteu dados das entidades em um modelo mais adequado ao cliente (desacoplando da camada de domínio)
    return {
      passengerId: ride.passengerId,
      driverId: ride.getDriverId(),
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      distance: ride.getDistance(),
      date: ride.date,
      passengerName: passenger.name,
      fare: ride.getFare(),
      driverName: driver.name,
    };
  }
}

interface GetRideOutput {
  passengerId: string;
  driverId?: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  lastLat: number;
  lastLong: number;
  distance: number;
  date: Date;
  passengerName: string;
  fare: number;
  driverName: string;
}
