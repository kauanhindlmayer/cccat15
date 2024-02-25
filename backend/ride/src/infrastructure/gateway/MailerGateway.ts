export default interface IMailerGateway {
  send(to: string, subject: string, body: string): Promise<void>;
}

export default class MailerGateway implements IMailerGateway {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log("Sending email to", to);
  }
}
