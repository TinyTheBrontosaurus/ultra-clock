import React, { Component } from 'react';
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

import { Table, Rows } from 'react-native-table-component';

/**
 * The full board for crickets, including all the targets, the control board, and the statistics
 */
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress_miles: 0,
            projected_miles: 15.3,
            leftTableData: [
                ['start', "7:13a"],
                ['finish', "4:22p"],
                ['distance', "52.42 mi"],
                ['duration', "9h 9m"]
            ],
            rightTableData: [
                ['ran', "26.4 mi"],
                ['left', "26.0 mi"],
                ['pace', "10:23 min/mi"],
                ['elapsed', "4h 43m"],
                ['remaining', "4h 26m"],
                ['projected', "50.1 mi"],
            ]
        };
    }
    updateMiles() {
        this.setState({progress_miles: this.state.projected_miles});
        console.log(`${this.state.progress_miles} = ${this.state.projected_miles}`);
    }
    render() {
        return (
        <>
        <StatusBar barStyle="dark-content" />
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
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Rows data={this.state.leftTableData}/>
                    </Table>
                        </View>
                        <View style={{flex:1}}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Rows data={this.state.rightTableData}/>
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
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
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
