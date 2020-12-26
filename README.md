# Purpose
The purpose of this app is to calculate statistics during a sunrise-to-sunset ultramarathon. Usually when
running the runner has plenty of time to do (bad) math in their head on how much further they have to
go, how fast they have to run to make it, how much slack they have, etc. This app does all that math
automatically.

This app was inspired by "Bryan's Soul Searching Solstice Run" on December 21, 2020 featured on the "How Was Your Run 
Today" Podcast (https://howwasyourruntoday.com/episodes/hwyrt-holiday-bonus-bryans-soul-searching-s1!b121d). My plan is 
to do this run on January 1, 2021 so I will be unlikely to maintain this app after that day. 


# History
* v0.1.0 -- MVP. Calculates basic statistics. Hard-coded dates for sunrise/sunset on 1/1/2021. 


# Developer information
This was developed on Windows 10 for a Samsun Galaxy S7 Edge using 
* IntelliJ 2017.2.1
* Android Studio 4.1.1  (Note this horrible bug: https://stackoverflow.com/a/64741229/5360912)

I use IntelliJ for all JS dev and open it from the project root. I use AS for Java development and open from the `android` folder

## To run unit tests
From the root:
```
nps jest
```
Note: I Have not yet successfully integrated with the old version of IntelliJ. I was successful back in 2017-2018 but it
appears incompatible now. 

## To run the app
### In one PowerShell window
`npx react-native start --reset-cache`

### In the other window

#### Debug
In debug (best for faster dev). Takes a few minutes the first time, then update immediately

`npx react-native run-android`

#### Release
To send a release (for faster execution). Takes ~5 minutes

`npx react-native run-android --variant=release`