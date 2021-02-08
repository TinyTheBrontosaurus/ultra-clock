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
import {
  Container, Header, Left, Right, Body, Title, Tab, Tabs,
  Button as NBButton, Drawer, Content, ListItem, Switch,
  Icon as NBIcon
} from 'native-base';

import {AnimatedCircularProgress} from 'react-native-circular-progress';

import Icon from 'react-native-vector-icons/FontAwesome5';
import RNSpeedometer from 'react-native-speedometer';
import UltraClockState from "./ultra-clock-state";
import AsyncStorage from '@react-native-async-storage/async-storage';

import About from './about';

// The fields in `state` that will be updated by the date picker
const DEMO_WALL_CLOCK = "wallClock";
const SET_START = "start";
const SET_FINISH = "finish";

/**
 * The full board for crickets, including all the targets, the control board, and the statistics
 */
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    const {VERSION_STRING} = VersionModule ? VersionModule.getConstants() : {VERSION_STRING: "mocked"};
    let start = () => moment("2020-12-30T07:13");
    this.state = {
      distanceProgress: 0,
      distanceGoal: 52.42,
      distanceStep: 0.5,
      start: start(),
      finish: moment("2020-12-30T16:20"),
      nowProgress: start(),
      wallClock: moment(),
      // Distance from far sides of the speedometer in min/mile
      paceSpanMinutes: 5,
      // Walking pace, in minutes per mile
      paceStandardWalking: 20,
      courseName: "Soul-Searching Ultra Clock",
      showAbout: true,

      // Values not saved are below. Saved values are above
      showDatePicker: false,
      modeDatePicker: "date",
      version: VERSION_STRING,
      demoMode: false,
      editable: false,
      targetDatePicker: SET_START,
    };
    this.ultraState = new UltraClockState(this.state);
    this.inputSpinnerInFocus = false;
    this.inputSpinnerSave = 0;
    this.inputSpinnerSaveValid = false;

    // Load persistent storage
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@activeCourse');
        return (jsonValue !== null) ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
        // Stick with defaults but move the user towards the edit screen
        this.setState({editable: true});
      }
    };
    getData().then((loadedState) => {
      if(!loadedState) {
        // Stick with defaults but move the user towards the edit screen
        this.setState({editable: true, showAbout: true});
        return;
      }
      ["start", "finish", "nowProgress", "wallClock", "showAbout"].forEach(element => {
        // In case wallClock is serialized, convert it. Otherwise ignore it
        if(element in loadedState) {
          loadedState[element] = moment(loadedState[element]);
        }
      });

      this.setState(loadedState);
    });
  }

  saveState = async() => {
    try {
      // Mark all of the values not to save
      // https://stackoverflow.com/a/44144355/5360912
      const {showDatePicker, modeDatePicker, version, demoMode, editable, targetDatePicker,
        wallClock,
        ...toSave} = this.state;

      const jsonValue = JSON.stringify(toSave);
      await AsyncStorage.setItem('@activeCourse', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  componentDidUpdate() {
    this.saveState().then();
    // Deal with the case when "now" is earlier than start; happens when changing
    // the start time
    if(this.state.nowProgress < this.state.start) {
      this.setState({nowProgress: this.state.start});
    }

  }

  closeDrawer = () => {
    this._drawer._root.close();
  };
  openDrawer = () => {
    this._drawer._root.open();
  };

  leftTableData = () => [
    ['start', this.ultraState.cvtDateTimeToTimeString(this.ultraState.dateTimeStart)],
    ['finish', this.ultraState.cvtDateTimeToTimeString(this.ultraState.dateTimeFinish)],
    ['duration', `${UltraClockState.cvtDurationMsToString(this.ultraState.durationMsTotal)}`],
    ['distance', `${this.ultraState.distanceGoal.toFixed(2)} ${labels.distance}`],
    ['min pace', `${this.ultraState.cvtPaceToString(this.ultraState.paceGoal)} ${labels.pace}`],
  ];

  rightTableData = () => [
    ['now', this.ultraState.cvtDateTimeToTimeString(this.ultraState.dateTimeNowProgress)],
    ['ran', `${this.ultraState.distanceProgress.toFixed(1)} ${labels.distance}`],
    ['left', `${this.ultraState.distanceRemaining.toFixed(2)} ${labels.distance}`],
    ['elapsed', `${this.ultraState.isStarted ? UltraClockState.cvtDurationMsToString(this.ultraState.durationMsProgress) : "Not started"}`],
    ['remaining', `${UltraClockState.cvtDurationMsToString(this.ultraState.durationMsRemaining)}`],
    ['avg pace', `${this.ultraState.isStarted ? this.ultraState.cvtPaceToString(this.ultraState.paceActual) : labels.na} ${labels.pace}`],
    // req pace broken
    ['req pace', `${this.ultraState.isStarted ? this.ultraState.cvtPaceToString(this.ultraState.paceGoal) : labels.na} ${labels.pace}`],
    ['projected', `${this.ultraState.isStarted ? this.ultraState.distanceProjected.toFixed(2) : labels.na} mi`],
    ['expected', `${this.ultraState.isStarted ? this.ultraState.distanceExpectedNow.toFixed(2) : labels.na} mi`],
  ];


  pressDateTime(mode, date) {
    this.state.targetDatePicker = mode;

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
      let stateDelta = {showDatePicker: true, modeDatePicker: 'time'};
      stateDelta[mode] = moment(date);
      this.setState(stateDelta);
    }
    else {
      let stateDelta = {showDatePicker: false, modeDatePicker: 'date'};
      stateDelta[mode] = moment(date);
      this.setState(stateDelta);
    }
  }

  showSkipAhead() {
    // Only worth skipping if it'll add at least a couple presses
    return this.ultraState.skipAheadSteps > 2.5;
  }

  skipAhead() {
    this.updateProgressMiles(this.ultraState.distanceSkipAheadRounded);
  }

  componentDidMount() {
    setInterval(() => {
      if(!this.inputSpinnerInFocus && !this.state.demoMode && !this.state.showDatePicker) {
        this.setState({
          wallClock: moment()
        });
      }
    }, 10000)
  }

  updateProgressMiles(num) {
    // Time quickly gets stale, which makes the stats deteriorate. Instead only show the time
    // for when the stats were updated
    this.setState({distanceProgress: num, nowProgress: this.state.wallClock});
  }

  inputSpinnerFocus(focus) {
    console.log(`focus: ${focus}`);
    this.inputSpinnerInFocus = focus;
    if(!focus && this.inputSpinnerSaveValid) {
      this.inputSpinnerChange(this.inputSpinnerSave);
      this.inputSpinnerSaveValid = false;
    }
  }

  inputSpinnerChange(num) {
    if(!this.inputSpinnerInFocus) {
      this.updateProgressMiles(num);
    }
    else {
      this.inputSpinnerSave = num;
      this.inputSpinnerSaveValid = true;
    }
  }

  dateTimePicker() {
    return (<DateTimePicker
      testID="dateTimePicker"
      mode={this.state.modeDatePicker}
      is24Hour={false}
      display="default"
      value={this.state[this.state.targetDatePicker].toDate()}
      onChange={(event, date) => this.pressDateTime(this.state.targetDatePicker, date)}
    />);
  }

  render() {
    this.ultraState.state = this.state;

    if(this.state.showAbout) {
      return <About onDone={() => this.setState({showAbout: false})} />;
    }

    let MilesSelector = (props) => {
      return <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
      }}>
        <Text style={{fontSize: 20}}>{this.state.nowProgress.from(this.state.wallClock)}</Text>
        <InputSpinner
          min={0}
          step={this.ultraState.distanceStep}
          type={"real"}
          precision={1}
          colorMax={"#f04048"}
          colorMin={"#40c5f4"}
          value={this.ultraState.distanceProgress}
          onChange={(num) => this.inputSpinnerChange(num)}
          onFocus={() => this.inputSpinnerFocus(true)}
          onBlur={() => this.inputSpinnerFocus(false)}
          fontSize={48}
          buttonFontSize={48}
          height={100}
          width={350}
          rounded={false}
          showBorder={true}
        ><Text style={{fontSize: 20, marginTop: 48, marginRight: 10}}>{labels.distance}</Text>
        </InputSpinner>
        {this.showSkipAhead() && <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
          left: 0,
        }}>
          <NBButton block light style={{height: 100, width: 100}} onPress={() => this.skipAhead()}>
            <Icon name='step-forward' size={60} color="#eeeeee"/>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 20,
              left: 0,
            }}>
              <Text style={{fontSize: 48, color: colorsDistance.progress}}>{this.ultraState.distanceSkipAheadRounded.toFixed(1)}</Text>
            </View>
          </NBButton>
        </View>}
        <Text> {this.state.version}{__DEV__ ? "-Debug" : ""}</Text>
      </View>
    };

    let rotation_deg;
    let fill_pct;
    let deltaColor;
    let prefix = "";
    if (this.ultraState.distanceAhead > 0) {
      // Expected is first
      rotation_deg = this.ultraState.cvtDistanceToPercent(this.ultraState.distanceExpectedNow) * 3.6;
      fill_pct = this.ultraState.cvtDistanceToPercent(this.ultraState.distanceAhead);
      deltaColor = colorsDistance.deltaAhead;
      prefix = "+";
    }
    else {
      // Actual is first
      rotation_deg = this.ultraState.cvtDistanceToPercent(this.ultraState.distanceProgress) * 3.6;
      fill_pct = this.ultraState.cvtDistanceToPercent(-this.ultraState.distanceAhead);
      deltaColor = colorsDistance.deltaBehind;
    }

    let SideBar = (props) => <Container>
      <Header/>
      <Content>
        <ListItem icon>
          <Left>
            <NBButton style={{backgroundColor: "#FF9501"}}>
              <NBIcon active name="pencil"/>
            </NBButton>
          </Left>
          <Body>
          <Text>Edit Course</Text>
          </Body>
          <Right>
            <Switch value={this.state.editable}
                    onValueChange={(val) => this.setState({editable: val})}/>
          </Right>
        </ListItem>
        <ListItem icon>
          <Left>
            <NBButton style={{backgroundColor: "#FF3503"}}>
              <NBIcon active name="airplane"/>
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
            <NBButton style={{backgroundColor: "#007AFF"}}>
              <NBIcon active name="boat-outline"/>
            </NBButton>
          </Left>
          <Body>
          <Text>{this.state.version}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Text>About / Help</Text>
          </Body>
        </ListItem>
      </Content>
    </Container>;

    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
        }}
        content={<SideBar/>}
      >
        <Container>
          <Header hasTabs>
            <Left>
              <NBButton transparent>
                <NBIcon name='menu' onPress={this.openDrawer.bind(this)}/>
              </NBButton>
            </Left>
            <Body>
            <Title>{this.state.courseName}</Title>
            </Body>
          </Header>
          <Tabs>
            {this.state.editable && <Tab heading="Edit Course">
              <View style={{width: '45%', flexDirection: "row"}}>
                <Button
                  onPress={() => this.pressDateTime(SET_START)}
                  title={`Set start time \n(${this.state.start.format()})`}
                  color="#40c5f4"
                  height
                />
                <Text style={{minWidth: '10%'}}/>
                <Button
                  onPress={() => this.pressDateTime(SET_FINISH)}
                  title={`Set finish time (${this.state.finish.format()})`}
                  color="#40c5f4"
                />
              </View>
              <Text style={{fontSize: 20}}>Goal ({labels.distance})</Text>
              <InputSpinner
                min={0}
                step={1}
                type={"real"}
                precision={2}
                colorMax={"#f04048"}
                colorMin={"#40c5f4"}
                value={this.ultraState.distanceGoal}
                onChange={(num) => this.setState({distanceGoal: num})}
                onFocus={() => this.inputSpinnerFocus(true)}
                onBlur={() => this.inputSpinnerFocus(false)}
                fontSize={48}
                buttonFontSize={48}
                height={100}
                width={350}
                rounded={false}
                showBorder={true}
              >
              </InputSpinner>
              <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Rows data={[
                  ['duration', `${UltraClockState.cvtDurationMsToString(this.ultraState.durationMsTotal)}`],
                  ['min pace', `${this.ultraState.cvtPaceToString(this.ultraState.paceGoal)} ${labels.pace}`],
                  ]
                } textStyle={{fontSize: 36}}/>
              </Table>
              {this.state.showDatePicker && this.dateTimePicker()}
            </Tab>}
            <Tab heading="Course">
              <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Rows data={this.leftTableData()} textStyle={{fontSize: 36}}/>
              </Table>
              <MilesSelector/>
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
                  fill={this.ultraState.cvtDistanceToPercent(this.ultraState.distanceProgress)}
                  tintColor={colorsDistance.progress}
                  backgroundColor={colorsDistance.remaining}
                >{
                  (fill) => (
                    <>
                    <Text style={Object.assign({}, styles.progressLabelMinor, {color: deltaColor})}>
                      <Icon style={styles.progressLabelMinor} name='share'/>{" "}
                      {prefix}{this.ultraState.isStarted ? this.ultraState.distanceAhead.toFixed((1)) : "---"} {labels.distance}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMain, {color: colorsDistance.progress})}>
                      <Icon style={styles.progressLabelMain} name='running'/>{" "}
                      {this.ultraState.distanceProgress.toFixed((1))} {labels.distance}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMid, {color: colorsDistance.remaining})}>
                      <Icon style={styles.progressLabelMid} name='road'/>{" "}
                      {this.ultraState.distanceRemaining.toFixed((2))} {labels.distance}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMinor, {color: deltaColor})}>
                      <Icon style={styles.progressLabelMinor} name='chart-line'/> {" "}
                      {this.ultraState.distanceProjected.toFixed((2))} {labels.distance}
                    </Text>
                    </>
                  )
                }
                </AnimatedCircularProgress>
              </View>
              <MilesSelector/>
            </Tab>
            <Tab heading="Pace">
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{
                  transform: [
                    {scaleX: -1}
                  ]
                }}>
                  <RNSpeedometer value={this.ultraState.cvtPaceToPercent(this.ultraState.paceActual)} size={300}
                                 labelNoteStyle={{fontSize: 0}} labelStyle={{fontSize: 0}}/>
                </View>
                <Text style={Object.assign({}, {color: colorsPace.average}, styles.progressLabelMain)}>
                  {this.ultraState.isStarted ? this.ultraState.cvtPaceToString(this.ultraState.paceActual) : labels.na}
                  <Text style={styles.progressLabelMinor}> {labels.pace}</Text>
                </Text>
                <Text style={Object.assign({},
                  styles.progressLabelMinor,
                  {color: (this.ultraState.paceAheadOfGoal > 0) ? colorsPace.deltaAhead : colorsPace.deltaBehind})}
                >{this.ultraState.paceAheadOfGoal > 0 ? "+" : ""}{
                  this.ultraState.isStarted ? this.ultraState.cvtPaceToString(this.ultraState.paceAheadOfGoal) : "---"}
                  <Text style={styles.progressLabelMinor}> {labels.pace}</Text>
                </Text>
                <Text style={Object.assign({},
                  styles.progressLabelSmall)}
                >
                  <Icon style={styles.progressLabelSmall} name='bed'/>{" "}
                  {((this.ultraState.durationMsRestTimeToPace > 0) && this.ultraState.isStarted) ? UltraClockState.cvtDurationMsToString(this.ultraState.durationMsRestTimeToPace) : "---"}
                  {"  "}
                  <Icon style={styles.progressLabelSmall} name='walking'/>{" "}
                  {((this.ultraState.durationMsWalkTimeToPace > 0) && this.ultraState.isStarted) ? UltraClockState.cvtDurationMsToString(this.ultraState.durationMsWalkTimeToPace) : "---"}
                </Text>
              </View>
              <MilesSelector/>
            </Tab>
            <Tab heading="Time">
              <AnimatedCircularProgress
                arcSweepAngle={UltraClockState.cvtDurationMsToPercentOfDay(this.ultraState.durationMsTotal) * 3.6}
                rotation={UltraClockState.cvtDateTimeToPercentOfDay(this.ultraState.dateTimeStart) * 3.6 + 180}
                size={360}
                width={15}
                fill={this.ultraState.cvtDurationMsToPercentOfRace(this.ultraState.durationMsProgress)}
                tintColor={colorsTime.progress}
                backgroundColor={colorsTime.remaining}>
                {
                  (fill) => (
                    <>
                    <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                      <Icon style={styles.progressLabelMinor} name='clock'/>{" "}
                      {this.ultraState.cvtDateTimeToTimeString(this.ultraState.dateTimeNowProgress)}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMain, {color: colorsTime.progress})}>
                      <Icon style={styles.progressLabelMain} name='check-circle'/>{" "}
                      {this.ultraState.isStarted ? UltraClockState.cvtDurationMsToString(this.ultraState.durationMsProgress) : "---"}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMid, {color: colorsTime.remaining})}>
                      <Icon style={styles.progressLabelMid} name='stopwatch'/>{" "}
                      {UltraClockState.cvtDurationMsToString(this.ultraState.durationMsRemaining)}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                      <Icon style={styles.progressLabelMinor} name='flag-checkered'/>{" "}
                      <Icon style={styles.progressLabelMinor} name='clock'/>{" "}
                      {this.ultraState.isStarted ? this.ultraState.cvtDateTimeToTimeString(this.ultraState.dateTimeToDistanceGoal) : "---"}
                    </Text>
                    <Text style={Object.assign({}, styles.progressLabelMinor, {color: colorsTime.now})}>
                      <Icon style={styles.progressLabelMinor} name='flag-checkered'/>{" "}
                      <Icon style={styles.progressLabelMinor} name='stopwatch'/>{" "}
                      {this.ultraState.isStarted ? UltraClockState.cvtDurationMsToString(this.ultraState.durationToDistanceGoalMs) : "---"}
                    </Text>
                    </>
                  )
                }
              </AnimatedCircularProgress>
              <MilesSelector/>
            </Tab>
            {this.state.demoMode && <Tab heading="Demo">
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Button
                    onPress={() => this.pressDateTime(DEMO_WALL_CLOCK)}
                    title={`Set wall time`}
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
                {this.state.showDatePicker && this.dateTimePicker(DEMO_WALL_CLOCK)}
              </View>
              <MilesSelector/>
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
  progressLabelSmall: {
    fontSize: 30,
  },
});
