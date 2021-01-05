/**
 * This class is intended to wrap the a React's state to provide tons of accessors. This should not have any
 * dependencies upon React
 */

import moment from 'moment';


export default class UltraClockState {
  constructor(state) {
    this.state = state;
  }

  get distanceProgress() {
    return this.state.progressMiles;
  }

  get distanceGoal() {
    return this.state.goalMiles;
  }

  get distanceRemaining() {
    return this.distanceGoal - this.distanceProgress;
  }

  get dateTimeStart() {
    return this.state.start;
  }

  get dateTimeFinish() {
    return this.state.finish;
  }

  get dateTimeNowProgress() {
    return this.state.now_progress;
  }

  get dateTimeWallClock() {
    return this.state.wallClock;
  }

  get durationRemaining() {
    return this.finish - this.nowProgress;
  }

  get durationProgress() {
    return this.nowProgress - this.start;
  }

  /**
   * The pace required for the whole race to hit the goal
   * @returns {number} minutes/mile
   */
  get paceGoal() {
    this.calculatePace(this.dateTimeStart, this.dateTimeFinish, this.distanceGoal);
  }

  /**
   * The average pace through the entire race, in minutes per mile
   * @returns {number}
   */
  get paceActual() {
    // If no distance has been registered, return the required pace. Good for the initial setup
    if(this.state.progress_miles <= 0.1) {
      return this.paceGoal;
    }
    return this.calculatePace(this.dateTimeStart, this.dateTimeNowProgress, this.distanceProgress);
  }

  /**
   * The number of minutes per mile when walking
   * @returns {number}
   */
  get paceStandardWalking() {
    return 20;
  }

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

    return total / elapsed * this.distanceProgress;
  }

  /**
   * How many miles ahead (+) or behind (-) the goal pace
   * @returns {number} mile
   */

  get distanceAhead() {
    return this.distanceProgress - this.distanceExpectedNow;
  }

  get durationToDistanceCompletion() {

  }

  get timeDistanceCompletion() {

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
   * @returns {moment.Duration}
   */
  get durationRestTimeToPace() {
    let ms_whole_race = (this.paceGoal() * this.state.progress_miles * 60 * 1000);
    let ms_so_far =  this.dateTimeNowProgress.diff(this.dateTimeStart);
    return moment.duration(ms_whole_race - ms_so_far);
  }

  /**
   * How much time can we walk and still hit the goal; assumes the current pace when not walking
   * @returns {moment.Duration | int}
   */
  get durationWalkTimeToPace() {
    let pace_ms = this.paceGoal * 60 * 1000;
    let a_ms = pace_ms * this.distanceProgress;
    let t_ms = this.dateTimeNowProgress.diff(this.dateTimeStart);
    let num = a_ms - t_ms;
    let walk_pace_ms = this.paceStandardWalking * 60 * 1000;

    if (pace_ms >= walk_pace_ms) {
      return -1;
    }
    let den = 1 - (pace_ms / walk_pace_ms);

    return moment.duration(num / den);
  }

  /**
   * Calculate the expected time that the goal distance will be crossed given the present
   * pace
   * @returns {moment.Moment} The datetime
   */
  get dateTimeToDistanceGoal() {
    return moment(this.dateTimeStart.format()).add(this.durationToDistanceGoal);
  }

  /**
   * Calculate the expected number of milliseconds until the goal distance will be crossed
   * given current pace
   * @returns {number} Milliseconds
   */
  get durationToDistanceGoalMs() {
    let remaining_ratio = 1 / (this.cvtDistanceToPercent(this.distanceProgress) / 100);
    let elapsed_ms = this.dateTimeNowProgress.diff(this.dateTimeStart);
    return elapsed_ms * remaining_ratio;
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
   * Return the percentage of the day between start and finish. That is, the percentage of the
   * day planned to be taken up by the race.
   * Does not consider date, only time
   * Examples
   *   start (%%)  finish (%%)   result
   *    0600 (25)    1800 (75)       50
   *    1200 (50)    1800 (75)       25
   *    1800 (75)    0600 (25)      -25
   * @private
   */
  get percentageOfDay() {
    let start_pct = this.cvtDateTimeToPercentOfDay(this.dateTimeStart);
    let finish_pct = this.cvtDateTimeToPercentOfDay(this.dateTimeFinish);
    return (finish_pct - start_pct);
  }

  /**
   * Calculate what how much time this is compared to the length of the race
   * @param dateTimeEarly The early time to compare (minuend)
   * @param dateTimeLate THe late time to compare (subtrahend)
   * @returns {number} THe percentage of the race
   */
  cvtDateDurationToPercent(dateTimeEarly, dateTimeLate) {
    // TODO: Make this work across days
    let del_start_pct = this.cvtDateTimeToPercentOfDay(dateTimeEarly);
    let del_finish_pct = this.cvtDateTimeToPercentOfDay(dateTimeLate);
    let del_pct = del_finish_pct - del_start_pct;

    return (del_pct / this.percentageOfDay) * 100;
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
    let pct = distance / this.distanceGoal * 100;
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
  static calculatePace(start, finish, miles) {
    let minutes = finish.diff(start, 'm');
    return minutes / miles;
  }

  /**
   * Convert a datetime to a string. The string only shows the time and omits the "m"
   * Example:
   *   1/4/2021 @ 10:56PM  ==> 10:56p
   * @param datetime {moment}
   * @returns {string}
   */
  cvtDateTimeToTimeString(datetime) {
    return dateTime.format("h:mma").slice(0, -1);
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
    return 5;
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


};
