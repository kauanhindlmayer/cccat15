export default interface IAccountGateway {
  getById(id: string): Promise<any>;
  signup(input: any): Promise<any>;
}
