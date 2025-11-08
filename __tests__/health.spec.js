/* global jest */
const { describe, it, expect, afterAll } = require("@jest/globals");
const request = require("supertest");

process.env.NODE_ENV = "test";
process.env.SECRETS = "local-test-secrets";

const app = require("../server");

jest.mock("@aws-sdk/client-secrets-manager", () => ({
  SecretsManagerClient: jest.fn(),
  GetSecretValueCommand: jest.fn(),
}));

describe("Health endpoint", () => {
  it("GET /health should return 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "healthy");
  });
});

afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
