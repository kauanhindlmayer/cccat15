import DomainEvent from "../../domain/event/DomainEvent";
// import Mediator from "../../infrastructure/mediator/Mediator";
import Queue from "../../infrastructure/queue/Queue";
import IRideRepository from "../../infrastructure/repository/RideRepository";

export default class FinishRide {
  constructor(
    readonly rideRepository: IRideRepository,
    // readonly mediator: Mediator
    readonly queue: Queue
  ) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.register("ride:finished", async (event: DomainEvent) => {
      await this.queue.publish(event.name, event);
    });
    ride.finish();
    await this.rideRepository.update(ride);
    // await this.mediator.publish("ride:finished", { rideId: ride.rideId });
  }
}
