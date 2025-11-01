// Imports
const { shouldBePresent } = require("./shouldBePresent.js");

function assertField(obj, key) {
  if (!(key in obj)) {
    throw new Error(`Missing field '${String(key)}' in the object.`);
  }
  return shouldBePresent(obj[key]);
}

module.exports = { assertField };