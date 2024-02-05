export default class CarPlate {
  private value: string;

  constructor(carPlate: string) {
    if (!this.isCarPlateValid(carPlate)) throw new Error("Invalid car plate");
    this.value = carPlate;
  }

  public getValue(): string {
    return this.value;
  }

  private isCarPlateValid(carPlate: string) {
    const carPlateRegex = /[A-Z]{3}[0-9]{4}/;
    return carPlate.match(carPlateRegex);
  }
}
