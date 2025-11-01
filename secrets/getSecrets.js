const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { shouldBePresent } = require("./shouldBePresent.js");
const { assertField } = require("./assertField.js");
const { getEnvVar } = require("./getEnvVar.js");

const secretNames = [
  "OKTA_ISSUER_URI",
  "OKTA_CLIENT_ID",
  "OKTA_CLIENT_SECRET",
  "REDIRECT_URI",
  "BASE_URL",
  "PORT",
  "SECRET",
];

const getSecrets = async () => {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const command = new GetSecretValueCommand({
    SecretId: getEnvVar("SECRETS"),
  });

  const { SecretString } = await client.send(command);
  return shouldBePresent(SecretString);
};

const getSecret = async (name) => {
  const secrets = JSON.parse(await getSecrets());
  return assertField(secrets, name);
};

const loadSecrets = async () => {
  const secrets = JSON.parse(await getSecrets());
  for (const key of secretNames) {
    process.env[key] = assertField(secrets, key);
  }
};

module.exports = {
  loadSecrets,
  getSecret,
  secretNames,
};
console.log("🔍 Loading from secret:", getEnvVar("SECRETS"));
