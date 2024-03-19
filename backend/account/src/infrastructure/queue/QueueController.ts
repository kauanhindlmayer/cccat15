import Signup from "../../application/useCase/Signup";
import Queue from "./Queue";

export default class QueueController {
  constructor(queue: Queue, signup: Signup) {
    queue.consume("signup", async (input: any) => {
      await signup.execute(input);
    });
  }
}
