// Comentario: si en server.js haces `const app = express(); module.exports = app;`
// este test funcionará importando esa app.
const { describe, it, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../server"); // ajusta la ruta según exportes app

process.env.SECRETS = "local-test-secrets";

describe("Health endpoint", () => {
  it("Given server is running, When GET /health, Then returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    // opcional: expect(res.body).toEqual({ ok: true });
  });
});
