// Imports
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { shouldBePresent } = require("./shouldBePresent.js");
const { assertField } = require("./assertField.js");
const { getEnvVar } = require("./getEnvVar.js");

// Lista de nombres de secretos
const secretNames = [
  "OKTA_ISSUER_URI",
  "OKTA_CLIENT_ID",
  "OKTA_CLIENT_SECRET",
  "REDIRECT_URI",
  "BASE_URL",
  "PORT",
  "SECRET",
];

// Función para obtener los secretos desde AWS Secrets Manager
const getSecrets = async () => {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const command = new GetSecretValueCommand({
    SecretId: getEnvVar("SECRETS"), // Nombre del secreto de AWS (AppBeta/APIKeys)
  });

  const { SecretString } = await client.send(command);
  return shouldBePresent(SecretString);
};

// Función para obtener un secreto específico por nombre
const getSecret = async (name) => {
  const secrets = JSON.parse(await getSecrets());
  return assertField(secrets, name);
};

// Exportaciones
module.exports = {
  getSecret,
  secretNames,
};
