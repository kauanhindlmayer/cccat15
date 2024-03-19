import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("account", { durable: true });
  channel.sendToQueue("account", Buffer.from(JSON.stringify("Hello World!")));
}

main();
