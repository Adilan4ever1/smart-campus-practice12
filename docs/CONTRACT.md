# Shared contract: Smart Campus Room Availability Checker

This sheet is the single specification used for both the code-based and the low-code (Power Apps) solution. Neither implementation was allowed to change it.

## User story

As a student, I want to pick a future start time and a duration for Room B-204, so that I can see straight away whether the room is available and, if it is not, why.

## Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | The start time must be in the future. |
| AC2 | Duration must be greater than zero and at most 120 minutes. |
| AC3 | A request that overlaps an existing booking is unavailable. |
| AC4 | A blocked room is unavailable. |
| AC5 | The app displays a clear decision and never changes the existing bookings. |
| AC6 | Invalid input receives understandable feedback. |

## Inputs

| Input | Type | Notes |
|-------|------|-------|
| Start time | Date and time, local, minute precision | Required |
| Duration | Whole number of minutes | Required, 1 to 120 |
| Blocked flag | Boolean | Simulates the room being closed for maintenance |
| Bookings | Fixed, read-only list | Fictional, see below |

## Outputs

| Output | Type | Values |
|--------|------|--------|
| available | Boolean | true only for reason code AVAILABLE |
| reasonCode | Text | AVAILABLE, OVERLAP, ROOM_BLOCKED, START_IN_PAST, INVALID_DURATION, INVALID_INPUT |
| message | Text | Short sentence shown to the student |

## Rule order

1. Missing or malformed start time: INVALID_INPUT
2. Start time not after the current time: START_IN_PAST (AC1)
3. Duration not a whole number in 1 to 120: INVALID_DURATION (AC2)
4. Blocked flag set: ROOM_BLOCKED (AC4)
5. Requested interval overlaps a booking: OVERLAP (AC3). Intervals are half-open, `[start, end)`, so a request that ends exactly when a booking starts, or starts exactly when one ends, does not overlap.
6. Otherwise: AVAILABLE

## Fictional bookings (Room B-204, capacity 30)

| ID | Title | Start | End |
|----|-------|-------|-----|
| BK-1 | Algorithms lecture | 2027-02-01 09:00 | 10:30 |
| BK-2 | Design seminar | 2027-02-01 12:00 | 13:00 |
| BK-3 | Robotics club | 2027-02-01 15:00 | 16:00 |

No real personal data, no login, no payment and no production database are used.

## Common test inputs (prepared before implementation)

| Test | Start | Duration | Blocked | Expected |
|------|-------|----------|---------|----------|
| T1 Valid free interval | 2027-02-01 13:30 | 60 | No | Available / AVAILABLE |
| T2 Overlap | 2027-02-01 09:30 | 60 | No | Unavailable / OVERLAP (BK-1) |
| T3 Blocked room | 2027-02-01 13:30 | 60 | Yes | Unavailable / ROOM_BLOCKED |
| T4 Duration 0 | 2027-02-01 13:30 | 0 | No | Validation error / INVALID_DURATION |
| T5 Duration 121 | 2027-02-01 13:30 | 121 | No | Validation error / INVALID_DURATION |
| T6 Past start | 2026-11-20 10:00 | 60 | No | Validation error / START_IN_PAST |
| T7 Adjacent interval | 2027-02-01 10:30 | 90 | No | Available / AVAILABLE (ends 12:00, touches BK-1 and BK-2) |
| T8 Data unchanged | n/a | n/a | n/a | 3 bookings, identical before and after T1 to T7 |
