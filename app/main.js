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

/**
 * The full board for crickets, including all the targets, the control board, and the statistics
 */
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress_miles: 0,
            goal_miles: 52.42,
            projected_miles: 15.3,
            start: moment("2021-01-01T07:13"),
            finish: moment("2021-01-01T16:22"),
            now: moment("2021-01-01T09:45"),
        };
    }

    getMilesRemaining = () => this.state.goal_miles - this.state.progress_miles;

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

    calculatePace() {
        let minutes = this.state.finish.diff(this.state.start, 'm');
        let miles = this.getMilesRemaining();
        let pace = minutes / miles;

        let min = pace.toFixed(0);
        let sec = (pace * 60) % 60;
        return `${min}:${sec.toFixed(0)}`;
    }

    formatTime = (momentTime) => momentTime.format("h:mma").slice(0, -1);

    leftTableData = () => [
            ['start', this.formatTime(this.state.start)],
            ['finish', this.formatTime(this.state.finish)],
            ['duration', `${this.convertDuration(this.state.start, this.state.finish)}`],
            ['distance', `${this.state.goal_miles.toFixed(2)} mi`],
            ['pace', `${this.calculatePace()} min/mi`],
        ];

    rightTableData = () => [
            ['now', this.formatTime(this.state.now)],
            ['ran', `${this.state.progress_miles.toFixed(1)} mi`],
            ['left', `${this.getMilesRemaining().toFixed(2)} mi`],
            ['elapsed', `${this.convertDuration(this.state.start, this.state.now)}`],
            ['remaining', `${this.convertDuration(this.state.now, this.state.finish)}`],
            ['avg pace', "10:23 min/mi"],
            ['projected', `${this.state.projected_miles.toFixed(2)} mi`],
        ];

    updateMiles() {
        this.setState({progress_miles: this.state.projected_miles});
        console.log(`${this.state.progress_miles} = ${this.state.projected_miles}`);
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
                                onPress={() => this.updateMiles()}
                                title={`Snap to ${this.state.projected_miles} miles`}
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
                    </View>
                </ScrollView>
            </SafeAreaView>
            </>
        );
    };
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
