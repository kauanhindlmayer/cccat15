import axios from "axios";

const baseUrl = "http://localhost:3001";

test("should create an account on route /signup", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const response = await axios.post(`${baseUrl}/signup`, input);
  expect(response.status).toBe(200);
  expect(response.data.accountId).toBeDefined();
});

test("should get an account on route /account/:accountId", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const { data } = await axios.post(`${baseUrl}/signup`, input);
  const response = await axios.get(`${baseUrl}/account/${data.accountId}`);
  expect(response.status).toBe(200);
  expect(response.data.accountId).toBe(data.accountId);
  expect(response.data.name).toBe(input.name);
  expect(response.data.email).toBe(input.email);
  expect(response.data.cpf).toBe(input.cpf);
  expect(response.data.isPassenger).toBe(true);
  expect(response.data.isDriver).toBe(false);
  expect(response.data.carPlate).toBeUndefined();
});
