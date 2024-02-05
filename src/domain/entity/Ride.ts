import crypto from "crypto";
import Coordinate from "../valueObject/Coordinate";

export default class Ride {
  private from: Coordinate;
  private to: Coordinate;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private status: string,
    readonly date: Date,
    private driverId?: string
  ) {
    this.from = new Coordinate(fromLat, fromLong);
    this.to = new Coordinate(toLat, toLong);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = crypto.randomUUID();
    const status = "requested";
    const date = new Date();
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    driverId?: string
  ) {
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      driverId
    );
  }

  accept(driverId: string) {
    if (this.status !== "requested")
      throw new Error("Ride is not in the requested status");
    this.status = "accepted";
    this.driverId = driverId;
  }

  getStatus() {
    return this.status;
  }

  getDriverId() {
    return this.driverId;
  }

  start() {
    if (this.status !== "accepted")
      throw new Error("Ride is not in the accepted status");
    this.status = "in_progress";
  }

  getFromLat() {
    return this.from.getLat();
  }

  getFromLong() {
    return this.from.getLong();
  }

  getToLat() {
    return this.to.getLat();
  }

  getToLong() {
    return this.to.getLong();
  }
}
