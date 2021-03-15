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
const runtime = require('regenerator-runtime/runtime');
var cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs');
const { List } = require('immutable');

// As soon as we create the webworker, start loading the
// model. It takes a bit to spin it up.
self.postMessage({load: false});
var model = undefined;
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  self.postMessage({load: true});
});

// onmessage is called when the main thread posts a
// message to our webworker. It expects the event
// to contain a member named 'data' that is a canvas
// containing the pixels of what we want classified
// by tensorflow.
onmessage = async function(e) {
  tf.engine().startScope();

  // If the model has loaded. We can use it to detect people
  // that might be seen by the webcam.
  if (model) {
    const predictions = await model.detect(e.data);

    var pred = List(predictions)

              // Only use the predictions that tensorflow
              // is fairly confident about.
              .filter(x => x.score > 0.5)

              // We won't have any dogs, birds or cats inside
              // the gallery. Reclassify them as a 'person'.
              // Sometimes the COCO-SSD model classfies the hair
              // of a person as seen from above as a dog or a bird.
              .filter(x => x.class === 'person' ||
                           x.class === 'dog' ||
                           x.class === 'bird' ||
                           x.class === 'cat');

    // If we have elements inside the pred list, then
    // tensorflow has detected activity. Notify the
    // main thread.
    self.postMessage({pred: pred.size != 0});
  }

  //console.log(tf.memory());
  tf.engine().endScope();
  tf.disposeVariables();
  tf.dispose();
}
