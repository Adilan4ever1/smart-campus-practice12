// Shared test inputs T1-T8 (Task 05). Used by the Node runner and the in-page test panel.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SmartCampusCases = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return [
    { id: "T1", name: "Valid free interval", input: { start: "2027-02-01T13:30", durationMinutes: 60, roomBlocked: false }, expected: { available: true, reasonCode: "AVAILABLE" } },
    { id: "T2", name: "Overlap with existing booking", input: { start: "2027-02-01T09:30", durationMinutes: 60, roomBlocked: false }, expected: { available: false, reasonCode: "OVERLAP" } },
    { id: "T3", name: "Blocked room", input: { start: "2027-02-01T13:30", durationMinutes: 60, roomBlocked: true }, expected: { available: false, reasonCode: "ROOM_BLOCKED" } },
    { id: "T4", name: "Duration = 0", input: { start: "2027-02-01T13:30", durationMinutes: 0, roomBlocked: false }, expected: { available: false, reasonCode: "INVALID_DURATION" } },
    { id: "T5", name: "Duration = 121", input: { start: "2027-02-01T13:30", durationMinutes: 121, roomBlocked: false }, expected: { available: false, reasonCode: "INVALID_DURATION" } },
    { id: "T6", name: "Past start time", input: { start: "2026-11-20T10:00", durationMinutes: 60, roomBlocked: false }, expected: { available: false, reasonCode: "START_IN_PAST" } },
    { id: "T7", name: "Adjacent, non-overlapping (10:30-12:00)", input: { start: "2027-02-01T10:30", durationMinutes: 90, roomBlocked: false }, expected: { available: true, reasonCode: "AVAILABLE" } },
    { id: "T8", name: "Bookings unchanged after T1-T7", input: null, expected: { unchanged: true } }
  ];
});
