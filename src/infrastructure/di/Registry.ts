export default class Registry {
  private static instance: Registry;
  private container: Map<string, any>;

  private constructor() {
    this.container = new Map();
  }

  public static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  public register(key: string, value: any): void {
    this.container.set(key, value);
  }

  public resolve(key: string): any {
    return this.container.get(key);
  }
}

export function resolve(name: string) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = new Proxy(
      {},
      {
        get: () => {
          const dependency = Registry.getInstance().resolve(name);
          return dependency[propertyKey];
        },
      }
    );
  };
}
