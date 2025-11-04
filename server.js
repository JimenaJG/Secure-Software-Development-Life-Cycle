"use strict";

const express = require("express");
const session = require("express-session");
const { ExpressOIDC } = require("@okta/oidc-middleware");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");
const nunjucks = require("nunjucks");
const helmet = require("helmet");
const { loadSecrets } = require("./secrets/getSecrets.js");
const { getEnvVar } = require("./secrets/getEnvVar.js");

const app = express();

(async () => {
  // 🔹 Si estamos corriendo tests, no cargues secretos ni inicies OIDC
  if (process.env.NODE_ENV === "test") {
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", test: true });
    });
    return; // importante: no seguir la configuración completa
  }

  // Cargar secretos desde AWS Secrets Manager
  await loadSecrets();

  // Variables de entorno cargadas dinámicamente
  const OKTA_ISSUER_URI = getEnvVar("OKTA_ISSUER_URI");
  const OKTA_CLIENT_ID = getEnvVar("OKTA_CLIENT_ID");
  const OKTA_CLIENT_SECRET = getEnvVar("OKTA_CLIENT_SECRET");
  const REDIRECT_URI = getEnvVar("REDIRECT_URI");
  const BASE_URL = getEnvVar("BASE_URL");
  const SECRET = getEnvVar("SECRET");
  const PORT = getEnvVar("PORT") || "3000";

  // Config de Auth (express-openid-connect)
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: SECRET,
    baseURL: BASE_URL,
    clientID: OKTA_CLIENT_ID,
    issuerBaseURL: OKTA_ISSUER_URI,
  };

  // Okta OIDC
  const oidc = new ExpressOIDC({
    issuer: OKTA_ISSUER_URI,
    client_id: OKTA_CLIENT_ID,
    client_secret: OKTA_CLIENT_SECRET,
    appBaseUrl: BASE_URL,
    redirect_uri: REDIRECT_URI,
    routes: { callback: { defaultRedirect: `${BASE_URL}/dashboard` } },
    scope: "openid profile",
  });

  // Seguridad básica
  app.use(helmet({ contentSecurityPolicy: false }));

  // Auth router
  app.use(auth(config));

  // Vistas con Nunjucks
  const viewsPath = path.join(__dirname, "views");
  nunjucks.configure(viewsPath, { autoescape: true, express: app, watch: false, noCache: false });
  
  app.set("view engine", "html");
  app.set("views", viewsPath);

  // Archivos estáticos
  app.use("/static", express.static("static"));

  // Sesiones
  app.use(
    session({
      cookie: { httpOnly: true },
      secret: SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Rutas adicionales de Okta
  app.use(oidc.router);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Rutas propias
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/dashboard", requiresAuth(), (req, res) => {
    const userInfo = req.oidc?.user || {};
    res.render("dashboard", { user: userInfo });
  });

  const { Issuer } = require("openid-client");
Issuer.defaultHttpOptions = { timeout: 20000 };

  // Eventos de OIDC
  oidc.on("ready", () => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Server running on port: " + PORT);
      app.listen(parseInt(PORT, 10));
    }
  });

  oidc.on("error", (err) => console.error(err));

  console.log("🧪 REDIRECT_URI:", REDIRECT_URI);
  console.log("🧪 CLIENT_ID:", OKTA_CLIENT_ID);
})();

// Exportar para Supertest
module.exports = app;
