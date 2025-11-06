"use strict";
// Imports
const express = require("express");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");
const nunjucks = require("nunjucks");          
const helmet = require("helmet");              
const { loadSecrets } = require("./secrets/getSecrets.js");
const { getEnvVar } = require("./secrets/getEnvVar.js");
let app = express();

(async () => {
  // Cargar secretos desde AWS Secrets Manager
  await loadSecrets();

  // Variables de entorno cargadas dinámicamente
const OKTA_ISSUER_URI    = getEnvVar("OKTA_ISSUER_URI");
const OKTA_CLIENT_ID     = getEnvVar("OKTA_CLIENT_ID");
const OKTA_CLIENT_SECRET = getEnvVar("OKTA_CLIENT_SECRET");
const REDIRECT_URI       = getEnvVar("REDIRECT_URI");
const BASE_URL           = getEnvVar("BASE_URL");
const SECRET             = getEnvVar("SECRET");
const PORT               = getEnvVar("PORT") || "3000";

// Config de Auth (express-openid-connect)
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: OKTA_CLIENT_ID,
  issuerBaseURL: OKTA_ISSUER_URI,
};

// Okta OIDC (tu config actual)
let oidc = new ExpressOIDC({
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

// auth router: /login, /logout, /callback
app.use(auth(config));

// Middleware para registrar todas las peticiones
app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}`;
  console.log(log);
  next();
});


//Vistas con Nunjucks
const viewsPath = path.join(__dirname, "views");
nunjucks.configure(viewsPath, {
  autoescape: true,
  express: app,
  watch: false,
  noCache: false
});
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
  res.render("index"); // Renderiza views/index.html
});

app.get("/dashboard", requiresAuth(), (req, res) => {
  const userInfo = req.oidc && req.oidc.user ? req.oidc.user : {};
  res.render("dashboard", { user: userInfo }); // views/dashboard.html
});

//ruta de dashboard sin auth
/*
app.get("/dashboard", (req, res) => {
  const fakeUser = {
    email: "test@correo.com",
    nickname: "usuario_prueba",
  };
  res.render("dashboard", { user: fakeUser });
});
*/

// OpenID client tuning
const { Issuer } = require("openid-client");
Issuer.defaultHttpOptions = { timeout: 20000 };

// Eventos de OIDC
oidc.on("ready", () => {
  console.log("Server running on port: " + PORT);
  app.listen(parseInt(PORT, 10));
});

oidc.on("error", (err) => {
  console.error(err);
});

console.log("🧪 REDIRECT_URI:", process.env.REDIRECT_URI);
console.log("🧪 CLIENT_ID:", process.env.OKTA_CLIENT_ID);

})();
