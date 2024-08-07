function calculator() {
  let result = 0; // The state variable

  function add(value) {
    result += value;
    return this; // Enable chaining
  }

  function subtract(value) {
    result -= value;
    return this;
  }

  function multiply(value) {
    result *= value;
    return this;
  }

  function divide(value) {
    if (value === 0) {
      throw new Error("Division by zero");
    }
    result /= value;
    return this;
  }

  function clear() {
    result = 0;
    return this;
  }

  function getResult() {
    return result;
  }

  // Return methods as an object to expose them to the outside
  return {
    add,
    subtract,
    multiply,
    divide,
    clear,
    getResult,
  };
}

const calc = calculator();

calc.add(5).multiply(3).subtract(1); // (5 + 3) * 3 - 1 = 14
console.log(calc.getResult()); // 14

calc.clear().add(20).divide(4); // 20 / 4 = 5
console.log(calc.getResult()); // 5
