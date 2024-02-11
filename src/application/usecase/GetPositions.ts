import PositionRepository from "../../infrastructure/repository/PositionRepository";

export default class GetPositions {
  constructor(readonly positionRepository: PositionRepository) {}

  async execute(rideId: string): Promise<GetPositionsOutput[]> {
    const positions = await this.positionRepository.getByRideId(rideId);
    return positions.map((position) => ({
      positionId: position.positionId,
      rideId: position.rideId,
      lat: position.getLat(),
      long: position.getLong(),
      date: position.date,
    }));
  }
}

type GetPositionsOutput = {
  positionId: string;
  rideId: string;
  lat: number;
  long: number;
  date: Date;
};
