import Position from "../../domain/entity/Position";
import IPositionRepository from "../../infrastructure/repository/PositionRepository";
import IRideRepository from "../../infrastructure/repository/RideRepository";

export default class UpdatePosition {
  constructor(
    private rideRepository: IRideRepository,
    private positionRepository: IPositionRepository
  ) {}

  async execute(input: UpdatePositionInput): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.updatePosition(input.lat, input.long);
    await this.rideRepository.update(ride);
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionRepository.save(position);
  }
}

type UpdatePositionInput = {
  rideId: string;
  lat: number;
  long: number;
};
