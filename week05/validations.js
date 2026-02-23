// validations.js

// utility validators demonstrating common JS "validation keywords" like
// if/else, switch, typeof, instanceof, regex, and throwing errors.

// check for non-empty string
function isRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  // other types treat as present
  return true;
}

// validate email with simple regex
function isEmail(value) {
  if (typeof value !== "string") {
    return false;
  }
  // basic pattern: something@something.something
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(value);
}

// validate phone number digits only
function isPhoneNumber(value) {
  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }
  const digits = String(value).replace(/\D/g, "");
  // require 10 digits
  return digits.length === 10;
}

// generic validator using switch
function validate(field, value) {
  switch (field) {
    case "email":
      return isEmail(value);
    case "phone":
      return isPhoneNumber(value);
    case "name":
      return isRequired(value);
    default:
      // unknown field: throw to indicate programmer error
      throw new Error(`No validator for field "${field}"`);
  }
}

// validator that throws if validation fails
function assertValid(field, value) {
  const ok = validate(field, value);
  if (!ok) {
    throw new Error(`Validation failed: ${field} = ${value}`);
  }
  return true;
}

// demo usage
function demo() {
  const inputs = {
    email: "test@example.com",
    phone: "(555) 123-4567",
    name: "  ",
    age: 30, // no validator
  };

  for (const [field, val] of Object.entries(inputs)) {
    try {
      console.log(`Checking ${field}:`, val);
      assertValid(field, val);
      console.log("  -> valid");
    } catch (err) {
      console.error("  -> invalid:", err.message);
    }
  }
}

// run demo when file executed directly
if (require.main === module) {
  demo();
}
