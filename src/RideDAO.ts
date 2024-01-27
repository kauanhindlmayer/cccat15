import { connection } from "./databaseConnection";

export default interface IRideDAO {
  save(ride: any): Promise<void>;
  getByPassengerId(passengerId: string): Promise<any>;
  getByDriverId(driverId: string): Promise<any>;
  getById(rideId: string): Promise<any>;
  acceptRide(rideId: string, driverId: string): Promise<void>;
  startRide(rideId: string): Promise<void>;
}

export default class RideDAO implements IRideDAO {
  async save(ride: any): Promise<any> {
    await connection.query(
      "insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
      ]
    );
  }

  async getByPassengerId(passengerId: string): Promise<any> {
    const rides = await connection.query(
      "select * from cccat15.ride where passenger_id = $1",
      [passengerId]
    );
    if (!rides) return null;
    return rides.map(this.mapRide);
  }

  async getByDriverId(driverId: string): Promise<any> {
    const rides = await connection.query(
      "select * from cccat15.ride where driver_id = $1",
      [driverId]
    );
    if (!rides) return null;
    return rides.map(this.mapRide);
  }

  async getById(rideId: string): Promise<any> {
    const [ride] = await connection.query(
      "select * from cccat15.ride where ride_id = $1",
      [rideId]
    );
    if (!ride) return null;
    return this.mapRide(ride);
  }

  async acceptRide(rideId: string, driverId: string): Promise<void> {
    await connection.query(
      "update cccat15.ride set driver_id = $1, status = 'accepted' where ride_id = $2",
      [driverId, rideId]
    );
  }

  async startRide(rideId: string): Promise<void> {
    await connection.query(
      "update cccat15.ride set status = 'in_progress' where ride_id = $1",
      [rideId]
    );
  }

  mapRide(ride: any) {
    return {
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      driverId: ride.driver_id,
      fromLat: ride.from_lat,
      fromLong: ride.from_long,
      toLat: ride.to_lat,
      toLong: ride.to_long,
      status: ride.status,
      date: ride.date,
    };
  }
}

export class RideDAOInMemory implements IRideDAO {
  private rides: any[] = [];

  async save(ride: any): Promise<any> {
    this.rides.push(ride);
    return ride.ride_id;
  }

  getByPassengerId(passengerId: string): Promise<any> {
    const rides = this.rides.filter(
      (ride) => ride.passenger_id === passengerId
    );
    return Promise.resolve(rides);
  }

  getByDriverId(driverId: unknown): Promise<any> {
    const rides = this.rides.filter((ride) => ride.driver_id === driverId);
    return Promise.resolve(rides);
  }

  getById(rideId: string): Promise<any> {
    const [ride] = this.rides.filter((ride) => ride.ride_id === rideId);
    return Promise.resolve(ride);
  }

  async acceptRide(rideId: string, driverId: string): Promise<void> {
    const [ride] = this.rides.filter((ride) => ride.ride_id === rideId);
    ride.driver_id = driverId;
    ride.status = "accepted";
  }

  async startRide(rideId: string) {
    const [ride] = this.rides.filter((ride) => ride.id === rideId);
    ride.status = "in_progress";
  }

  mapRide(ride: any) {
    return ride;
  }
}
