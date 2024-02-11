import crypto from "crypto";
import Coordinate from "../valueObject/Coordinate";

// Aggregate (Position<AR>, coordinate)
export default class Position {
  private coordinate: Coordinate;

  constructor(
    readonly positionId: string,
    readonly rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.coordinate = new Coordinate(lat, long);
  }

  static create(rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID();
    const date = new Date();
    return new Position(positionId, rideId, lat, long, date);
  }

  getLat() {
    return this.coordinate.getLat();
  }

  getLong() {
    return this.coordinate.getLong();
  }
}
