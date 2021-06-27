/**
 * This class is intended to wrap the a React's state to provide tons of accessors. This should not have any
 * dependencies upon React
 */

import moment from 'moment';


export default class UltraClockState {
  constructor(state) {
    this.state = state;
  }

  /**
   * The number of miles completed
   * @returns {number}
   */
  get distanceProgress() {
    return this.state.distanceProgress;
  }

  /**
   * The number of total miles as teh goal
   * @returns {number} miles
   */
  get distanceGoal() {
    return this.state.distanceGoal;
  }

  /**
   * How far a single increment of the "next" button should proceed
   * @returns {number} miles
   */
  get distanceStep() {
    return this.state.distanceStep;
  }

  /**
   * The number of miles remaining
   * @returns {number} miles
   */
  get distanceRemaining() {
    return this.distanceGoal - this.distanceProgress;
  }

  /**
   * Get the planned start time (sunrise)
   * @returns {moment}
   */
  get dateTimeStart() {
    return this.state.start;
  }

  /**
   * Get the planned finish time (sunset)
   * @returns {moment}
   */
  get dateTimeFinish() {
    return this.state.finish;
  }

  get dateTimeNowProgress() {
    return this.state.nowProgress;
  }

  /**
   * Get the time
   * @returns {moment}
   */
  get dateTimeWallClock() {
    return this.state.wallClock;
  }

  /**
   * Get how much time is remaining
   * @returns {number} milliseconds
   */
  get durationMsRemaining() {
    return this.dateTimeFinish - this.dateTimeNowProgress;
  }

  /**
   * Get how much time has elapsed, from start to last update
   * @returns {number} milliseconds
   */
  get durationMsProgress() {
    return this.dateTimeNowProgress - this.dateTimeStart;
  }

  /**
   * The pace required for the whole race to hit the goal
   * @returns {number} minutes/mile
   */
  get paceGoal() {
    return this.calculatePace(this.dateTimeStart, this.dateTimeFinish, this.distanceGoal);
  }

  /**
   * The average pace through the entire race, in minutes per mile
   * @returns {number}
   */
  get paceActual() {
    // If no distance has been registered, return the required pace. Good for the initial setup
    if(this.distanceProgress <= 0.1) {
      return this.paceGoal;
    }
    return this.calculatePace(this.dateTimeStart, this.dateTimeNowProgress, this.distanceProgress);
  }

  /**
   * The number of minutes per mile when walking
   * @returns {number}
   */
  get paceStandardWalking() {
    return this.state.paceStandardWalking;
  }

  /**
   * Get the distance that is expected as of the latest progress update, assuming the
   * a priori pace prediction
   * @returns {number} milliseconds
   */
  get distanceExpectedNow() {
    let total = this.dateTimeFinish.diff(this.dateTimeStart, 'm');
    let elapsed = this.dateTimeNowProgress.diff(this.dateTimeStart, 'm');

    return elapsed / total * this.distanceGoal;
  }

  /**
   * The number of miles expected at the end time given the current pace
   * @returns {number} distance
   */
  get distanceProjected() {
    let total = this.dateTimeFinish.diff(this.dateTimeStart, 'm');
    let elapsed = this.dateTimeNowProgress.diff(this.dateTimeStart, 'm');

    if(elapsed < 1) {
      return this.distanceGoal;
    }

    return (total / elapsed) * this.distanceProgress;
  }

  /**
   * How many miles ahead (+) or behind (-) the goal pace
   * @returns {number} mile
   */
  get distanceAhead() {
    return this.distanceProgress - this.distanceExpectedNow;
  }

  /**
   * True if "now" is later than the start time.
   * @returns {boolean} True iff started
   */
  get isStarted() {
    return (this.dateTimeNowProgress.diff(this.dateTimeStart) > 0);
  }

  /**
   * How much time can we rest and still hit the goal; assumes the current pace when not resting
   * @returns {moment.duration}
   */
  get durationMsRestTimeToPace() {
    let ms_whole_race = (this.paceGoal * this.distanceProgress * 60 * 1000);
    let ms_so_far =  this.dateTimeNowProgress.diff(this.dateTimeStart);
    return ms_whole_race - ms_so_far;
  }

  /**
   * How much time can we walk and still hit the goal; assumes the current pace when not walking
   * @returns {number}
   */
  get durationMsWalkTimeToPace() {
    let pace_ms = this.paceGoal * 60 * 1000;
    let a_ms = pace_ms * this.distanceProgress;
    let t_ms = this.dateTimeNowProgress.diff(this.dateTimeStart);
    let num = a_ms - t_ms;
    let walk_pace_ms = this.paceStandardWalking * 60 * 1000;

    if (pace_ms >= walk_pace_ms) {
      return -1;
    }
    let den = 1 - (pace_ms / walk_pace_ms);

    return num / den;
  }

  /**
   * Calculate the expected time that the goal distance will be crossed given the present
   * pace
   * @returns {moment.Moment} The datetime
   */
  get dateTimeToDistanceGoal() {
    return moment(this.dateTimeNowProgress.format()).add(this.durationToDistanceGoal);
  }

  /**
   * Calculate the expected number of milliseconds until the goal distance will be crossed
   * given current pace
   * @returns {number} Milliseconds
   */
  get durationToDistanceGoalMs() {
    return this.paceActual * this.distanceRemaining * 60 * 1000;
  }

  /**
   * Calculate the expected duration until the goal distance will be crossed
   * given current pace
   * @returns {moment.Duration}
   */
  get durationToDistanceGoal() {
    return moment.duration(this.durationToDistanceGoalMs);
  }

