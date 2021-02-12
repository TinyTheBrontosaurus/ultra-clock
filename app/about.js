import React, {Component} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  StyleSheet,
  View,
  Text,
  Linking,
} from 'react-native';

import Markdown from 'react-native-markdown-display';

const mathIsHardTxt1 = `
Whenever I run, I am frequently doing math in my head. Calculating my pace. Calculating how far I have left to go. How much time is left? What pace do I need to go from here to hit my goal? Can I go faster? Should I go slower?

Doing a lot of this math is no problem early in a run. Not only is the math easier, but the mind is also still fresh. Also there's plenty of time to do long division in one's head. What else are you going to do all day?

*2 miles in 22 minutes... so 11 minutes per mile. So for 50 miles that's 550 minutes. which is... um... 9 hours 10 minutes*

That math is already hard, but a little ways into the run and the math gets a lot lot harder.
`;

const mathIsHardTxt2 = `
*Okay. 7.5 miles in. I started at 7:13a, and it's now 8:35a. So that's an hour and 22 minutes. 72 minutes. 82 minutes per 7.5 miles is ... um... between 10 and 11 minutes/mile. so I'll be done in between 430 minutes and um... 500 minutes?  I'm either going too fast or too slow. I can't tell. Then what time will I be done? Oh, look I'm at 8 miles now. maybe this math will be easier.*

Now imagine further and further into the run having to calculate at 17 miles, 29 miles, 43 miles. Not only is the math nearly impossible without a calculator (or at least pen and paper), but your mind is exhausted. 

If only there was a machine that could do this math automatically...
`;

const aboutTxt = [`
The purpose of this app is to calculate stats for the runner and display it very easily.

Before the run, the runner inputs

+ Target start time (e.g., sunrise)
+ Target completion time (e.g., sunset)
+ Goal distance in that time
`,`
While running, the user inputs the number of miles run so far. Based upon the time at which that time was entered, the app will then calculate the following
+ Distance tab
  + How far ahead (or behind) the goal pace
  + How far the runner has gone
  + How far is left until the goal distance
  + The project distance traveled at sunset, assuming average pace
+ Pace tab
  + The average pace since sunrise
  + How far ahead (or behind) the goal pace
  + How much time the runner can walk and still be on the goal pace
  + How much time the runner can rest and still be on the goal pace
+ Time tab
  + Duration elapsed since sunrise
  + Duration remaining until sunset
  + The estimated time at which the goal distance will be reached
  + The estimated duration until the goal distance will be reached
`,`

Tips for using the app
+  Test the app yourself before your big run! Test it both on the couch, to see how it works, and test it on a shorter run to see how you like it. I don't recommend wrestling with it during an important run.
+ When testing on the couch, use "Demo Mode" to set the time that the app will see. Remember, the app does not capture that time until the distance value is changed
* The time used for calculating statistics is that time on your phone as of the time when the distance value is changed
+ The app wlil offer a ->| button to "fast forward" based upon expected pace. The intention there is to make it easy to set the completed distance.
+ The app is still useful if one runs after "sunset"; for my first run with this app, I was around 43 miles at sunset but had a goal of 52.5. The math it calculated was still helpful as I extended my run further.
* This app is *not* a GPS app. It will not measure distances automatically.
`,`
This app is available free of charge. If you would like to donate, please send [$26.21 to the HWYRT podcast](https://howwasyourruntoday.com/donate').

This app is also only available on Android. If you are an iOS developer or know an iOS developer, porting to iOS will be *very easy*. The entire codebase is in React and only needs to be re-compiled for iOS and posted on the App Store. [Code available on GitHub](https://github.com/TinyTheBrontosaurus/ultra-clock). 

Same offer is available for anyone who wants to clean up the graphical design.
`];

const backgroundColor = '#22bcb5';

const about_slides = aboutTxt.map((txt, index) => {return {
  key: `help_${index}`,
  title: index < 3 ? `How to use (pt. ${index + 1})` : "Contibute",
  body: () => <Markdown>{txt}</Markdown>,
  backgroundColor
}});

const slides = [
  {
    key: 'one',
    title: 'Welcome to the\nSoul-Searching\nUltra Marathon Clock!',
    body:() =>  <Markdown>{`
The Soul-Searching Ultra Clock app is an **extremely** niche app.

Not only is it for ultra runners, but specifically for ultra runners who are running for a pre-specified amount of time. The primary example of this is a "Solstice Run" where a one runs from sunrise to sunset. This app was inspired by the "How Was Your Run Today" podcast episode 216.5: [HWYRT Holiday Bonus - Bryan's Soul Searching Solstice Run](https://howwasyourruntoday.com/episodes/hwyrt-holiday-bonus-bryans-soul-searching-s1!b121d) where host Bryan ran from sunrise to sunset.

The author is this app ran a similar run on December 30, 2020 using this app and is sharing it with the wider community.

*Note this app is not affiliated with HWYRT other than the author listens to all of the episodes
    `}</Markdown>,
  },
  {
    key: 'two',
    title: 'Math is hard',
    body: () => <Markdown>{mathIsHardTxt1}</Markdown>,
  },
  {
    key: 'two-two',
    title: 'Tired math is even harder',
    body: () => <Markdown>{mathIsHardTxt2}</Markdown>,
  },
].concat(about_slides);


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: "#ab87ab",
  },
  slide_margin: {
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 22,
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
        <View style={styles.slide_margin}>
          <Text style={styles.title}>{item.title}</Text>
          {item.body()}
        </View>
      </View>
    );
  };

  render() {
    return <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this.props.onDone}/>;
  }
}

