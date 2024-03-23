import DomainEvent from "./DomainEvent";

export default class RideFinishedEvent implements DomainEvent {
  name = "ride:finished";
  constructor(
    readonly rideId: string,
    readonly creditCardToken: string,
    readonly amount: number
  ) {}
}
