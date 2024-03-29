import IDatabaseConnection from "../../infrastructure/database/DatabaseConnection";

export default class GetRideProjectionQuery {
  constructor(readonly connection: IDatabaseConnection) {}

  // DTO - Data Transfer Object
  async execute(rideId: string) {
    const [data] = await this.connection.query(
      `
      SELECT
        r.ride_ide,
        r.status,
        r.date,
        r.fare,
        r.distance,
        p.name as passenger_name,
        p.email as passenger_email,
        d.name as driver_name,
        d.email as driver_email
      FROM 
        cccat15.rides r 
        JOIN cccat15.account p ON (r.passenger_id = p.account_id)
        LEFT JOIN cccat15.account d ON (r.driver_id = d.account_id)
      WHERE
        ride_id = $1
      `,
      [rideId]
    );
    return data;
  }
}
