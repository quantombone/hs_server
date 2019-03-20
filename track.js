const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let updateNote = document.getElementById("updatenote");
let threshButton = document.getElementById("thresh_button3");
let model = null;

function thresh_increase(increment) {
  modelParams.scoreThreshold += increment;

  if (modelParams.scoreThreshold < .1)
    modelParams.scoreThreshold = .1;

  if (modelParams.scoreThreshold > .9)
    modelParams.scoreThreshold = .9;

  modelParams.scoreThreshold = Number(modelParams.scoreThreshold.toFixed(2));
  model.setModelParameters(modelParams);
  threshButton.innerHTML=modelParams.scoreThreshold;
}

function flip_function() {
  modelParams.flipHorizontal = !modelParams.flipHorizontal;
  model.setModelParameters(modelParams);
}

var modelParams = {
  flipHorizontal: false,   // flip e.g for video
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function runDetection() {
  model.detect(video).then(predictions => {
    if (predictions.length > 0) {
      // uncomment this to output predictions to console
      //console.log("Predictions: ", predictions);
    }
    model.renderPredictions(predictions, canvas, context, video);
    requestAnimationFrame(runDetection);   
  });
}

// Load the model.
load(modelParams).then(lmodel => {
  // detect objects in the image.
  model = lmodel;
  updateNote.innerText = "Loaded Model!";
  startVideo(video).then(function (status) {
    console.log("video started", status);
    if (status) {
      threshButton.innerHTML=modelParams.scoreThreshold;
      updateNote.style.visibility='hidden';
      flip_button.style.visibility='visible';
      document.getElementById('intro').style.visibility='hidden';
      runDetection();
    } else {
      updateNote.innerText = "Please enable video";
    }
  });
});
