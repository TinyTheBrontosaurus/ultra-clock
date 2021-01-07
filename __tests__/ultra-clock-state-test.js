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
    expect(out.durationProgress).toBe(hmToMilliseconds(0, 0));
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
    expect(out.durationProgress).toBe(hmToMilliseconds(0, 0));
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

  test("During just pressed progress", () => {
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
    expect(UltraClockState.cvtDurationMsToString(out.durationProgress)).toBe("47m");
    expect(UltraClockState.cvtDurationMsToString(out.durationTotal)).toBe("9h 7m");
    expect(out.cvtDurationMsToPercent(out.durationProgress)).toBeCloseTo(8.59, 2);
    expect(out.cvtDurationMsToPercent(out.durationMsRemaining)).toBeCloseTo(91.41, 2);
    expect(out.paceGoal).toBeCloseTo(10.94, 2);
    expect(out.paceActual).toBeCloseTo(10.44, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(4.3, 2);
    expect(out.distanceProjected).toBeCloseTo(52.37, 2);
    expect(out.distanceAhead).toBeCloseTo(0.2, 2);
    expect(out.isStarted).toBe(true);
    expect(UltraClockState.cvtDurationToString(out.durationRestTimeToPace)).toBe("2m");
    expect(UltraClockState.cvtDurationToString(out.durationWalkTimeToPace)).toBe("4m");
    expect(UltraClockState.cvtDurationToString(out.durationToDistanceGoal)).toBe("8h 42m");
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T15:55:13Z");
    expect(out.paceAheadOfGoal).toBeCloseTo(0.50, 2);
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0, 2);
    expect(out.skipAheadSteps).toBe(0);
  });
});
