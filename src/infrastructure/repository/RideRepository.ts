import Ride from "../../domain/entity/Ride";
import IDatabaseConnection from "../database/DatabaseConnection";

export default interface IRideRepository {
  save(ride: Ride): Promise<void>;
  getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  getActiveRidesByDriverId(driverId: string): Promise<Ride[]>;
  getById(rideId: string): Promise<Ride>;
  update(ride: Ride): Promise<void>;
}

export default class RideRepository implements IRideRepository {
  constructor(readonly connection: IDatabaseConnection) {}

  async save(ride: any): Promise<any> {
    await this.connection.query(
      "insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.status,
        ride.date,
      ]
    );
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat15.ride where passenger_id = $1 and status = 'requested'",
      [passengerId]
    );
    const activeRides = [];
    for (const ride of rides) {
      activeRides.push(
        Ride.restore(
          ride.ride_id,
          ride.passenger_id,
          parseFloat(ride.from_lat),
          parseFloat(ride.from_long),
          parseFloat(ride.to_lat),
          parseFloat(ride.to_long),
          ride.status,
          ride.date,
          ride.driver_id
        )
      );
    }
    return activeRides;
  }

  async getActiveRidesByDriverId(driverId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat15.ride where driver_id = $1 and status != 'completed'",
      [driverId]
    );
    return rides.map((ride: any) => {
      return Ride.restore(
        ride.ride_id,
        ride.passenger_id,
        parseFloat(ride.from_lat),
        parseFloat(ride.from_long),
        parseFloat(ride.to_lat),
        parseFloat(ride.to_long),
        ride.status,
        ride.date,
        ride.driver_id
      );
    });
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

// export class RideRepositoryInMemory implements IRideRepository {
//   private rides: any[] = [];

//   async save(ride: any): Promise<any> {
//     this.rides.push(ride);
//     return ride.ride_id;
//   }

//   getActiveRidesByPassengerId(passengerId: string): Promise<any> {
//     const rides = this.rides.filter(
//       (ride) => ride.passenger_id === passengerId
//     );
//     return Promise.resolve(rides);
//   }

//   getActiveRidesByDriverId(driverId: unknown): Promise<any> {
//     const rides = this.rides.filter((ride) => ride.driver_id === driverId);
//     return Promise.resolve(rides);
//   }

//   getById(rideId: string): Promise<any> {
//     const [ride] = this.rides.filter((ride) => ride.ride_id === rideId);
//     return Promise.resolve(ride);
//   }
// }
