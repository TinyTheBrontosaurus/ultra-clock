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
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import InputSpinner from "react-native-input-spinner";

import {Table, Rows} from 'react-native-table-component';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeModules } from 'react-native';
const { VersionModule } = NativeModules;


/**
 * The full board for crickets, including all the targets, the control board, and the statistics
 */
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        const { VERSION_STRING } = VersionModule.getConstants();
        this.state = {
            progress_miles: 0,
            goal_miles: 52.42,
            start: moment("2021-01-01T07:13"),
            finish: moment("2021-01-01T16:22"),
            now: moment(),
            showDatePicker: false,
            modeDatePicker: "date",
            version: VERSION_STRING
        };
    }

    getMilesRemaining = () => this.state.goal_miles - this.state.progress_miles;

    isStarted  = () => this.state.now.diff(this.state.start) > 0;

    convertDuration(start, end) {
        // calculate total duration
        let duration = moment.duration(end.diff(start));

        let days = parseInt(duration.asDays());
        let hours = parseInt(duration.asHours()) % 24;
        let minutes = parseInt(duration.asMinutes()) % 60;

        if(days > 0) {
            return `${days.toFixed(0)}d ${hours.toFixed(0)}h ${minutes.toFixed(0)}m`
        }
        else if(hours > 0) {
            return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m`
        }
        else {
            return `${minutes.toFixed(0)}m`
        }
    }

    calculatePace(start, finish, miles) {
        let minutes = finish.diff(start, 'm');
        let pace = minutes / miles;

        let min = Math.floor(pace);
        let sec = (pace * 60) % 60;
        return `${min}:${sec.toFixed(0).padStart(2, '0')}`;
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
            ['avg pace', `${this.isStarted() ?  this.calculatePace(this.state.start, this.state.now, this.state.progress_miles) : labels.na} ${labels.pace}`],
            ['req pace', `${this.isStarted() ? this.calculatePace(this.state.now, this.state.finish, this.getMilesRemaining()) : labels.na} ${labels.pace}`],
            ['projected', `${this.isStarted() ? this.getProjectedMiles().toFixed(2) : labels.na} mi`],
            ['expected', `${this.isStarted() ? this.getExpectedMiles().toFixed(2) : labels.na} mi`],
        ];

    updateTime() {
        this.setState({now: moment()});
    }

    pressDateTime(date) {
        console.log(date);
        if(!this.state.showDatePicker) {
            // Button pressed
            this.setState({showDatePicker: true, modeDatePicker: 'date'});
            return;
        }

        if(date === undefined) {
            // Cancelled
            this.setState({showDatePicker: false, modeDatePicker: 'date'});
        }
        else if(this.state.modeDatePicker === "date") {
            // Date was set. now select time
            this.setState({showDatePicker: true, modeDatePicker: 'time', now: moment(date)});
        }
        else {
            // Time was set. done now.
            this.setState({showDatePicker: false, modeDatePicker: 'date', now: moment(date)});
        }
    }

    render() {
        return (
            <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <InputSpinner
                                min={0}
                                step={0.1}
                                type={"real"}
                                precision={1}
                                colorMax={"#f04048"}
                                colorMin={"#40c5f4"}
                                value={this.state.progress_miles}
                                onChange={(num) => {
                                    this.setState({progress_miles: num});
                                    console.log(num);
                                }}
                                fontSize={48}
                                buttonFontSize={48}
                                height={100}
                                width={300}
                            />
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
                        <Text>{this.state.version}</Text>
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
                </ScrollView>
            </SafeAreaView>
            </>
        );
    };
};

const labels = {
    pace: "min/mi",
    distance: "mi",
    na: "--",
};

const styles = StyleSheet.create({
    tableTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center',
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
