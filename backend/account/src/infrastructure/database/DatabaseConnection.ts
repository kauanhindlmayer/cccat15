import pgp from "pg-promise";

export default interface IDatabaseConnection {
  query(statement: string, params: any[]): Promise<any>;
  close(): Promise<void>;
}

export default class PgPromiseAdapter implements IDatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  }

  async query(statement: string, params: any[]): Promise<any> {
    return await this.connection.query(statement, params);
  }

  async close() {
    // Detalhe traduzido no Adapter
    await this.connection.$pool.end();
  }
}
