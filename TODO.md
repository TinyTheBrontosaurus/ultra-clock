# TODO list
---
## MVP
- [x] try cricket trainer -- Failed. 
- [x] Upgrade dev env -- https://reactnative.dev/docs/environment-setup
  - [x] Upgrade android studio
  - [x] install chocolatey -- https://chocolatey.org/install
  - [x] Upgrade nodejs
  - [x] create hello world in new setup
  - [x] debug on device
  - [x] release on device
  - [x] setup jest
- [x] Find time package
- [x] Do backend math
- [x] Show on front end
- [x] fancify frontend
- [x] Add input time test
- [x] Add large/small miles steps
- [x] Add version
- [x] Add readme
---
- [x] Test jog (v0.1.0)
--- 
## MVP user testing list
- [x] Add bigger text
- [x] Use multiple screens (swipe-able?)
- [x] Remove optional / debug buttons
- [x] ~~Bigger set-to-now button~~
- [x] Auto set-to-now
- [x] Test jog again (v0.2.0)
---
## Post v0.2.0 user testing list
- [x] Research icons
- [x] Implement icons
- [x] Add gauge for progress
- [x] Show how much "rest" is okay
- [x] Show how much "walking" is okay
- [x] Give 0.5 and 1.0 as step options
- [x] Add at-a-glance tab views
- [x] Miles "expected" is visually confusing
- [x] Only update stats when miles changed; show T since last update
- [x] Use ->| icon to predict mileage
- [x] Remove v0.1.0 tab
- [x] Show version on every tab
- [x] Highlight "main" number in each tab
- [x] Test v0.3.0
- [x] Add gauge for pace
- [x] Add "demo mode" where user can disable live time
- [x] Checkered flag for time prediction
- [x] NaN edge cases
---
## Post v0.4.0 user testing
- [x] ->| doesn't go away after press
- [x] ->| text is non centered
- [x] Initial "now" should be start of race so that ->| is setup right
- [x] App reset at one point and returned to defaults. ^^ will help that
- [x] Hardcode to Wednesday
- [x] Miles editor interrupted every 10s
- [x] Miles editor interrupted by self-edit
---
## Release MVP
- [x] Add testing for math and string formatting
- [x] Lay out save object
- [x] Save state to DB
- [x] Remove hardcoded dates & distances
- [x] Add way to set start, stop, and distance
- [x] App icon
- [x] Post on app store

---
## Next release
- [x] About page
- [x] Help page


## Backlog
- [x] Notify HWYRT
- [ ] Add Bryan's quote
- [ ] Fix time picker to use UTC
- [ ] Error states? Like if duration is negative
- [ ] Add way to set width of target pace (in min/mi)
- [x] Split up tables (Parameters, distance, time)
- [ ] Dark mode
- [x] Redesign front end
- [x] Add auto-version
- [ ] Integrate with CI (Travis or whatever)
- [ ] Long press on icons to show wtf they mean
- [ ] Add short version string (tag only)
- [ ] Use almanac & location to grab sunrise/sunset
- [ ] Fix sluggishness
- [ ] Show percentages of completion
- [ ] Show "repeat what you did X more times"
- [ ] Keep the phone unlocked

## Deferred
- [ ] Add ways to change start/stop/distance using presets
- [ ] Add miles auto-set from RunKeeper
