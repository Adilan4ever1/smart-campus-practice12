Bookings = Table(
    {ID: "BK-1"; Title: "Algorithms lecture"; BookStart: DateTime(2027; 2; 1; 9; 0; 0); BookEnd: DateTime(2027; 2; 1; 10; 30; 0)};
    {ID: "BK-2"; Title: "Design seminar"; BookStart: DateTime(2027; 2; 1; 12; 0; 0); BookEnd: DateTime(2027; 2; 1; 13; 0; 0)};
    {ID: "BK-3"; Title: "Robotics club"; BookStart: DateTime(2027; 2; 1; 15; 0; 0); BookEnd: DateTime(2027; 2; 1; 16; 0; 0)}
);;

MaxDuration = 120;;

DurationValid(pDuration: Text): Boolean =
    IsMatch(Trim(pDuration); "\d{1,4}") && Value(Trim(pDuration)) >= 1 && Value(Trim(pDuration)) <= MaxDuration;;

FirstConflict(pStart: DateTime; pMinutes: Number): Text =
    First(Filter(Bookings; pStart < BookEnd && DateAdd(pStart; pMinutes; TimeUnit.Minutes) > BookStart)).ID;;

ReasonCode(pStart: DateTime; pDuration: Text; pBlocked: Boolean; pNow: DateTime): Text =
    If(
        IsBlank(pStart); "INVALID_INPUT";
        pStart <= pNow; "START_IN_PAST";
        !DurationValid(pDuration); "INVALID_DURATION";
        pBlocked; "ROOM_BLOCKED";
        !IsBlank(FirstConflict(pStart; Value(Trim(pDuration)))); "OVERLAP";
        "AVAILABLE"
    );;

ResultMessage(pCode: Text; pStart: DateTime; pDuration: Text): Text =
    Switch(
        pCode;
        "AVAILABLE"; "Available: the room is free for this slot.";
        "INVALID_INPUT"; "Enter a start date and time.";
        "START_IN_PAST"; "The start time must be in the future.";
        "INVALID_DURATION"; "Duration must be a whole number between 1 and 120 minutes.";
        "ROOM_BLOCKED"; "Unavailable: the room is blocked (maintenance).";
        "OVERLAP"; "Unavailable: overlaps " & LookUp(Bookings; ID = FirstConflict(pStart; Value(Trim(pDuration)))).Title & ".";
        "Unknown result"
    );;