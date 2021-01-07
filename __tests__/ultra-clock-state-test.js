import moment from 'moment';
import UltraClockState from "../app/ultra-clock-state";

let toMilliseconds = (hours, minutes) => ((hours * 60) + minutes) * 60 * 1000;

describe('Before start', () => {
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
  let out = new UltraClockState(state);
  test("stuff", () => {
    // Act / Assert
    expect(out.distanceProgress).toBe(0);
    expect(out.distanceGoal).toBe(50);
    expect(out.distanceStep).toBe(0.5);
    expect(out.distanceRemaining).toBe(50);
    expect(out.dateTimeStart.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeFinish.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.dateTimeNowProgress.format()).toBe("2020-12-30T07:13:00Z");
    expect(out.dateTimeWallClock.format()).toBe("2020-12-29T20:00:00Z");
    expect(out.durationRemaining).toBe(toMilliseconds(9, 7));
    expect(out.durationProgress).toBe(toMilliseconds(0, 0));
    expect(out.paceGoal).toBeCloseTo(10.94, 2);
    expect(out.paceActual).toBeCloseTo(10.94, 2);
    expect(out.paceStandardWalking).toBeCloseTo(20, 2);
    expect(out.distanceExpectedNow).toBeCloseTo(0, 2);
    expect(out.distanceProjected).toBeCloseTo(50, 2);
    expect(out.distanceAhead).toBeCloseTo(0, 2);
    expect(out.isStarted).toBe(false);
    expect(out.durationRestTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationWalkTimeToPace.asMilliseconds()).toBeCloseTo(0, 2);
    expect(out.durationToDistanceGoalMs).toBe(toMilliseconds(9, 7));
    expect(out.durationToDistanceGoal.asMilliseconds()).toBe(toMilliseconds(9, 7));
    expect(out.dateTimeToDistanceGoal.format()).toBe("2020-12-30T16:20:00Z");
    expect(out.paceAheadOfGoal).toBeCloseTo(0, 2);
    expect(out.paceSpanMinutes).toBe(5);
    expect(out.distanceSkipAheadRaw).toBeCloseTo(0, 2);
    expect(out.distanceSkipAheadRounded).toBeCloseTo(0, 2);
    expect(out.skipAheadSteps).toBe(0);
  })
  // Arrange

  // Act

  //Assert
});