  /**
   * How many minutes per mile ahead (+) or behind (-) the goal pace
   * @returns {number} minutes/mile
   */
  get paceAheadOfGoal() {
    return this.paceGoal - this.paceActual;
  }

  /**
   * Calculate how many miles are expected to have been run between the last progress update and
   * the wall clock, assuming the actual pace
   * @returns {number} miles
   */
  get distanceSkipAheadRaw() {
    let pace_min = this.paceActual;
    let skip_time_ms = this.dateTimeWallClock.diff(this.dateTimeNowProgress);
    if(skip_time_ms <= 0) {
      return 0;
    }
    return (skip_time_ms / 60 / 1000) / pace_min;
  }

  /**
   * Calculate how many miles are expected to have been run between the last progress update and
   * the wall clock, assuming the actual pace. ROounded down to the step size
   * @returns {number} miles
   */
  get distanceSkipAheadRounded() {
    return this.skipAheadSteps * this.distanceStep;
  }

  get durationMsTotal() {
    return this.dateTimeFinish.diff(this.dateTimeStart);
  }

  cvtDurationToPercent(duration) {
    return this.cvtDurationMsToPercent(duration.asMilliseconds());
  }

  cvtDurationMsToPercent(duration) {
    return (duration / this.durationMsTotal) * 100;
  }

  /**
   * The integer number of steps to reach the skips ahead distance. Closest without going over
   * @returns {int} Number of steps
   */
  get skipAheadSteps() {
    return Math.floor(this.distanceSkipAheadRaw / this.distanceStep);
  }

  /**
   * Convert a datetime to a percentage. Only looks at the time, not the date.
   * Examples
   *  1200 => 50%
   *  0600 -> 25%
   *  1800 -> 75%
   * @param datetime A moment()
   * @returns {number} A number as a percentage
   */
  static cvtDateTimeToPercentOfDay(datetime) {
    let hours = parseInt(datetime.format("HH"));
    let minutes = parseInt(datetime.format("mm"));

    return ((hours + (minutes / 60)) / 24) * 100;
  }

  /**
   * Converts a pace to a string.
   * Examples
   *   pace  result
   *   8.5     8:30
   *   9.75    9:45
   *   9.99    9:59
   * @param pace {number} The pace in minutes per mile
   * @returns {string}
   */
  cvtPaceToString(pace) {
    let prefix = "";
    if (pace < 0) {
      prefix = "-";
      pace = -pace;
    }
    let min = Math.floor(pace);
    let sec = (pace * 60) % 60;
    return `${prefix}${min}:${sec.toFixed(0).padStart(2, '0')}`;
  }

  /**
   * Convert a distance to a percentage of the whole race
   * @param distance
   * @returns {number} The percentage in [0, 100]
   */
  cvtDistanceToPercent(distance) {
    let pct = (distance / this.distanceGoal) * 100;
    if(pct < 0) {
      return 0;
    }
    else if(pct > 100) {
      return 100;
    }
    return pct;
  }

  /**
   * Calculate the pace in a given segment
   * @param start The start of the run segment
   * @param finish The end of the run segment
   * @param miles How far run during segment
   * @returns {number} Minutes / mile
   */
  calculatePace(start, finish, miles) {
    let minutes = finish.diff(start, 'm');
    return minutes / miles;
  }

  /**
   * Convert a datetime to a string. The string only shows the time and omits the "m"
   * Example:
   *   1/4/2021 @ 10:56PM  ==> 10:56p
   * @param dateTime {moment}
   * @returns {string}
   */
  cvtDateTimeToTimeString(dateTime) {
    return dateTime.format("h:mma").slice(0, -1);
  }

  static cvtDurationMsToString(durationMs) {
    return UltraClockState.cvtDurationToString(moment.duration(durationMs));
  }

  /**
   * Convert a duration to a string.
   * Sample outputs:
   *  > 1 day
   *  12h 7m
   *  35m
   *  -49m
   *  -10h 23m
   *  < -1 day
   * @param duration {moment.duration}
   * @returns {string}
   */
  static cvtDurationToString(duration) {
    let prefix = "";
    let direction = ">";
    if (duration.asMilliseconds() < 0) {
      duration = moment.duration(-duration.asMilliseconds());
      prefix = "-";
      direction = "<";
    }
    let days = parseInt(duration.asDays());
    let hours = parseInt(duration.asHours()) % 24;
    let minutes = parseInt(duration.asMinutes()) % 60;

    if (days > 0) {
      return `${direction} ${prefix}1 day`;
    }
    else if (hours > 0) {
      return `${prefix}${hours.toFixed(0)}h ${minutes.toFixed(0)}m`
    }
    else {
      return `${prefix}${minutes.toFixed(0)}m`
    }
  }

  /**
   * The number of minutes per mile between 0% and 100% on the speedometer
   * @returns {number} minutes/mile
   */
  get paceSpanMinutes() {
    return this.state.paceSpanMinutes;
  }

  /**
   * Convert a pace value to a percentage (to be used on a speedometer or gauge)
   * @param pace {number} minutes/mile
   * @returns {number} Percentage in [0, 100]
   */
  cvtPaceToPercent(pace) {
    let mid = this.paceGoal;
    let fastest = mid - this.paceSpanMinutes / 2;
    let slowest = mid + this.paceSpanMinutes / 2;

    if (pace > slowest) {
      return 100;
    }
    else if (pace < fastest) {
      return 0;
    }
    else {
      return (pace - fastest) / this.paceSpanMinutes * 100;
    }
  }

  static cvtDurationMsToPercentOfDay(duration) {
    const full_day = 24 * 60 * 60 * 1000;
    return (duration / full_day) * 100;
  }

  cvtDurationMsToPercentOfRace(duration) {
    return (duration / this.durationMsTotal) * 100;
  }
};
