import pgp from "pg-promise";

export async function getAccount(accountId: string) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const [account] = await connection.query(
      "select * from cccat15.account where account_id = $1",
      [accountId]
    );
    if (!account) throw new Error("Account not found");
    return account;
  } finally {
    await connection.$pool.end();
  }
}
