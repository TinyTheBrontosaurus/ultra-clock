import moment from 'moment';
import UltraClockState from "../app/ultra-clock-state";

let hmToMilliseconds = (hours, minutes) => ((hours * 60) + minutes) * 60 * 1000;
let msToMilliseconds = (minutes, seconds) => ((minutes * 60) + seconds) * 1000;

describe('Accessors', () => {
  test("before start", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 0,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: start,
      wallClock: moment.utc("2020-12-29T20:00"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(0);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(50);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-29T20:00:00Z");
    expect(out.durationMsRemaining).toBe(hmToMilliseconds(9, 7));
    expect(out.durationMsProgress).toBe(hmToMilliseconds(0, 0));
    expect(out.paceGoal).toBeCloseTo(10.94, 2);
    expect(out.paceActual).toBeCloseTo(10.94, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(0, 2);
    expect(out.distanceProjected).toBeCloseTo(50, 2);
    expect(out.distanceAhead).toBeCloseTo(0, 2);
    expect(out.isStarted).toBe(false);
    expect(out.durationRestTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationWalkTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationToDistanceGoalMs).toBe(hmToMilliseconds(9, 7));
    expect(out.durationToDistanceGoal.asMilliseconds()).toBe(hmToMilliseconds(9, 7));
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.paceAheadOfGoal).toBeCloseTo(0, 2);
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0, 2);
    expect(out.skipAheadSteps).toBe(0);
  });

  test("During no progress", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 0,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: start,
      wallClock: moment.utc("2020-12-30T08:00"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(0);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(50);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-30T08:00:00Z");
    expect(out.durationMsRemaining).toBe(hmToMilliseconds(9, 7));
    expect(out.durationMsProgress).toBe(hmToMilliseconds(0, 0));
    expect(out.paceGoal).toBeCloseTo(10.94, 2);
    expect(out.paceActual).toBeCloseTo(10.94, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(0, 2);
    expect(out.distanceProjected).toBeCloseTo(50, 2);
    expect(out.distanceAhead).toBeCloseTo(0, 2);
    expect(out.isStarted).toBe(false);
    expect(out.durationRestTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationWalkTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationToDistanceGoalMs).toBe(hmToMilliseconds(9, 7));
    expect(out.durationToDistanceGoal.asMilliseconds()).toBe(hmToMilliseconds(9, 7));
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.paceAheadOfGoal).toBeCloseTo(0, 2);
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(4.30, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(4, 2);
    expect(out.skipAheadSteps).toBe(8);
  });

  test("During just pressed progress--fast", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 4.5,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: moment.utc("2020-12-30T08:00"),
      wallClock: moment.utc("2020-12-30T08:00"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(4.5);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(45.5);
    expect(out.cvtDistanceToPercent(out.distanceProgress)).toBeCloseTo(9, 2);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T08:00:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-30T08:00:00Z");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsRemaining)).toBe("8h 20m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsProgress)).toBe("47m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsTotal)).toBe("9h 7m");
    expect(out.cvtDurationMsToPercent(out.durationMsProgress)).toBeCloseTo(8.59, 2);
    expect(out.cvtDurationMsToPercent(out.durationMsRemaining)).toBeCloseTo(91.41, 2);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:56");
    expect(out.paceActual).toBeCloseTo(10.44, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(4.3, 2);
    expect(out.distanceProjected).toBeCloseTo(52.37, 2);
    expect(out.distanceAhead).toBeCloseTo(0.2, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("2m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("4m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("7h 55m");
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T15:55:13Z");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("0:30");
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0, 2);
    expect(out.skipAheadSteps).toBe(0);
  });

  test("During not pressed progress in a while--fast", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 4.5,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: moment.utc("2020-12-30T08:00"),
      wallClock: moment.utc("2020-12-30T09:00"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(4.5);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(45.5);
    expect(out.cvtDistanceToPercent(out.distanceProgress)).toBeCloseTo(9, 2);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T08:00:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-30T09:00:00Z");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsRemaining)).toBe("8h 20m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsProgress)).toBe("47m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsTotal)).toBe("9h 7m");
    expect(out.cvtDurationMsToPercent(out.durationMsProgress)).toBeCloseTo(8.59, 2);
    expect(out.cvtDurationMsToPercent(out.durationMsRemaining)).toBeCloseTo(91.41, 2);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:56");
    expect(out.paceActual).toBeCloseTo(10.44, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(4.3, 2);
    expect(out.distanceProjected).toBeCloseTo(52.37, 2);
    expect(out.distanceAhead).toBeCloseTo(0.2, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("2m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("4m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("7h 55m");
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T15:55:13Z");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("0:30");
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(5.74, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(5.5, 2);
    expect(out.skipAheadSteps).toBe(11);
  });

  test("During just pressed progress after a while--fast", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 14.5,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: moment.utc("2020-12-30T09:00"),
      wallClock: moment.utc("2020-12-30T09:04"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(14.5);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(35.5);
    expect(out.cvtDistanceToPercent(out.distanceProgress)).toBeCloseTo(29, 2);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T09:00:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-30T09:04:00Z");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsRemaining)).toBe("7h 20m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsProgress)).toBe("1h 47m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsTotal)).toBe("9h 7m");
    expect(out.cvtDurationMsToPercent(out.durationMsProgress)).toBeCloseTo(19.56, 2);
    expect(out.cvtDurationMsToPercent(out.durationMsRemaining)).toBeCloseTo(80.44, 2);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:56");
    expect(out.cvtPaceToString(out.paceActual)).toBe("7:23");
    expect(out.cvtPaceToString(out.paceStandardWalking)).toBe("20:00");
    expect(out.distanceExpectedNow).toBeCloseTo(9.78, 2);
    expect(out.distanceProjected).toBeCloseTo(74.13, 2);
    expect(out.distanceAhead).toBeCloseTo(4.72, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("51m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("1h 53m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("4h 21m");
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T13:21:57Z");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("3:34");
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0.54, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0.5, 2);
    expect(out.skipAheadSteps).toBe(1);
  });


  test("Post just pressed progress --fast", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:13");
    let state = {
      distanceProgress: 54.5,
      distanceGoal: 50,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T16:20"),
      nowProgress: moment.utc("2020-12-30T17:00"),
      wallClock: moment.utc("2020-12-30T17:04"),
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(54.5);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(-4.5);
    expect(out.cvtDistanceToPercent(out.distanceProgress)).toBeCloseTo(100, 2);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T17:00:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-30T17:04:00Z");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsRemaining)).toBe("-40m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsProgress)).toBe("9h 47m");
    expect(UltraClockState.cvtDurationMsToString(out.durationMsTotal)).toBe("9h 7m");
    expect(out.cvtDurationMsToPercent(out.durationMsProgress)).toBeCloseTo(107.31, 2);
    expect(out.cvtDurationMsToPercent(out.durationMsRemaining)).toBeCloseTo(-7.31, 2);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:56");
    expect(out.cvtPaceToString(out.paceActual)).toBe("10:46");
    expect(out.cvtPaceToString(out.paceStandardWalking)).toBe("20:00");
    expect(out.distanceExpectedNow).toBeCloseTo(53.66, 2);
    expect(out.distanceProjected).toBeCloseTo(50.79, 2);
    expect(out.distanceAhead).toBeCloseTo(0.84, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("9m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("20m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("-48m");
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T16:11:31Z");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("0:10");
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0.37, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0, 2);
    expect(out.skipAheadSteps).toBe(0);
  });
});


describe('Walk/rest', () => {
  test("Ahead", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:00");
    let now = moment.utc("2020-12-30T08:30");
    let state = {
      distanceProgress: 12,
      distanceGoal: 60,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T17:00"),
      nowProgress: now,
      wallClock: now,
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(12);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:00");
    expect(out.cvtPaceToString(out.paceActual)).toBe("7:30");
    expect(out.cvtPaceToString(out.paceStandardWalking)).toBe("20:00");
    expect(out.distanceExpectedNow).toBeCloseTo(9, 2);
    expect(out.distanceProjected).toBeCloseTo(80, 2);
    expect(out.distanceAhead).toBeCloseTo(3, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("30m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("1h 0m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("6h 0m");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("2:30");
  });

  test("Rest waiting", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:00");
    let now = moment.utc("2020-12-30T09:00");
    let state = {
      distanceProgress: 12,
      distanceGoal: 60,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T17:00"),
      nowProgress: now,
      wallClock: now,
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(12);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:00");
    expect(out.cvtPaceToString(out.paceActual)).toBe("10:00");
    expect(out.cvtPaceToString(out.paceStandardWalking)).toBe("20:00");
    expect(out.distanceExpectedNow).toBeCloseTo(12, 2);
    expect(out.distanceProjected).toBeCloseTo(60, 2);
    expect(out.distanceAhead).toBeCloseTo(0, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("0m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("0m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("8h 0m");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("0:00");
  });

  test("Rest waiting", () => {
    // Arrange
    let start = moment.utc("2020-12-30T07:00");
    let now = moment.utc("2020-12-30T09:30");
    let state = {
      distanceProgress: 15,
      distanceGoal: 60,
      distanceStep: 0.5,
      start: start,
      finish: moment.utc("2020-12-30T17:00"),
      nowProgress: now,
      wallClock: now,
      paceSpanMinutes: 5,
      paceStandardWalking: 20,
    };

    // Act
    let out = new UltraClockState(state);

    // Assert
    expect(out.distanceProgress).toBe(15);
    expect(out.cvtPaceToString(out.paceGoal)).toBe("10:00");
    expect(out.cvtPaceToString(out.paceActual)).toBe("10:00");
    expect(out.cvtPaceToString(out.paceStandardWalking)).toBe("20:00");
    expect(out.distanceExpectedNow).toBeCloseTo(15, 2);
    expect(out.distanceProjected).toBeCloseTo(60, 2);
    expect(out.distanceAhead).toBeCloseTo(0, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("0m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("0m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("7h 30m");
    expect(out.cvtPaceToString(out.paceAheadOfGoal)).toBe("0:00");
    expect(out.cvtDateTimeToTimeString(out.dateTimeWallClock)).toBe("9:30a")

  });
});

describe('cvtDateTimeToPercentOfDay', () => {
  test("50", () => {
    // Arrange
    let dateTime = moment("2021-01-11T12:00");

    // Act
    let actual = UltraClockState.cvtDateTimeToPercentOfDay(dateTime);

    expect(actual).toBe(50);
  });

  test("25", () => {
    // Arrange
    let dateTime = moment("2021-01-11T06:00");

    // Act
    let actual = UltraClockState.cvtDateTimeToPercentOfDay(dateTime);

    expect(actual).toBe(25);
  });

  test("75", () => {
    // Arrange
    let dateTime = moment("2021-01-11T18:00");

    // Act
    let actual = UltraClockState.cvtDateTimeToPercentOfDay(dateTime);

    expect(actual).toBe(75);
  });
});
