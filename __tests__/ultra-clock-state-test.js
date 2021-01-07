import moment from 'moment';
import UltraClockState from "../app/ultra-clock-state";

describe('Before start', () => {
  // Arrange
  let start = moment("2020-12-30T07:13");
  let state = {
    distanceProgress: 0,
    distanceGoal: 50,
    distanceStep: 0.5,
    start: start,
    finish: moment("2020-12-30T16:20"),
    nowProgress: start,
    wallClock: moment("2020-12-29T20:00"),
    paceSpanMinutes: 5,
  };
  let out = new UltraClockState(state);
  test("stuff", () => {
    // Act / Assert
    expect(out.distanceProgress).toBe(0);
  })
  // Arrange

  // Act

  //Assert
});
