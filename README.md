# HOTA-lowana

This small javascript application uses a webcam and tensorflow to detect
the prescence of people. It will adjust video playback speed, volume and saturation based on the amount of activity. More activity = faster, louder and brighter video.

### DEVELOPMENT

To build a demo:
* parcel build index.html --public-url https://cfreeman.github.io/hota-lowana/

To run a local development instance
* parcel index.html

### TODO
* ~~Remove debug scripts.~~
* ~~Download Tensorflow scripts and package them locally.~~
* ~~Have video files detected and loaded automatically.~~
* ~~Configure LERP so that it takes ~ 2 seconds to respond to activity.~~
* ~~Package the app so it can run from local filesystem.~~
	* ~~Need to install NPM and then parcel-bundler.~~
	* ~~Script to spin everything up on startup.~~
* ~~Set up mac mini to run as a kiosk~~
	* ~~Boot on power.~~
	* ~~Automatically login.~~
	* ~~Automatically start chrome in kiosk mode.~~
	* ~~MacMini has an access point?~~
* ~~only predict 2/3 times a second.~~
* ~~Use a webworker.~~
* ~~If default video is found locally. Don't display load stuff.~~
* ~~Clean up the main loop in script.js with redux.~~
* Setup long running test.
* Test different lighting conditions.
	* Will casting a projection ontop of someone mess with the algorithm?

### CONFIG
* Update Mac Mini to latest version.

* Download and Install Chrome. -- https://www.google.com.au/intl/en_au/chrome/
	* Config Chrome to allow audio by default.
	* Click ! left of URL.
	* Click site settings.
	* Scroll down to Sound -> Change to allow.
	* Scroll down to Camera -> Change to allow.
* Install Node.js with NPM. -- https://nodejs.org/en/
* Install parcel -- https://parceljs.org
* Copy across application.
* Build application from applescript.

* Notifications - Do Not Disturb - Always On.
* Users & Groups - Login Options - Automatic login.
* Users * Groups - hota-cg1 - login items - add startup app.
* Dock & Menu Bar - automatically hide and show the dock.
* Energy Saver - Never turn display off.
* Energy Saver - Start up automatically after a power failiure.
* Desktop & Screen Saver - Screen Saver - Start after - never.
* Desktop & Screen Saver - Desktop - Colours - black.

### TROUBLESHOOTING

TBD.

### LICENSE
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

