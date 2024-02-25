export default class Email {
  private value: string;

  constructor(address: string) {
    if (!this.isEmailValid(address)) throw new Error("Invalid email");
    this.value = address;
  }

  private isEmailValid(email: string) {
    const emailRegex = /^(.+)@(.+)$/;
    return email.match(emailRegex);
  }

  public getValue(): string {
    return this.value;
  }
}
