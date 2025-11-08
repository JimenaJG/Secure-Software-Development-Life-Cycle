class SecretsManagerClient {
  send() {
    return Promise.resolve({
      SecretString: JSON.stringify({
        OKTA_ISSUER_URI: "https://fake.okta.com",
        OKTA_CLIENT_ID: "test-client",
        OKTA_CLIENT_SECRET: "test-secret",
        REDIRECT_URI: "http://localhost:3000/dashboard",
        BASE_URL: "http://localhost:3000",
        PORT: "3000",
        SECRET: "test-key",
      }),
    });
  }
}
class GetSecretValueCommand {}
module.exports = { SecretsManagerClient, GetSecretValueCommand };
