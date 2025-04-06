import request from "supertest";
import express from "express";
import searchRoute from "./search.js";

const app = express();
app.use(express.json());
app.use("/search", searchRoute);

describe("GET /search", () => {
  it("should return 200 and results for empty query", async () => {
    const response = await request(app).get("/search");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);
  });

  it("should return 200 and filtered results for query", async () => {
    const response = await request(app).get("/search?q=school");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
  });

  it("should return correct pagination with size and from", async () => {
    const response = await request(app).get("/search?size=5&from=0");

    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });

  it("should handle bad queries gracefully", async () => {
    const response = await request(app).get("/search?size=notanumber");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
  });
});
