import React, {Component} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  StyleSheet,
  View,
  Text,
  Linking,
} from 'react-native';



let aboutTxt = <Text>

  The purpose of this app is to calculate all of that for the runner and display it very easily.

  Before the run, the runner inputs
  * Target start time (e.g., sunrise)
  * Target completion time (e.g., sunset)
  * Goal distance in that time

  While running, the user can input the number of miles run so far. (Note: a separate solution is needed to calculate
  this distance, be that a GPS app or a GPS watch or mile markers). The app wil then calculate the following
  * Distance
  * How far ahead (or behind) the goal pace
  * How far the runner has gone
  * How far is left until the goal distance
  * The project distance traveled at sunset, assuming average pace
  * Pace
  * The average pace since sunrise
  * How far ahead (or behind) the goal pace
  * How much time the runner can walk and still be on the goal pace
  * How much time the runner can rest and still be on the goal pace
  * Time
  * Duration elapsed since sunrise
  * Duration remaining until sunset
  * The estimated time at which the goal distance will be reached
  * The estimated duration until the goal distance will be reached


  Notes about using the app
  *  Test the app yourself before your big run! Test it both on the couch, to see how it works, and test it
  on a shorter run to see how you like it. I don't recommend wrestling with it during an important run.
  * The calculated statistics only updates when the runner sets the distance; the app uses the time on the phone
  to calculate speeds.
  * When on the couch, use "Demo Mode" to set the time that the app will see.
  * The app wlil offer a ->| button to "fast forward" based upon expected pace. The intention there is to
  make it easy to set the completed distance.
  * The app is still useful if one runs after "sunset"; for my first run with this app, I was around 43 miles
  at sunset but had a goal of 52.5. The math it calculated was still helpful as I extended my run further.

  This app is available free of charge. If you would like to donate, please send
  <Text style={{color: 'blue'}}
        onPress={() => Linking.openURL('https://howwasyourruntoday.com/donate')}>
    $26.21 to the HWYRT podcast
  </Text>.

  This app is also only available on Android. If you are an iOS developer or know an iOS developer, porting
  to iOS will be *very easy*. The entire codebase is and only needs to be re-compiled for iOS and posted
  on the App Store.
  <Text style={{color: 'blue'}}
        onPress={() => Linking.openURL('https://github.com/TinyTheBrontosaurus/ultra-clock')}>
    available on GitHub
  </Text>. Same offer is available for anyone who wants to clean up the graphics.
</Text>;


const slides = [
  {
    key: 'one',
    title: 'Welcome to the Soul-Search Ultra Marathon Clock!',
    body:() =>  <Text>
    The Soul-Searching Ultra Clock app is an extremely niche app meant for ultramarathoners who are running
    a pre-specified amount of time. An example of this is a "Solstice Run" where a one runs from sunrise to
    sunset. This app was inspired by the "How Was Your Run Today" podcast episode 216.5
    <Text style={{color: 'blue'}}
    onPress={() => Linking.openURL('https://howwasyourruntoday.com/episodes/hwyrt-holiday-bonus-bryans-soul-searching-s1!b121d')}>
    HWYRT Holiday Bonus - Bryan's Soul Searching Solstice Run
    </Text>
    where host Bryan ran from sunrise to sunset. The author is this app ran a similar run on December 30, 2020
    using this app and now wants to share it with the wider community.
    </Text>,
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: 'Math is hard',
    body: () => <Text>
    Whenever I run, I am frequently doing math in my head. Calculating my pace. Calculating how far I have left to go.
    How much time is left? What pace do I need to go from here to hit my goal? Can I go faster? slower?

    Doing a lot of this math is no problem early in a run. No only is the math easier, but the mind is also still fresh.
    <Text style="italic">2 miles in 22 minutes, 11 min/mile,
    50 miles in 550 minutes which is... um... 9 hours 10 minutes</Text>
    But a little ways into the run and the math gets a lot harder.
    <Text style="italic">Okay. 7.5 miles in. I started at 7:13a, and it's now 8:35a. So that's an hour and 22 minutes. 72 minutes.
    82 minutes per 7.5 miles is ... um... between 10 and 11 minutes/mile. so i'll be done in between 430 minutes and um... 500 minutes?
    Then what time wlil I be done? Oh, look I'm at 8 miles now. maybe this math will be easier.
    </Text>
    Now imagine further and further into the run having to calculate at 17 miles, 29 miles, 43 miles. Not only is
    the math nearly impossible, but your mind is exhausted.</Text>,
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'Rocket guy',
    body: () => aboutTxt,
    backgroundColor: '#22bcb5',
  }
];


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
});


export default class About extends Component {

  constructor(props) {
    super(props);
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        {item.body()}
      </View>
    );
  };

  render() {
    return <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this.props.onDone}/>;
  }
}

