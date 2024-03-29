import IUsecase from "../useCase/IUsecase";

export default class LogDecorator implements IUsecase {
  constructor(readonly usecase: IUsecase) {}

  async execute(data: any): Promise<any> {
    console.log("Executing use case", this.usecase.constructor.name);
    return this.usecase.execute(data);
  }
}
