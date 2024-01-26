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
  expect(response.data.accountId).toBe(data.accountId);
  expect(response.data.name).toBe(input.name);
  expect(response.data.email).toBe(input.email);
  expect(response.data.cpf).toBe(input.cpf);
  expect(response.data.isPassenger).toBe(true);
  expect(response.data.isDriver).toBe(false);
  expect(response.data.carPlate).toBeNull();
});

test("should create a ride on route /solicitate-ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const signupOutput = await axios.post(`${baseUrl}/signup`, signupInput);
  const input = {
    passengerId: signupOutput.data.accountId,
    fromLat: -23.56168,
    fromLong: -46.62543,
    toLat: -23.56168,
    toLong: -46.62543,
  };
  const response = await axios.post(`${baseUrl}/solicitate-ride`, input);
  expect(response.status).toBe(201);
  expect(response.data.rideId).toBeDefined();
});
