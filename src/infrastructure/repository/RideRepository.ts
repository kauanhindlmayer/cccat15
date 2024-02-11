import Ride from "../../domain/entity/Ride";
import IDatabaseConnection from "../database/DatabaseConnection";

export default interface IRideRepository {
  save(ride: Ride): Promise<void>;
  hasActiveRidesForPassenger(passengerId: string): Promise<boolean>;
  hasActiveRidesForDriver(driverId: string): Promise<boolean>;
  getById(rideId: string): Promise<Ride>;
  update(ride: Ride): Promise<void>;
}

export default class RideRepository implements IRideRepository {
  constructor(readonly connection: IDatabaseConnection) {}

  async save(ride: any): Promise<any> {
    await this.connection.query(
      "insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, last_lat, last_long, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        ride.rideId,
        ride.passengerId,
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getStatus(),
        ride.date,
        ride.getLastLat(),
        ride.getLastLong(),
        ride.getDistance(),
      ]
    );
  }

  async hasActiveRidesForPassenger(passengerId: string): Promise<boolean> {
    const rides = await this.connection.query(
      "select * from cccat15.ride where passenger_id = $1 and status = 'requested'",
      [passengerId]
    );
    return rides.length > 0;
  }

  async hasActiveRidesForDriver(driverId: string): Promise<boolean> {
    const rides = await this.connection.query(
      "select * from cccat15.ride where driver_id = $1 and status != 'completed'",
      [driverId]
    );
    return rides.length > 0;
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query(
      "select * from cccat15.ride where ride_id = $1",
      [rideId]
    );
    if (!ride) return;
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      parseFloat(ride.from_lat),
      parseFloat(ride.from_long),
      parseFloat(ride.to_lat),
      parseFloat(ride.to_long),
      ride.status,
      ride.date,
      parseFloat(ride.last_lat),
      parseFloat(ride.last_long),
      parseFloat(ride.distance),
      ride.driver_id
    );
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      "update cccat15.ride set status = $1, driver_id = $2 where ride_id = $3",
      [ride.getStatus(), ride.getDriverId(), ride.rideId]
    );
  }
}
