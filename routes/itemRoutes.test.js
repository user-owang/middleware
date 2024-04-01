process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../shoppinglist");
let items = require("../fakeDB");
const { describe } = require("node:test");

let sample = { name: "test", price: 3.5 };

beforeEach(async () => {
  items.push(sample);
  console.log("************************", items);
});

afterEach(async () => {
  console.log("clear");
  items.length = 0;
  console.log(`**********************`, items);
  sample = { name: "test", price: 3.5 };
});

describe("get request /items", async () => {
  test("get a list of items", async () => {
    const response = await request(app).get("/items");
    console.log(`get  /items`);
    const body = response.body;
    expect(response.statusCode).toBe(200);
    expect(body).toHaveLength(1);
  });
});

describe("post request /items", async () => {
  test("add an item to items", async () => {
    const response = await request(app).post("/items").send({
      name: "nuts",
      price: 69,
    });
    console.log("post /items");
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toHaveProperty("name");
    expect(response.body.item).toHaveProperty("price");
    expect(response.body.item.name).toEqual("nuts");
    expect(response.body.item.price).toEqual(69);
    expect(items).toHaveLength(2);
  });
});

describe("get request /items/:name", async () => {
  test("get a specific item", async () => {
    const response = await request(app).get("/items/test");
    console.log("get /items/test");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("price");
    expect(response.body.name).toEqual("test");
    expect(response.body.price).toEqual(3.5);
  });
});

describe("patch request /items/:name", async () => {
  test("update name and/or price", async () => {
    const response = await request(app).patch("/items/test").send({
      name: "nuts",
      price: 69,
    });
    console.log("patch /items/test");
    expect(response.statusCode).toBe(200);
    expect(response.body.updated).toHaveProperty("name");
    expect(response.body.updated).toHaveProperty("price");
    expect(response.body.updated.name).toEqual("nuts");
    expect(response.body.updated.price).toEqual(69);
  });
});

describe("delete request /items/:name", async () => {
  test("delete item specific item in items", async () => {
    const response = await request(app).delete("/items/test");
    console.log("delete /items/test");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Deleted");
    expect(items).toEqual([]);
  });
});
