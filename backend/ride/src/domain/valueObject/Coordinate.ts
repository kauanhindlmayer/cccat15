export default class Coordinate {
  private lat: number;
  private long: number;

  constructor(lat: number, long: number) {
    if (!this.isCoordinateValid(lat, long))
      throw new Error("Invalid coordinate");
    this.lat = lat;
    this.long = long;
  }

  public getLat(): number {
    return this.lat;
  }

  public getLong(): number {
    return this.long;
  }

  private isCoordinateValid(lat: number, long: number) {
    if (lat < -90 || lat > 90) return false;
    if (long < -180 || long > 180) return false;
    return true;
  }
}
