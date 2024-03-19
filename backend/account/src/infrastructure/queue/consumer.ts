import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("account", { durable: true });
  channel.consume("account", (msg: any) => {
    const input = JSON.parse(msg.content.toString());
    console.log(input);
    channel.ack(msg);
  });
}

main();
