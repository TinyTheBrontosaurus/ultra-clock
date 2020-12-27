import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import InputSpinner from "react-native-input-spinner";

import {Table, Rows} from 'react-native-table-component';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeModules} from 'react-native';

const {VersionModule} = NativeModules;
import {Container, Header, Left, Right, Body, Title, Tab, Tabs,
  Button as NBButton, Drawer, Content, ListItem, Switch,
  Icon as NBIcon} from 'native-base';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import Icon from 'react-native-vector-icons/FontAwesome5';
import RNSpeedometer from 'react-native-speedometer'


/**
 * The full board for crickets, including all the targets, the control board, and the statistics
 */
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    const {VERSION_STRING} = VersionModule.getConstants();
    this.state = {
      progress_miles: 0,
      goal_miles: 52.42,
      start: moment("2020-12-27T07:13"),
      finish: moment("2020-12-27T16:22"),
      now: moment(),
      showDatePicker: false,
      modeDatePicker: "date",
      version: VERSION_STRING,
      milesStep: 0.5,
      wallClock: moment(),
      demoMode: false,
      // Distance from far sides of the speedometer in min/mile
      paceSpanMinutes: 5
    };
  }

  closeDrawer = () => {
    this._drawer._root.close();
  };
  openDrawer = () => {
    this._drawer._root.open();
  };

  /// Convert a datetime (moment) to a percentage of the day
  momentToPercent(datetime) {
    let hours = parseInt(datetime.format("HH"));
    let minutes = parseInt(datetime.format("mm"));

    return ((hours + (minutes/60)) / 24) * 100;
  }

  baselineTimePercent() {
    let start_pct = this.momentToPercent(this.state.start);
    let finish_pct = this.momentToPercent(this.state.finish);
    return (finish_pct - start_pct);
  }

  /// Calculate a time delta as a percentage of the total time of this race
  timeDeltaAsPercent(del_start, del_finish) {
    let del_start_pct = this.momentToPercent(del_start);
    let del_finish_pct = this.momentToPercent(del_finish);
    let del_pct = del_finish_pct - del_start_pct;

    return (del_pct / this.baselineTimePercent()) * 100;

  }

  getPredictedDoneTime() {
    let remaining_ratio = 1 / (this.milesToPercent(this.state.progress_miles) / 100);
    let elapsed_ms = this.state.now.diff(this.state.start);
    let total_ms = elapsed_ms * remaining_ratio;
    return moment(this.state.start.format()).add(moment.duration(total_ms));
  }

  getPredictedTimeRemaining() {
    let remaining_ratio = 1 / (this.milesToPercent(this.state.progress_miles) / 100);
    let elapsed_ms = this.state.now.diff(this.state.start);
    let total_ms = elapsed_ms * remaining_ratio - elapsed_ms;
    return moment.duration(total_ms);
  }

  getMilesRemaining = () => this.state.goal_miles - this.state.progress_miles;

  isStarted = () => this.state.now.diff(this.state.start) > 0;

  convertDuration(start, end) {
    // calculate total duration
    let duration = moment.duration(end.diff(start));
    return this.convertDuration2(duration);
  }
  convertDuration2(duration) {
    let days = parseInt(duration.asDays());
    let hours = parseInt(duration.asHours()) % 24;
    let minutes = parseInt(duration.asMinutes()) % 60;

    if (days > 0) {
      return "> 1 day";
      return `${days.toFixed(0)}d ${hours.toFixed(0)}h ${minutes.toFixed(0)}m`
    }
    else if (hours > 0) {
      return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m`
    }
    else {
      return `${minutes.toFixed(0)}m`
    }
  }

  calculatePace(start, finish, miles) {
    let pace = this.calculatePace2(start, finish, miles);

    return this.formatPace(pace);
  }

  calculatePace2(start, finish, miles) {
    let minutes = finish.diff(start, 'm');
    return minutes / miles;
  }


  formatPace(pace) {
    let min = Math.floor(pace);
    let sec = (pace * 60) % 60;
    return `${min}:${sec.toFixed(0).padStart(2, '0')}`;
  }

  getAveragePace() {
    return this.calculatePace2(this.state.start, this.state.now, this.state.progress_miles);
  }
  getRequiredPace() {
    return this.calculatePace2(this.state.start, this.state.finish, this.state.goal_miles);
  }

  getPacePercent(pace) {
    let mid = this.getRequiredPace();
    let fastest = mid - this.state.paceSpanMinutes / 2;
    let slowest = mid + this.state.paceSpanMinutes / 2;

    if(pace > slowest) {
      return 100;
    }
    else if(pace < fastest) {
      return 0;
    }
    else {
      return (pace - fastest) / this.state.paceSpanMinutes * 100;
    }
  }

  getProjectedMiles() {
    let total = this.state.finish.diff(this.state.start, 'm');
    let elapsed = this.state.now.diff(this.state.start, 'm');

    return total / elapsed * this.state.progress_miles;
  }

  getExpectedMiles() {
    let total = this.state.finish.diff(this.state.start, 'm');
    let elapsed = this.state.now.diff(this.state.start, 'm');

    return elapsed / total * this.state.goal_miles;
  }

  getExpectedMilesDelta = () => this.state.progress_miles - this.getExpectedMiles();

  milesToPercent = (miles) => miles / this.state.goal_miles * 100;

  formatTime = (momentTime) => momentTime.format("h:mma").slice(0, -1);

  leftTableData = () => [
    ['start', this.formatTime(this.state.start)],
    ['finish', this.formatTime(this.state.finish)],
    ['duration', `${this.convertDuration(this.state.start, this.state.finish)}`],
    ['distance', `${this.state.goal_miles.toFixed(2)} ${labels.distance}`],
    ['min pace', `${this.calculatePace(this.state.start, this.state.finish, this.state.goal_miles)} ${labels.pace}`],
  ];

  rightTableData = () => [
    ['now', this.formatTime(this.state.now)],
    ['ran', `${this.state.progress_miles.toFixed(1)} ${labels.distance}`],
    ['left', `${this.getMilesRemaining().toFixed(2)} ${labels.distance}`],
    ['elapsed', `${this.isStarted() ? this.convertDuration(this.state.start, this.state.now) : "Not started"}`],
    ['remaining', `${this.convertDuration(this.state.now, this.state.finish)}`],
    ['avg pace', `${this.isStarted() ? this.calculatePace(this.state.start, this.state.now, this.state.progress_miles) : labels.na} ${labels.pace}`],
    ['req pace', `${this.isStarted() ? this.calculatePace(this.state.now, this.state.finish, this.getMilesRemaining()) : labels.na} ${labels.pace}`],
    ['projected', `${this.isStarted() ? this.getProjectedMiles().toFixed(2) : labels.na} mi`],
    ['expected', `${this.isStarted() ? this.getExpectedMiles().toFixed(2) : labels.na} mi`],
  ];

  timeTableData = () => [
    ['now', this.formatTime(this.state.now)],
    ['elapsed', `${this.isStarted() ? this.convertDuration(this.state.start, this.state.now) : "Not started"}`],
    ['remaining', `${this.convertDuration(this.state.now, this.state.finish)}`],
  ];

  distTableData = () => [
    ['ran', `${this.state.progress_miles.toFixed(1)} ${labels.distance}`],
    ['left', `${this.getMilesRemaining().toFixed(2)} ${labels.distance}`],
    ['projected', `${this.isStarted() ? this.getProjectedMiles().toFixed(2) : labels.na} mi`],
    ['expected', `${this.isStarted() ? this.getExpectedMiles().toFixed(2) : labels.na} mi`],
  ];

  paceTableData = () => [
    ['avg pace', `${this.isStarted() ? this.calculatePace(this.state.start, this.state.now, this.state.progress_miles) : labels.na} ${labels.pace}`],
    ['req pace', `${this.isStarted() ? this.calculatePace(this.state.now, this.state.finish, this.getMilesRemaining()) : labels.na} ${labels.pace}`],
  ];

  updateTime() {
    this.setState({now: moment()});
  }

  pressDateTime(date) {
    if (!this.state.showDatePicker) {
      // Button pressed
      this.setState({showDatePicker: true, modeDatePicker: 'date'});
      return;
    }

    if (date === undefined) {
      // Cancelled
      this.setState({showDatePicker: false, modeDatePicker: 'date'});
    }
    else if (this.state.modeDatePicker === "date") {
      // Date was set. now select time
      this.setState({showDatePicker: true, modeDatePicker: 'time', now: moment(date)});
    }
    else {
      // Time was set. done now.
      this.setState({showDatePicker: false, modeDatePicker: 'date', now: moment(date)});
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        wallClock: moment()
      })
    }, 10000)
  }

  toggleMilesSteps() {
    let new_step = 0.1;
    if(this.state.milesStep === 0.1) {
      new_step = 0.5;
    }
    else if(this.state.milesStep === 0.5) {
      new_step = 1;
    }
    else if(this.state.milesStep === 1) {
      new_step = 10;
    }
    this.setState({milesStep: new_step});
  }

  updateProgressMiles(num) {
    // Time quickly gets stale, which makes the stats deteriorate. Instead only show the time
    // for when the stats were updated
    this.setState({progress_miles: num});
    if(!this.state.demoMode) {
      this.setState({now: this.state.wallClock});
    }
  }

  render() {
    let MilesSelector = (props) => {
      return <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
      }}>
        <Text style={{fontSize: 20}}>{this.state.now.fromNow()}</Text>
        <InputSpinner
        min={0}
        step={this.state.milesStep}
        type={"real"}
        precision={1}
        colorMax={"#f04048"}
        colorMin={"#40c5f4"}
        value={this.state.progress_miles}
        onChange={(num) => this.updateProgressMiles(num)}
        fontSize={48}
        buttonFontSize={48}
        height={100}
        width={350}
        ><Text style={{fontSize: 20, marginTop: 48, marginRight: 10}}>{labels.distance}</Text></InputSpinner>
        {false && <Button
          onPress={() => this.toggleMilesSteps()}
          title={`Step: ${this.state.milesStep.toFixed(1)} ${labels.distance}`}
          color="#40c5f4"
        />}
        <Text>{this.state.version}{__DEV__ ? "-Debug" : ""}</Text>
      </View>
    };

    let rotation_deg;
    let fill_pct;
    let deltaColor;
    let prefix = "";
    if(this.getExpectedMilesDelta() > 0) {
      // Expected is first
      rotation_deg = this.milesToPercent(this.getExpectedMiles()) * 3.6;
      fill_pct = this.milesToPercent(this.getExpectedMilesDelta());
      deltaColor = colorsDistance.deltaAhead;
      prefix = "+";
    }
    else {
      // Actual is first
      rotation_deg = this.milesToPercent(this.state.progress_miles) * 3.6;
      fill_pct = this.milesToPercent(-this.getExpectedMilesDelta());
      deltaColor = colorsDistance.deltaBehind;
    }

    let SideBar = (props) => <Container>
      <Header />
      <Content>
        <ListItem icon>
          <Left>
            <NBButton style={{ backgroundColor: "#FF9501" }}>
              <NBIcon active name="airplane" />
            </NBButton>
          </Left>
          <Body>
          <Text>Demo Mode</Text>
          </Body>
          <Right>
            <Switch value={this.state.demoMode}
                    onValueChange={(val) => this.setState({demoMode: val})}/>
          </Right>
        </ListItem>
        <ListItem icon>
          <Left>
            <NBButton style={{ backgroundColor: "#007AFF" }}>
              <NBIcon active name="boat-outline" />
            </NBButton>
          </Left>
          <Body>
          <Text>{this.state.version}</Text>
          </Body>
        </ListItem>
      </Content>
    </Container>;

    return (
      <Drawer
        ref={(ref) => { this._drawer = ref; }}
        content={<SideBar />}
      >
      <Container>
        <Header hasTabs>
          <Left>
            <NBButton transparent>
              <NBIcon name='menu' onPress={this.openDrawer.bind(this)}/>
            </NBButton>
          </Left>
          <Body>
            <Title>Soul-Searching Ultra Clock</Title>
          </Body>
        </Header>
        <Tabs>
          <Tab heading="Info">
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Rows data={this.leftTableData()} textStyle={{fontSize: 36}}/>
            </Table>
            <MilesSelector />
          </Tab>
          <Tab heading="Dist">
            <View style={{position: "absolute"}}>
              <AnimatedCircularProgress
                  rotation={rotation_deg}
                  size={360}
                  width={25}
                  fill={fill_pct}
                  tintColor={deltaColor}
                />
            </View>
            <View style={{position: "absolute"}}>
            <AnimatedCircularProgress
              rotation={0}
              size={360}
              width={15}
              fill={this.milesToPercent(this.state.progress_miles)}
              tintColor={colorsDistance.progress}
              backgroundColor={colorsDistance.remaining}
            >{
              (fill) => (
                <>
                <Text style={Object.assign({}, styles.progressLabelMinor, {color: deltaColor})}>
                  <Icon style={styles.progressLabelMinor} name='share'/>{" "}
                  {prefix}{this.getExpectedMilesDelta().toFixed((1))} {labels.distance}
                </Text>
                <Text style={Object.assign({}, styles.progressLabelMain, {color: colorsDistance.progress})}>
                  <Icon style={styles.progressLabelMain} name='check-circle'/>{" "}
                  {this.state.progress_miles.toFixed((1))} {labels.distance}
                </Text>
                <Text style={Object.assign({}, styles.progressLabelMid, {color: colorsDistance.remaining})}>
                  <Icon style={styles.progressLabelMid} name='clipboard-list'/>{" "}
                  {this.getMilesRemaining().toFixed((2))} {labels.distance}
                </Text>
                <Text style={Object.assign({}, styles.progressLabelMinor, {color: deltaColor})}>
                  <Icon style={styles.progressLabelMinor} name='chart-line'/> {" "}
                  {this.getProjectedMiles().toFixed((2))} {labels.distance}
                </Text>
                </>
              )
            }
            </AnimatedCircularProgress>
            </View>
            <MilesSelector />
          </Tab>
          <Tab heading="Pace">
            <View style={{ justifyContent: 'center',
              alignItems: 'center',}}>
            <View style={{
              transform: [
                { scaleX: -1 }
              ]
            }}>
            <RNSpeedometer value={this.getPacePercent(this.getAveragePace())} size={300} labelNoteStyle={{fontSize: 0}} labelStyle={{fontSize: 0}} />
            </View>
              <Text style={Object.assign({}, {color: colorsPace.average}, styles.progressLabelMain)}>
                {this.isStarted() ? this.formatPace(this.getAveragePace()) : labels.na}
                <Text style={styles.progressLabelMinor}> {labels.pace}</Text>
              </Text>
            <Text>Line 2</Text>
            {/*<Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>*/}
              {/*<Rows data={this.paceTableData()} textStyle={{fontSize: 36}}/>*/}
            {/*</Table>*/}
            </View>
            <MilesSelector />
          </Tab>
          <Tab heading="Time">
            <AnimatedCircularProgress
              arcSweepAngle={this.baselineTimePercent() * 3.6}
              rotation={this.momentToPercent(this.state.start) * 3.6 + 180}
              size={360}
              width={15}
              fill={this.timeDeltaAsPercent(this.state.start, this.state.now)}
              tintColor={colorsTime.progress}
              backgroundColor={colorsTime.remaining}>
              {
                (fill) => (
                  <>
                  <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                    <Icon style={styles.progressLabelMinor} name='clock'/>{" "}
                    {this.formatTime(this.state.now)}
                  </Text>
                  <Text style={Object.assign({}, styles.progressLabelMain, {color: colorsTime.progress})}>
                    <Icon style={styles.progressLabelMain} name='check-circle'/>{" "}
                    {this.isStarted() ? this.convertDuration(this.state.start, this.state.now) : "Not started"}
                  </Text>
                  <Text style={Object.assign({}, styles.progressLabelMid, {color: colorsTime.remaining})}>
                    <Icon style={styles.progressLabelMid} name='clipboard-list'/>{" "}
                    {this.convertDuration(this.state.now, this.state.finish)}
                  </Text>
                  <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                    <Icon style={styles.progressLabelMinor} name='flag-checkered'/>{" "}
                    {this.formatTime(this.getPredictedDoneTime())}
                  </Text>
                  <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                    <Icon style={styles.progressLabelMinor} name='flag-checkered'/>{" "}
                    {this.convertDuration2(this.getPredictedTimeRemaining())}
                  </Text>
                  </>
                )
              }
            </AnimatedCircularProgress>
            <MilesSelector />
          </Tab>
          {this.state.demoMode && <Tab heading="Demo">
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Button
                  onPress={() => this.updateTime()}
                  title={`Update Time to now`}
                  color="#40c5f4"
                />
                <Button
                  onPress={() => this.pressDateTime()}
                  title={`Set Time`}
                  color="#40c5f4"
                />
              </View>
              <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                  <Text style={styles.tableTitle}>Parameters</Text>
                  <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Rows data={this.leftTableData()}/>
                  </Table>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.tableTitle}>Progress</Text>
                  <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Rows data={this.rightTableData()}/>
                  </Table>
                </View>
              </View>
              {this.state.showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  mode={this.state.modeDatePicker}
                  is24Hour={false}
                  display="default"
                  value={this.state.now.toDate()}
                  onChange={(event, date) => this.pressDateTime(date)}
                />
              )}
            </View>
            <MilesSelector />
          </Tab>}
        </Tabs>
      </Container>
      </Drawer>
    );
  };
};

const labels = {
  pace: "min/mi",
  distance: "mi",
  na: "--",
};

const colors = {
  red: "#DB4441",
  blue: "#4B53DB",
  yellow: "#DBBB3B",
  green: "#51DB7D",
  brown: "#D9C475",
  black: "#333333"
};
const colorsTime = {
  progress: colors.yellow,
  remaining: colors.red,
};
const colorsDistance = {
  progress: colors.blue,
  remaining: colors.brown,
  delta: colors.green,
  deltaAhead: colors.black,
  deltaBehind: colors.red,
};

const colorsPace = {
  average: colors.black,
  deltaAhead: colors.black,
  deltaBehind: colors.red,
};

const styles = StyleSheet.create({
  tableTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  progressLabelMain: {
    fontSize: 60,
  },
  progressLabelMid: {
    fontSize: 48,
  },
  progressLabelMinor: {
    fontSize: 36,
  },
  // Examples only below. Actually used above
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
