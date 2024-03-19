import amqp from "amqplib";

export default interface Queue {
  connect(): Promise<void>;
  publish(queue: string, data: any): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
  connection: any;

  async connect(): Promise<void> {
    this.connection = amqp.connect("amqp://localhost");
  }

  async publish(queue: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }

  async consume(queue: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      try {
        await callback(input);
        channel.ack(msg);
      } catch (e: any) {
        console.error(e.message);
      }
    });
  }
}
