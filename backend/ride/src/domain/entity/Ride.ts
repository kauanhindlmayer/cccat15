import crypto from "crypto";
import Coordinate from "../valueObject/Coordinate";
import DistanceCalculator from "../services/DistanceCalculator";
import FareCalculatorFactory from "../services/FareCalculator";

// Aggregate (Ride<AR>, Coordinate, Coordinate, Coordinate)
export default class Ride {
  private from: Coordinate;
  private to: Coordinate;
  private lastPosition: Coordinate;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private status: string,
    readonly date: Date,
    lastLat: number,
    lastLong: number,
    private distance: number,
    private fare: number,
    private driverId?: string
  ) {
    this.from = new Coordinate(fromLat, fromLong);
    this.to = new Coordinate(toLat, toLong);
    this.lastPosition = new Coordinate(lastLat, lastLong);
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
      date,
      fromLat,
      fromLong,
      0,
      0
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
    lastLat: number,
    lastLong: number,
    distance: number,
    fare: number,
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
      lastLat,
      lastLong,
      distance,
      fare,
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

  updatePosition(lat: number, long: number) {
    if (this.status !== "in_progress")
      throw new Error("Ride is not in the in_progress status");
    const newLastPosition = new Coordinate(lat, long);
    this.distance += DistanceCalculator.calculate(
      this.lastPosition,
      newLastPosition
    );
    this.lastPosition = newLastPosition;
  }

  finish() {
    if (this.status !== "in_progress")
      throw new Error("Ride is not in the in_progress status");
    this.status = "completed";
    this.fare = FareCalculatorFactory.create(this.date).calculate(
      this.distance
    );
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

  getDistance() {
    return this.distance;
  }

  getLastLat() {
    return this.lastPosition.getLat();
  }

  getLastLong() {
    return this.lastPosition.getLong();
  }

  getFare() {
    return this.fare;
  }
}
