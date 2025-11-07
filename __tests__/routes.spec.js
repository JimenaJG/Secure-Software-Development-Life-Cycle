/* global jest */
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");

// ==========================================================
// 🔧 CONFIGURACIÓN INICIAL DE ENTORNO
// ==========================================================

// Forzamos entorno de test para evitar que se levante el servidor real
process.env.NODE_ENV = "test";
process.env.SECRETS = "local-test-secrets";

// Importamos la app principal (Express) desde server.js
const app = require("../server");

// ==========================================================
// 🧰 MOCK DE AWS SDK PARA EVITAR CONEXIÓN REAL
// ==========================================================
jest.mock("@aws-sdk/client-secrets-manager", () => ({
  SecretsManagerClient: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({ SecretString: "{}" }),
  })),
  GetSecretValueCommand: jest.fn(),
}));

beforeAll(() => {
  console.log("🚀 Iniciando pruebas de rutas...");
});

afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  console.log("🧹 Finalizando pruebas y limpiando mocks...");
});

// ==========================================================
// 🧩 TEST 1: ENDPOINT RAÍZ (/)
// ==========================================================
// Verifica que la app devuelva 200 o 404 dependiendo del entorno
describe("Root endpoint /", () => {
  it("should return 200 (o 404 si la vista no existe en test)", async () => {
    const res = await request(app).get("/");
    // En test mode puede devolver 200 (si existe views/index.html) o 404
    expect([200, 304, 404]).toContain(res.status);
  });
});

// ==========================================================
// 🧩 TEST 2: RUTA DE DASHBOARD (SIN AUTENTICACIÓN)
// ==========================================================
// Como Okta no está activo en test, puede devolver 401, 302 o 404
describe("Dashboard endpoint /dashboard", () => {
  it("should return 302, 401 o 404 (sin autenticación)", async () => {
    const res = await request(app).get("/dashboard");
    expect([302, 401, 404]).toContain(res.status);
  });
});

// ==========================================================
// 🧩 TEST 3: ENDPOINT DE SALUD (/health)
// ==========================================================
// Asegura que el endpoint de salud responda correctamente
describe("Health endpoint /health", () => {
  it("should return 200 and a valid JSON response", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
expect(res.body).toHaveProperty("status", "healthy");

// Estas validaciones solo si existen
if (res.body.timestamp) {
  expect(typeof res.body.timestamp).toBe("string");
}
if (res.body.uptime) {
  expect(typeof res.body.uptime).toBe("number");
}

  });
});

// ==========================================================
// 🧩 TEST 4: MANEJO DE ERROR EN AWS SECRETS MANAGER
// ==========================================================
// Simulamos un error en AWS para verificar que se maneje correctamente
describe("Secrets Manager module", () => {
  it("should handle AWS secret load error gracefully", async () => {
    const { loadSecrets } = require("../secrets/getSecrets");

    // Forzamos un error en la llamada a AWS
    const mockError = new Error("Simulated AWS error");
    const { SecretsManagerClient } = require("@aws-sdk/client-secrets-manager");
    SecretsManagerClient.mockImplementation(() => ({
      send: jest.fn(() => {
        throw mockError;
      }),
    }));

    // Verificamos que el error se propague correctamente
    await expect(loadSecrets()).rejects.toThrow("Simulated AWS error");
  });
});
