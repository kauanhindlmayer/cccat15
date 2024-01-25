import axios from "axios";

const baseUrl = "http://localhost:5000";

test("should create an account on route /signup", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const response = await axios.post(`${baseUrl}/signup`, input);
  expect(response.status).toBe(201);
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
  expect(response.data.account_id).toBe(data.accountId);
  expect(response.data.name).toBe(input.name);
  expect(response.data.email).toBe(input.email);
  expect(response.data.cpf).toBe(input.cpf);
  expect(response.data.is_passenger).toBe(true);
  expect(response.data.is_driver).toBe(false);
  expect(response.data.car_plate).toBeNull();
});
