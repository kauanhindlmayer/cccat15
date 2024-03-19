import ProcessPayment from "../../application/useCase/ProcessPayment";
import Queue from "./Queue";

export default class QueueController {
  constructor(queue: Queue, processPayment: ProcessPayment) {
    queue.consume("ride:finished", async (input: any) => {
      await processPayment.execute(input);
    });
  }
}
