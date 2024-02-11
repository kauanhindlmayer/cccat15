import Position from "../../domain/entity/Position";
import IDatabaseConnection from "../database/DatabaseConnection";

export default interface IPositionRepository {
  save(ride: Position): Promise<void>;
}

export default class PositionRepository implements IPositionRepository {
  constructor(readonly connection: IDatabaseConnection) {}

  async save(position: Position): Promise<any> {
    await this.connection.query(
      "insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [
        position.positionId,
        position.rideId,
        position.getLat(),
        position.getLong(),
        position.date,
      ]
    );
  }
}
