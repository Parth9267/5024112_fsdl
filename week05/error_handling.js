// error_handling.js

// custom error class extending the built-in Error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// a helper that may throw different kinds of errors
function processInput(input) {
  if (input === null || input === undefined) {
    // throw a plain Error
    throw new Error("No input provided");
  }
  if (typeof input !== "string") {
    // throw a built‑in TypeError
    throw new TypeError("Input must be a string");
  }
  if (input.trim().length === 0) {
    // throw our custom error
    throw new ValidationError("Input cannot be empty");
  }
  // simulate something that could also fail
  if (input === "boom") {
    throw { name: "AnonymousError", message: "Something exploded" };
  }

  return input.toUpperCase();
}

// using the error‑handling keywords
function main() {
  const testValues = [null, 123, "", "hello", "boom"];
  for (const val of testValues) {
    try {
      console.log("Processing:", val);
      const result = processInput(val);
      console.log("Result:", result);
    } catch (err) {
      // catch different error types
      if (err instanceof ValidationError) {
        console.warn("Validation failed:", err.message);
      } else if (err instanceof TypeError) {
        console.error("Type error:", err.message);
      } else if (err instanceof Error) {
        console.error("General error:", err.message);
      } else {
        // non‑Error throwables
        console.error("Unknown error object:", err);
      }

      // re‑throw if it's something we don't want to handle here
      if (val === "boom") {
        throw err; // demonstrates throwing from inside catch
      }
    } finally {
      // always runs, even after re‑throw
      console.log("Finished attempt for value:", val);
      console.log("-".repeat(40));
    }
  }
}

// run the example and catch any re‑thrown error
try {
  main();
} catch (e) {
  console.error("Unrecoverable error reached top level:", e);
}
