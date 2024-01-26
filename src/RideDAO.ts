import { connection } from "./databaseConnection";

export default interface IRideDAO {
  save(ride: any): Promise<void>;
  getByPassengerId(passengerId: string): Promise<any>;
  getById(rideId: string): Promise<any>;
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
    return rides.map(this.mapRide);
  }

  async getById(rideId: string): Promise<any> {
    const [ride] = await connection.query(
      "select * from cccat15.ride where ride_id = $1",
      [rideId]
    );
    return this.mapRide(ride);
  }

  mapRide(ride: any) {
    return {
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      fromLat: ride.from_lat,
      fromLong: ride.from_long,
      toLat: ride.to_lat,
      toLong: ride.to_long,
      status: ride.status,
      date: ride.date,
    };
  }
}

// export class RideDAOInMemory implements IRideDAO {
//   private rides: any[] = [];

//   async save(ride: any): Promise<any> {
//     this.rides.push(ride);
//     return ride.ride_id;
//   }

//   getByPassengerId(passengerId: string): Promise<any> {
//     const rides = this.rides.filter(
//       (ride) => ride.passenger_id === passengerId
//     );
//     return Promise.resolve(rides);
//   }

//   getById(rideId: string): Promise<any> {
//     const [ride] = this.rides.filter((ride) => ride.ride_id === rideId);
//     return Promise.resolve(ride);
//   }
// }
