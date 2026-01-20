const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop();

    for (const line of lines) {
      this.lineNumber++;
      if (this.lineNumber === 1) {
        this.headers = line.split(",");
        continue;
      }

      const values = line.split(",");
      const record = {};
      for (let i = 0; i < this.headers.length; i++) {
        record[this.headers[i]] = values[i];
      }
      this.push(record);
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer) {
      const values = this.buffer.split(", ");
      const record = {};
      this.headers.forEach((header, index) => {
        record[header] = values[index];
      });
    }
    callback();
  }
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    if (record.name) record.name = capitalizeName(record.name);

    if (record.email) record.email = normalizeEmail(record.email);

    if (record.phone) record.phone = formatPhone(record.phone);

    if (record.date) record.date = standardizeDate(record.date);

    if (record.city) record.city = capitalizeName(record.city);

    this.push(record);

    callback();
  }
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headerWritten = false;
  }

  _transform(record, encoding, callback) {
    if (!this.headerWritten) {
      const headers = Object.keys(record);
      this.push(headers.join(", ") + "\n");
      this.headerWritten = true;
    }

    const values = Object.values(record).map((value) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });

    this.push(values.join(", ") + "\n");
    callback();
  }
}

/**
 * Helper Functions
 */

function capitalizeName(name) {
  if (!name) return name;
  const words = name.split(" ");

  const capitalizedWords = words.map((word) => {
    const parts = word.split("-");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join("-");
  });
  return capitalizedWords.join(" ");
}

function normalizeEmail(email) {
  if (!email) return email;

  const normalized = email.toLowerCase().trim();

  if (email.includes("@") && email.includes(".")) return normalized;

  return email;
}

function formatPhone(phone) {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 10) return "INVALID";

  const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
    6,
    10,
  )}`;

  return formatted;
}

function standardizeDate(date) {
  if (!date) return date;
  const parts = date.split(/[-/]/);
  if (parts.length !== 3) return date;
  if (parts[0].length === 4) {
    return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
  } else {
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
  try {
    await pipeline(
      fs.createReadStream(inputPath),
      new CSVParser(),
      new DataTransformer(),
      new CSVWriter(),
      fs.createWriteStream(outputPath),
    );
  } catch (error) {
    throw new Error(`Failed to process CSV file: ${error.message}`);
  }
}

/**
 * Create sample input data for testing
 */
function createSampleData() {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  const sampleData = `name,email,phone,birthdate,city
  john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
  jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
  bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
  alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;

  fs.writeFileSync("data/users.csv", sampleData, "utf-8");
}

// Export classes and functions
module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  // Create sample data
  createSampleData();

  // Process the file
  processCSVFile("data/users.csv", "data/users_transformed.csv")
    .then(() => {
      console.log("✅ File transformation completed successfully!");

      // Read and display results
      const output = fs.readFileSync("data/users_transformed.csv", "utf-8");
      console.log("\n📄 Transformed CSV output:");
      console.log(output);
    })
    .catch((error) => {
      console.error("❌ Error processing file:", error.message);
    });
}
