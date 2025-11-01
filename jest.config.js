/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  // ✔️ Umbrales mínimos (ajusta si te queda muy estricto):
  coverageThreshold: {
    global: { branches: 60, functions: 70, lines: 75, statements: 75 }
  }
};
