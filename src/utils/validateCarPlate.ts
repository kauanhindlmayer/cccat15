export function validateCarPlate(carPlate: string): boolean {
  if (!carPlate) return false;
  const carPlateRegex = /^[A-Z]{3}[0-9]{4}$/;
  return carPlateRegex.test(carPlate);
}
