/*
 * Copyright (c) Clinton Freeman 2020
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { createStore } from 'redux'

// LERP performs linear interpolation between the supplied values
// iL and iR. fRatio determines the returned value. fRatio = 0,
// will return iL and an fRatio of 1.0 will return iR.
function LERP(iL, iR, fRatio) {
  if (iL < iR) {
    return iL + ((iR - iL) * fRatio);
  } else {
    return iL - ((iL - iR) * fRatio);
  }
}

// greyScaleC takes an RGB collor value (each channel between
// 0 and 255 and converts them to greyscale.
function greyScaleC(iR, iG, iB) {
  var iBrightness = (3*iR+4*iG+iB) >>> 3;
  return [iBrightness, iBrightness, iBrightness];
}

function Lowana(state = {energy: 0,
                         modLoaded: false,
                         activity: false,
                         activitySim: false,
                         lastT: new Date()}, action) {

  var energy = state.energy;
  var curT = new Date();

  var deltaT = curT - state.lastT;
  var warmUpTime = 3000; // Time in milliseconds.
  var coolDown = 1500; // Time in milliseconds.

  if (state.activitySim || state.activity) {
    energy = Math.min(1, (energy + (deltaT / warmUpTime)));
  } else {
    energy = Math.max(0, (energy - (deltaT / coolDown)));
  }

  switch (action.type) {
    case 'simOn':
      return {energy: energy,
              modLoaded: state.modLoaded,
              activity: state.activity,
              activitySim: true,
              lastT: curT};

    case 'simOff':
      return {energy: energy,
              modLoaded: state.modLoaded,
              activity: state.activity,
              activitySim: false,
              lastT: curT};

    case 'actOn':
      return {energy: energy,
              modLoaded: state.modLoaded,
              activity: true,
              activitySim: state.activitySim,
              lastT: curT};

    case 'actOff':
      return {energy: energy,
              modLoaded: state.modLoaded,
              activity: false,
              activitySim: state.activitySim,
              lastT: curT};

    case 'modInit':
      return {energy: energy,
              modLoaded: false,
              activity: state.activity,
              activitySim: state.activitySim,
              lastT: curT};

    case 'modLoad':
      return {energy: energy,
              modLoaded: true,
              activity: state.activity,
              activitySim: state.activitySim,
              lastT: curT};

    case 'update':
      return {energy: energy,
              modLoaded: state.modLoaded,
              activity: state.activity,
              activitySim: state.activitySim,
              lastT: curT};

    default:
      return state
  }
}

let store = createStore(Lowana);
function startRender() {
  console.log("loaded video Metadata");

  // We have succesfully loaded a video, we don't need to display a
  // file chooser anymore.
  document.getElementById("load").style.display = 'none';

  // Set up the resolution of all our canvasses
  var eVideo = document.getElementById("player");
  var eCanvas = document.getElementById("canvas");
  var eBakCanvas = document.getElementById("bakCanvas");

  var iCanvasWidth = window.innerWidth;
  var iCanvasHeight = window.innerHeight;
  var fCanvasAspect = iCanvasWidth / iCanvasHeight;
  var fVideoAspect = eVideo.videoWidth / eVideo.videoHeight;

  eCanvas.width = iCanvasWidth;
  eCanvas.height = iCanvasHeight;

  eVideo.width = iCanvasWidth;
  eVideo.height = eVideo.width / fVideoAspect;

  eBakCanvas.width = iCanvasWidth;
  eBakCanvas.height = eVideo.width / fVideoAspect;

  console.log("M["+eVideo.videoWidth+","+eVideo.videoHeight+"]="+fVideoAspect);
  console.log("B["+eBakCanvas.width+","+eBakCanvas.height+"]");
  console.log("V["+eVideo.width+","+eVideo.height+"]="+fVideoAspect);
  console.log("C["+iCanvasWidth+","+iCanvasHeight+"]="+fCanvasAspect);


  Render();
}

// Render updates the page with the latest video content based on
// an 'energy' level that is based on activity detected by the
// webcam.
var curEnergy = 0.0;
function Render() {
  var state = store.getState();

  var eVideo = document.getElementById('player');
  var eCanvas = document.getElementById('canvas');
  var ctx = eCanvas.getContext('2d');
  var eBackCanvas = document.getElementById('bakCanvas');
  var ctxBack = eBackCanvas.getContext('2d');

  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.rect(0, 0, eCanvas.width, eCanvas.height);
  ctx.fill();
  ctx.closePath();

  if (curEnergy < state.energy) {
    curEnergy = Math.min(1, curEnergy + 0.01);
  } else {
    curEnergy = Math.max(0, curEnergy - 0.01);
  }

  // Render the video
  eVideo.playbackRate = LERP(0.2, 1.0, curEnergy);
  eVideo.volume = LERP(0, 1.0, curEnergy);

  ctxBack.drawImage(eVideo, 0, 0, eVideo.width, eVideo.height);
  var aPixels = ctxBack.getImageData(0, 0, eVideo.width, eVideo.height);

  var iNumPixels = eVideo.width * eVideo.height * 4;
  for (var i = 0; i < iNumPixels; i = i + 4) {
    var cColor = greyScaleC(aPixels.data[i],
                            aPixels.data[i+1],
                            aPixels.data[i+2]);

    aPixels.data[i] = LERP(cColor[0], aPixels.data[i], curEnergy);
    aPixels.data[i+1] = LERP(cColor[1], aPixels.data[i+1], curEnergy);
    aPixels.data[i+2] = LERP(cColor[2], aPixels.data[i+2], curEnergy);
  }

  var iDeltaH = (eCanvas.height - eVideo.height)/2
  ctx.putImageData(aPixels,0,iDeltaH);

  ctx.fillStyle = "rgb(255, 255, 255)";
  if (state.activitySim || state.activity) {
    ctx.fillText(".", 1, 1);
  }

  if (!state.modLoaded) {
    ctx.fillText("Initalising webcam sensor.", 10, 10)
  }

  window.requestAnimationFrame(Render);
};

// Create a webworker that runs tensorflow in a background
// process so rendering isn't held up by object classification.
store.dispatch({ type: 'modInit' });
var worker = undefined;
if (window.Worker) {
  worker = new Worker('detect.js');

  worker.addEventListener("message", (event) => {
    const {load} = event.data;
    if (load === true) {
      store.dispatch({ type: 'modLoad' });
    }

    const {pred} = event.data;
    if (pred === true) {
      store.dispatch({ type: 'actOn' });
    } else if (pred === false) {
      store.dispatch({ type: 'actOff' });
    }
  })

  const constraints = {
    video: true
  };

  const webCam = document.getElementById('webcam');
  navigator.mediaDevices
           .getUserMedia(constraints).then(function(stream) {
    webCam.srcObject = stream;

    // We don't need to go flat out predicting what's in
    // the field of view.
    webCam.addEventListener('loadeddata', () => setInterval(predictWebcam, 500));
  })
}

// predictWebcam takes data from the webcam and pushes
// it into the webworker so that it can be predicted by
// TensorFlow.
function predictWebcam() {
  // Copy content out of webcam and into a canvas that
  // we can farm out to the webworker.
  const webCam = document.getElementById('webcam');
  const camCanvas = document.getElementById('camCanvas');

  camCanvas.width = webCam.videoWidth;
  camCanvas.height = webCam.videoHeight;

  const tmpCtx = camCanvas.getContext('2d');
  tmpCtx.drawImage(webCam, 0, 0, webCam.videoWidth, webCam.videoHeight);
  const frame = tmpCtx.getImageData(0, 0,
                                    webCam.videoWidth, webCam.videoHeight);

  worker.postMessage(frame);
}

// When the 'g' key is pressed, simulate activity being
// detected by the webcam.
document.addEventListener('keypress', function(e) {
  if (e.code === "KeyG") {
    store.dispatch({ type: 'simOn' });
  }
})

// When the 'g' key is released, stop simulating activity
// being detected by the webcam.
document.addEventListener('keyup', function(e) {
  if (e.code === "KeyG") {
    store.dispatch({ type: 'simOff' });
  }
})

document.getElementById("load")
        .addEventListener("change", function(e) {

  var file = this.files[0];
  var fileURL = URL.createObjectURL(file);

  var eVideo = document.getElementById("player");
  eVideo.src = fileURL;

  eVideo.addEventListener("loadedmetadata", function(e) {
    startRender();
  });
});

var eVideo = document.getElementById('player');
if (eVideo.src) {
  document.getElementById("load").style.display = "none";
  eVideo.addEventListener("loadedmetadata", function(e) {
    startRender();
  });
}
