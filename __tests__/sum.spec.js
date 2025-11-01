const { describe, it, expect } = require("@jest/globals");

// Given / When / Then (estilo BDD)
function sum(a, b) { return a + b; }

describe("sum()", () => {
  it("Given two numbers, When sum, Then returns the arithmetic sum", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
