import IAccountDAO from "./AccountDAO";
import IRideDAO from "./RideDAO";

interface AcceptRideInput {
  rideId: string;
  driverId: string;
}

export default class SolicitateRide {
  constructor(readonly accountDAO: IAccountDAO, readonly rideDAO: IRideDAO) {}

  async execute(input: AcceptRideInput): Promise<void> {
    const account = await this.accountDAO.getById(input.driverId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isDriver) throw new Error("Account is not a driver");
    const ride = await this.rideDAO.getById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    if (ride.status !== "requested")
      throw new Error("Ride is not in the requested status");
    const driverRides = await this.rideDAO.getByDriverId(input.driverId);
    const driverHasActiveRide = driverRides.some(
      (ride: any) => ride.status !== "completed"
    );
    if (driverHasActiveRide) throw new Error("Driver has an active ride");
    await this.rideDAO.acceptRide(input.rideId, input.driverId);
  }
}
