// Imports
const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { shouldBePresent } = require("./shouldBePresent.js");
const { getEnvVar } = require("./getEnvVar.js");
const { secretNames } = require("./index.js");

// Cliente de AWS Secrets Manager
const secretsManager = new SecretsManagerClient({ region: "us-east-1" });

// Función para establecer los secretos
async function setSecrets() {
  const secrets = {};

  for (const key of secretNames) {
    secrets[key] = shouldBePresent(process.env[`SECRET_${key}`]);
  }

  const command = new PutSecretValueCommand({
    SecretId: getEnvVar("SECRETS"),
    SecretString: JSON.stringify(secrets),
  });

  await secretsManager.send(command);
  console.log("✅ Successfully updated secrets in AWS Secrets Manager");
}

// Ejecutar la función y manejar errores
setSecrets().catch(console.error);
