export default class Name {
  private value: string;

  constructor(name: string) {
    if (!this.isNameValid(name)) throw new Error("Invalid name");
    this.value = name;
  }

  private isNameValid(name: string) {
    const nameRegex = /[a-zA-Z] [a-zA-Z]+/;
    return name.match(nameRegex);
  }

  public getValue(): string {
    return this.value;
  }
}
