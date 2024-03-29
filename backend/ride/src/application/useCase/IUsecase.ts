export default interface IUsecase {
  execute(data: any): Promise<any>;
}
