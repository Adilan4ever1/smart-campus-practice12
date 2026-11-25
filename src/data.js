// Fictional data only. No real people, rooms or schedules.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SmartCampusData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function deepFreeze(obj) {
    Object.values(obj).forEach(function (v) {
      if (v && typeof v === "object") deepFreeze(v);
    });
    return Object.freeze(obj);
  }

  return deepFreeze({
    room: { id: "B-204", name: "Room B-204 (fictional)", capacity: 30 },
    bookings: [
      { id: "BK-1", title: "Algorithms lecture", start: "2027-02-01T09:00", end: "2027-02-01T10:30" },
      { id: "BK-2", title: "Design seminar", start: "2027-02-01T12:00", end: "2027-02-01T13:00" },
      { id: "BK-3", title: "Robotics club", start: "2027-02-01T15:00", end: "2027-02-01T16:00" }
    ]
  });
});
