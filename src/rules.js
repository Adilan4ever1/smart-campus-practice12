// Smart Campus Room Availability - deterministic rule engine.
// No DOM access here: validation and availability logic only.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SmartCampusRules = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MAX_DURATION_MIN = 120;

  var REASONS = Object.freeze({
    AVAILABLE: "AVAILABLE",
    INVALID_INPUT: "INVALID_INPUT",
    START_IN_PAST: "START_IN_PAST",
    INVALID_DURATION: "INVALID_DURATION",
    ROOM_BLOCKED: "ROOM_BLOCKED",
    OVERLAP: "OVERLAP"
  });

  // Parses "YYYY-MM-DDTHH:MM" as local time. Returns null when malformed.
  function parseLocal(value) {
    if (typeof value !== "string") return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
    // Reject impossible dates such as 2027-02-30.
    if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
    return d;
  }

  function fmt(value) {
    return value.replace("T", " ");
  }

  // AC1, AC2, AC6. Returns null when the request is valid.
  function validate(request, now) {
    var start = parseLocal(request.start);
    if (!start) {
      return { reasonCode: REASONS.INVALID_INPUT, message: "Enter a start date and time." };
    }
    if (start.getTime() <= now.getTime()) {
      return { reasonCode: REASONS.START_IN_PAST, message: "The start time must be in the future." };
    }
    var raw = request.durationMinutes;
    var duration = typeof raw === "number" ? raw : Number(String(raw).trim());
    if (raw === "" || raw === null || raw === undefined || !Number.isInteger(duration)) {
      return { reasonCode: REASONS.INVALID_DURATION, message: "Duration must be a whole number of minutes." };
    }
    if (duration <= 0 || duration > MAX_DURATION_MIN) {
      return {
        reasonCode: REASONS.INVALID_DURATION,
        message: "Duration must be between 1 and " + MAX_DURATION_MIN + " minutes."
      };
    }
    return null;
  }

  // Half-open intervals [start, end): touching edges do not overlap (T7).
  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  // Pure function: never mutates bookings (AC5, T8).
  function checkAvailability(request, bookings, now) {
    var error = validate(request, now);
    if (error) return { available: false, reasonCode: error.reasonCode, message: error.message, conflict: null };

    if (request.roomBlocked === true) {
      return {
        available: false,
        reasonCode: REASONS.ROOM_BLOCKED,
        message: "Unavailable: the room is blocked (maintenance).",
        conflict: null
      };
    }

    var start = parseLocal(request.start).getTime();
    var end = start + Number(request.durationMinutes) * 60000;

    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      if (overlaps(start, end, parseLocal(b.start).getTime(), parseLocal(b.end).getTime())) {
        return {
          available: false,
          reasonCode: REASONS.OVERLAP,
          message: "Unavailable: overlaps " + b.title + " (" + fmt(b.start) + " to " + b.end.slice(11) + ").",
          conflict: b.id
        };
      }
    }

    return { available: true, reasonCode: REASONS.AVAILABLE, message: "Available: the room is free for this slot.", conflict: null };
  }

  return {
    MAX_DURATION_MIN: MAX_DURATION_MIN,
    REASONS: REASONS,
    parseLocal: parseLocal,
    validate: validate,
    overlaps: overlaps,
    checkAvailability: checkAvailability
  };
});
