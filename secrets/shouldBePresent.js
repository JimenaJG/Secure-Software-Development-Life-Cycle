function shouldBePresent(value, valueName = "value") {
  if (value === undefined || value === null) {
    throw new Error(`${valueName} is required`);
  }
  return value;
}

module.exports = { shouldBePresent };
