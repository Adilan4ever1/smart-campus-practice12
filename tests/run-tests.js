// Node test runner: node tests/run-tests.js
// Uses a fixed clock so results do not depend on when the tests run.
"use strict";
const rules = require("../src/rules.js");
const data = require("../src/data.js");
const cases = require("./cases.js");

const NOW = new Date(2026, 10, 25, 12, 0); // 2026-11-25 12:00 local
const before = JSON.stringify(data.bookings);
let passed = 0;
const rows = [];

for (const tc of cases) {
  let observed, ok;
  if (tc.id === "T8") {
    const after = JSON.stringify(data.bookings);
    ok = before === after && data.bookings.length === 3;
    observed = ok ? "3 bookings, identical JSON" : "bookings changed";
  } else {
    const r = rules.checkAvailability(tc.input, data.bookings, NOW);
    ok = r.available === tc.expected.available && r.reasonCode === tc.expected.reasonCode;
    observed = (r.available ? "Available" : "Unavailable") + " / " + r.reasonCode + " / " + r.message;
  }
  if (ok) passed++;
  rows.push(`${ok ? "PASS" : "FAIL"}  ${tc.id}  ${tc.name.padEnd(40)} ${observed}`);
}

// Extra unit checks that support AC6 and the security review.
const extra = [
  ["malformed start rejected", rules.checkAvailability({ start: "<script>", durationMinutes: 30 }, data.bookings, NOW).reasonCode === "INVALID_INPUT"],
  ["impossible date rejected", rules.checkAvailability({ start: "2027-02-30T10:00", durationMinutes: 30 }, data.bookings, NOW).reasonCode === "INVALID_INPUT"],
  ["fractional duration rejected", rules.checkAvailability({ start: "2027-02-01T13:30", durationMinutes: 1.5 }, data.bookings, NOW).reasonCode === "INVALID_DURATION"],
  ["empty duration rejected", rules.checkAvailability({ start: "2027-02-01T13:30", durationMinutes: "" }, data.bookings, NOW).reasonCode === "INVALID_DURATION"],
  ["120 minutes accepted (boundary)", rules.checkAvailability({ start: "2027-02-01T16:00", durationMinutes: 120 }, data.bookings, NOW).available === true],
  ["bookings array is frozen", Object.isFrozen(data.bookings) && Object.isFrozen(data.bookings[0])]
];

console.log("Smart Campus Room Availability - acceptance tests");
console.log("Clock fixed at 2026-11-25 12:00\n");
rows.forEach((r) => console.log(r));
console.log(`\nAcceptance tests: ${passed}/${cases.length} passed`);
console.log("\nExtra unit checks:");
let extraPassed = 0;
extra.forEach(([name, ok]) => { if (ok) extraPassed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); });
console.log(`Extra checks: ${extraPassed}/${extra.length} passed`);
process.exit(passed === cases.length && extraPassed === extra.length ? 0 : 1);
