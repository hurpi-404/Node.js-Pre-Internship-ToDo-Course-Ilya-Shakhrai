const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */

function analyzeEventLoop() {
  const analysis = {
    phases: [],
    executionOrder: [],
    explanations: [],
  };

  console.log("\n=== Event Loop Analysis Started ===\n");

  // Synchronous code
  analysis.executionOrder.push("1. Synchronous code");
  console.log("1. Synchronous code");

  // Microtasks: process.nextTick (highest priority)
  process.nextTick(() => {
    analysis.executionOrder.push(
      "3. process.nextTick (microtask - highest priority)",
    );
    console.log("3. process.nextTick (microtask - highest priority)");
  });

  // Microtasks: Promise (after nextTick)
  Promise.resolve().then(() => {
    analysis.executionOrder.push("4. Promise.then (microtask)");
    console.log("4. Promise.then (microtask)");
  });

  // Macrotask: setImmediate (check phase)
  setImmediate(() => {
    analysis.executionOrder.push("6. setImmediate (check phase - macrotask)");
    console.log("6. setImmediate (check phase - macrotask)");
  });

  // Macrotask: setTimeout 0ms (timers phase)
  setTimeout(() => {
    analysis.executionOrder.push(
      "5. setTimeout 0ms (timers phase - macrotask)",
    );
    console.log("5. setTimeout 0ms (timers phase - macrotask)");
  }, 0);

  // Macrotask: I/O operation (poll phase)
  fs.readFile(__filename, () => {
    analysis.executionOrder.push("7. fs.readFile (poll phase - I/O macrotask)");
    console.log("7. fs.readFile (poll phase - I/O macrotask)");

    // Nested microtask
    process.nextTick(() => {
      analysis.executionOrder.push("8. Nested process.nextTick (microtask)");
      console.log("8. Nested process.nextTick (microtask)");
    });

    // Nested setImmediate
    setImmediate(() => {
      analysis.executionOrder.push("9. Nested setImmediate (check phase)");
      console.log("9. Nested setImmediate (check phase)");
    });
  });

  analysis.executionOrder.push("2. Synchronous code end");
  console.log("2. Synchronous code end");

  // Event loop phases explanation
  analysis.phases = [
    {
      name: "Timers",
      description:
        "Executes callbacks scheduled by setTimeout() and setInterval()",
      example: "setTimeout(() => {}, 0)",
    },
    {
      name: "Pending Callbacks",
      description: "Executes I/O callbacks deferred to the next loop iteration",
      example: "TCP errors, etc.",
    },
    {
      name: "Idle, Prepare",
      description: "Internal use only",
      example: "N/A",
    },
    {
      name: "Poll",
      description: "Retrieve new I/O events; execute I/O related callbacks",
      example: "fs.readFile(), network operations",
    },
    {
      name: "Check",
      description: "setImmediate() callbacks are invoked here",
      example: "setImmediate(() => {})",
    },
    {
      name: "Close Callbacks",
      description: "Close event callbacks",
      example: 'socket.on("close", () => {})',
    },
  ];

  analysis.explanations = [
    "Microtasks (process.nextTick, Promises) execute BEFORE macrotasks",
    "process.nextTick has HIGHEST priority among all microtasks",
    "Promises execute after process.nextTick but before macrotasks",
    "setTimeout(0) and setImmediate order depends on context",
    "In I/O cycle, setImmediate executes before setTimeout",
    "Microtasks run after each phase completes",
    "Synchronous code always executes first",
  ];

  console.log("\n=== Event Loop Phases ===");
  analysis.phases.forEach((phase) => {
    console.log(`\n${phase.name}:`);
    console.log(`  Description: ${phase.description}`);
    console.log(`  Example: ${phase.example}`);
  });

  console.log("\n=== Key Explanations ===");
  analysis.explanations.forEach((exp, i) => {
    console.log(`${i + 1}. ${exp}`);
  });

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations

  const predictions = {
    snippet1: [
      "Start",
      "End",
      "Next Tick 1",
      "Next Tick 2",
      "Promise 1",
      "Promise 2",
      "Timer 1",
      "Timer 2",
      "Immediate 1",
      "Immediate 2",
    ],
    snippet2: [
      "=== Start ===",
      "=== End ===",
      "NextTick",
      "Nested NextTick",
      "Timer",
      "NextTick in Timer",
      "Immediate",
      "NextTick in Immediate",
      "fs.readFile",
      "NextTick in readFile",
      "Immediate in readFile",
      "Timer in readFile",
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  const files = ["file1.txt", "file2.txt", "file3.txt"];

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const content = await fsPromises.readFile(file, "utf-8");
        return content.toUpperCase();
      }),
    );
    return results;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  try {
    const [userData, prefData, activityData] = await Promise.all([
      fsPromises.readFile(`user-${userId}.json`, "utf-8"),
      fsPromises.readFile(`preferences-${userId}.json`, "utf-8"),
      fsPromises.readFile(`activity-${userId}.json`, "utf-8"),
    ]);

    const user = JSON.parse(userData);
    const preferences = JSON.parse(prefData);
    const activity = JSON.parse(activityData);

    const result = {
      ...user,
      preferences,
      activity,
    };

    await fsPromises.writeFile(
      `result-${userId}.json`,
      JSON.stringify(result, null, 2),
    );

    return null;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`ERROR: ${error.message}`);
    } else {
      console.error(`ERROR: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  try {
    const data = await fsPromises.readFile("input.txt", "utf-8");
    const processedData = data.toUpperCase();
    await fsPromises.writeFile("output.txt", processedData);
    const verifyData = await fsPromises.readFile("output.txt", "utf-8");
    return verifyData;
  } catch (error) {
    if (error.code === "ENOENT") {
      await fsPromises.writeFile("input.txt", "Hello World!", "utf-8");
      throw new Error("Created input file, please run again");
    }
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  return new Promise((resolve) => {
    console.log("\n=== Event Loop Demonstration ===");
    console.log("1. Synchronous code");

    // Microtasks
    process.nextTick(() => console.log("2. process.nextTick (microtask)"));
    Promise.resolve().then(() => console.log("3. Promise (microtask)"));

    // Timers phase
    setTimeout(() => console.log("4. setTimeout (timers phase)"), 0);

    // Check phase
    setImmediate(() => console.log("5. setImmediate (check phase)"));

    // Poll phase (I/O)
    fs.readFile(__filename, () => {
      console.log("6. fs.readFile (poll phase - I/O callback)");

      // After poll phase, microtasks run first
      process.nextTick(() =>
        console.log("7. Nested nextTick (microtask after I/O)"),
      );

      // Then setTimeout scheduled from I/O
      setTimeout(
        () => console.log("9. setTimeout inside I/O (next timers phase)"),
        0,
      );

      // setImmediate from I/O runs in CURRENT check phase (before setTimeout)
      setImmediate(() => {
        console.log(
          "8. setImmediate inside I/O (check phase - runs before setTimeout, because we didn't start new loop)",
        );
        resolve();
      });
    });
  }); //callback hell lmao
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    await Promise.all(
      Object.entries(testData).map(([filename, content]) =>
        fsPromises.writeFile(
          filename,
          typeof content === "string"
            ? content
            : JSON.stringify(content, null, 2),
        ),
      ),
    );
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${phase.toUpperCase()}] ${message}`);
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  async function runExamples() {
    console.log("🔄 Starting Event Loop Analysis Examples...\n");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log("=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Analyze execution order
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Analysis:", analysis);

    // Fix broken code
    console.log("\n=== Fixing Broken Code ===");
    try {
      await fixRaceCondition();
      console.log("✅ Race condition fixed");

      await fixCallbackHell(123);
      console.log("✅ Callback hell converted");

      await fixMixedAsync();
      console.log("✅ Mixed async resolved");
    } catch (error) {
      console.error("❌ Error fixing code:", error.message);
    }
  }

  runExamples();
}
