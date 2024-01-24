import axios from "axios";

test("should create an account on route /signup", async () => {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "968.896.412-30",
    isPassenger: true,
  };
  const response = await axios.post("http://localhost:5000/signup", input);
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
  const { data } = await axios.post("http://localhost:5000/signup", input);
  const response = await axios.get(
    `http://localhost:5000/account/${data.accountId}`
  );
  expect(response.status).toBe(200);
  expect(response.data).toEqual({
    account_id: data.accountId,
    name: "John Doe",
    email: input.email,
    cpf: "968.896.412-30",
    car_plate: null,
    is_passenger: true,
    is_driver: false,
  });
});
