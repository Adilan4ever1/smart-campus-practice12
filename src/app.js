// Presentation layer. Reads the form, calls the rule engine, renders with textContent only.
(function () {
  "use strict";
  var rules = window.SmartCampusRules;
  var data = window.SmartCampusData;
  var cases = window.SmartCampusCases;

  function $(id) { return document.getElementById(id); }

  function cell(tr, text, cls) {
    var td = document.createElement("td");
    td.textContent = text;
    if (cls) td.className = cls;
    tr.appendChild(td);
    return td;
  }

  // Simple checksum so the page can show the bookings did not change (T8).
  function checksum(list) {
    var s = JSON.stringify(list), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h.toString(16).toUpperCase();
  }

  function renderBookings() {
    $("room-name").textContent = data.room.name + ", capacity " + data.room.capacity;
    var body = $("bookings-body");
    body.textContent = "";
    data.bookings.forEach(function (b) {
      var tr = document.createElement("tr");
      cell(tr, b.id); cell(tr, b.title); cell(tr, b.start.replace("T", " ")); cell(tr, b.end.slice(11));
      body.appendChild(tr);
    });
    $("bookings-hash").textContent = data.bookings.length + " bookings, checksum " + checksum(data.bookings);
  }

  function showResult(r) {
    var box = $("result");
    box.hidden = false;
    box.className = "result " + (r.available ? "ok" : (r.reasonCode === "OVERLAP" || r.reasonCode === "ROOM_BLOCKED" ? "no" : "warn"));
    $("result-title").textContent = r.available ? "Available" : (box.className.indexOf("warn") > -1 ? "Check your input" : "Unavailable");
    $("result-message").textContent = r.message;
    $("result-code").textContent = r.reasonCode;
  }

  $("check-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var r = rules.checkAvailability({
      start: $("start").value,
      durationMinutes: $("duration").value,
      roomBlocked: $("blocked").checked
    }, data.bookings, new Date());
    showResult(r);
  });

  function describe(input) {
    if (!input) return "Compare bookings before and after T1-T7";
    return input.start.replace("T", " ") + ", " + input.durationMinutes + " min" + (input.roomBlocked ? ", blocked" : "");
  }

  $("run-tests").addEventListener("click", function () {
    var before = checksum(data.bookings);
    var body = $("tests-body");
    body.textContent = "";
    var passed = 0;
    cases.forEach(function (tc) {
      var ok, observed, expected;
      if (tc.id === "T8") {
        var after = checksum(data.bookings);
        ok = before === after && data.bookings.length === 3;
        expected = "Bookings unchanged";
        observed = "Checksum " + before + " -> " + after + ", " + data.bookings.length + " bookings";
      } else {
        var r = rules.checkAvailability(tc.input, data.bookings, new Date());
        ok = r.available === tc.expected.available && r.reasonCode === tc.expected.reasonCode;
        expected = (tc.expected.available ? "Available" : "Unavailable") + " / " + tc.expected.reasonCode;
        observed = (r.available ? "Available" : "Unavailable") + " / " + r.reasonCode;
      }
      if (ok) passed++;
      var tr = document.createElement("tr");
      cell(tr, tc.id + " " + tc.name);
      cell(tr, describe(tc.input));
      cell(tr, expected);
      cell(tr, observed);
      cell(tr, ok ? "PASS" : "FAIL", ok ? "pass" : "fail");
      body.appendChild(tr);
    });
    $("tests-summary").textContent = passed + " / " + cases.length + " passed (run at " + new Date().toLocaleString() + ")";
    renderBookings();
  });

  renderBookings();
})();
