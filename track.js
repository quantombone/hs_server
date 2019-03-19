const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

// video.width = 500
// video.height = 400

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
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

function runDetectionImage(img) {
    if (img === null)
	return;
    model.detect(img).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, img);
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel;
    updateNote.innerText = "Loaded Model!";

    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            //console.log('hiding stuff')
            updateNote.style.visibility='hidden';
            flip_button.style.visibility='visible';
            document.getElementById('intro').style.visibility='hidden';
            //updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });

});

