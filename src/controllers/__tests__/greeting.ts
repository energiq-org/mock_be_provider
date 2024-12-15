import { Express } from "express";
import request from "supertest";

import { createServer } from "../../app";

let server: Express;

beforeAll(() => {
  server = createServer();
});

afterAll(async () => {});

describe("GET /hello", () => {
  it("should return 200 & valid response if request param list is empty", async () => {
    const res = await request(server).get(`/api/v1/hello`).expect("Content-Type", /json/).expect(200);

    expect(res.body).toMatchObject({ message: "Hello, stranger!" });
  });

  it("should return 200 & valid response if name param is set", async () => {
    const res = await request(server).get(`/api/v1/hello?name=Test%20Name`).expect("Content-Type", /json/).expect(200);

    expect(res.body).toMatchObject({ message: "Hello, Test Name!" });
  });

  it("should return 400 & valid error response if name param is empty", async () => {
    const res = await request(server).get(`/api/v1/hello?name=`).expect("Content-Type", /json/).expect(400);

    expect(res.body).toMatchObject({
      error: {
        type: "request_validation",
        message: expect.stringMatching(/Empty.*'name'/),
        errors: expect.anything(),
      },
    });
  });
});
