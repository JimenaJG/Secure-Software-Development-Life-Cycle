/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",       // Usa entorno Node (sin navegador)
  collectCoverage: true,         // Activa reporte de cobertura
  coverageDirectory: "coverage", // Carpeta donde se guardan los reportes
  coverageReporters: ["text", "lcov"],

  // ✔️ Umbrales mínimos (puedes ajustarlos)
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },

  // ✅ NUEVO: para evitar procesos abiertos y mensajes "leaking handles"
  detectOpenHandles: true, // detecta procesos/timers abiertos
  forceExit: true,          // fuerza Jest a cerrar el proceso al terminar
  clearMocks: true,         // limpia automáticamente todos los mocks tras cada test
  restoreMocks: true,       // restaura mocks al estado original
  resetMocks: true,         // reinicia mocks entre tests
};
