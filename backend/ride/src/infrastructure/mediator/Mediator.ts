export default class Mediator {
  services: { event: string; callback: Function }[];

  constructor() {
    this.services = [];
  }

  register(event: string, callback: Function) {
    this.services.push({ event, callback });
  }

  async publish(event: string, data: any) {
    const services = this.services.filter((service) => service.event === event);
    for (const service of services) {
      await service.callback(data);
    }
  }
}
