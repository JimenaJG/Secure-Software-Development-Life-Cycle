"use strict";

// Imports
const express = require("express");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");
const nunjucks = require("nunjucks");          // 👈 NUEVO motor
const helmet = require("helmet");              // 👈 Seguridad (opcional recomendado)
let app = express();

// Environment variables
require("dotenv").config();
const OKTA_ISSUER_URI    = process.env.OKTA_ISSUER_URI;
const OKTA_CLIENT_ID     = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const REDIRECT_URI       = process.env.REDIRECT_URI;
const PORT               = process.env.PORT || "3000";
const SECRET             = process.env.SECRET;

// Config de Auth (express-openid-connect)
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.OKTA_CLIENT_ID,
  issuerBaseURL: process.env.OKTA_ISSUER_URI,
};

// Okta OIDC (tu config actual)
let oidc = new ExpressOIDC({
  issuer: OKTA_ISSUER_URI,
  client_id: OKTA_CLIENT_ID,
  client_secret: OKTA_CLIENT_SECRET,
  appBaseUrl: process.env.BASE_URL,
  redirect_uri: REDIRECT_URI,
  routes: { callback: { defaultRedirect: "http://localhost:3000/dashboard" } },
  scope: "openid profile",
});

// Seguridad básica (podés dejarlo así)
app.use(helmet({ contentSecurityPolicy: false }));

// auth router: /login, /logout, /callback
app.use(auth(config));

// 🔧 Vistas con Nunjucks (reemplaza a swig/consolidate)
const viewsPath = path.join(__dirname, "views"); // carpeta donde están tus .html
nunjucks.configure(viewsPath, {
  autoescape: true, // protege XSS automáticamente
  express: app,
  watch: false,     // poné true en desarrollo si querés recarga
  noCache: false    // poné true en desarrollo si querés sin caché
});
app.set("view engine", "html");
app.set("views", viewsPath);

// Archivos estáticos (CSS/JS/imagenes)
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

// Rutas propias
app.get("/", (req, res) => {
  res.render("index"); // Renderiza views/index.html
});

app.get("/dashboard", requiresAuth(), (req, res) => {
  // Usar el perfil que ya decodifica express-openid-connect
  const userInfo = (req.oidc && req.oidc.user) ? req.oidc.user : {};
  res.render("dashboard", { user: userInfo }); // views/dashboard.html
});

// OpenID client tuning
const { Issuer } = require("openid-client");
Issuer.defaultHttpOptions = { timeout: 20000 };

oidc.on("ready", () => {
  console.log("Server running on port: " + PORT);
  app.listen(parseInt(PORT, 10));
});

oidc.on("error", (err) => {
  console.error(err);
});
