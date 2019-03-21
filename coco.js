
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let model = null;
let fps = null;

function startVideo(video) {
    // Video must have height and width in order to be used as input for NN
    // Aspect ratio of 3/4 is used to support safari browser.
    video.width = video.width || 640;
    video.height = video.height || video.width * (3 / 4)
    
    return new Promise(function (resolve, reject) {
	navigator.mediaDevices
	    .getUserMedia({
		audio: false,
		video: {
		    facingMode: "environment"
		}
	    })
	    .then(stream => {
		window.localStream = stream;
		video.srcObject = stream
		video.onloadedmetadata = () => {
		    video.play()
		    resolve(true)
		}
	    }).catch(function (err) {
		resolve(false)
	    });
    });
    
}//end start video

function renderPredictions(predictions, canvas, context, mediasource) {
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.width = mediasource.width;
    canvas.height = mediasource.height;

    
    context.save();
    //if (this.modelParams.flipHorizontal) {
    //context.scale(-1, 1);
    //context.translate(-mediasource.width, 0);
    //}
    context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
    context.restore();
    context.font = '16px Arial';
    
    // console.log('number of detections: ', predictions.length);
    for (let i = 0; i < predictions.length; i++) {
	context.beginPath();
	context.fillStyle = "rgba(255, 255, 255, 0.6)";
	context.fillRect(predictions[i].bbox[0]-2, predictions[i].bbox[1] - 22, predictions[i].bbox[2]+4, 22)
	context.rect(...predictions[i].bbox);
	
	// draw a dot at the center of bounding box
	
	context.lineWidth = 5;
	context.strokeStyle = '#0063FF';
	//context.fillStyle = "#0063FF" // "rgba(244,247,251,1)";
	context.fillStyle = '#0063ff';
	//context.fillRect(predictions[i].bbox[0] + (predictions[i].bbox[2] / 2), predictions[i].bbox[1] + (predictions[i].bbox[3] / 2), 5, 5)
	
	context.stroke();
	context.fillText(
	    predictions[i].score.toFixed(3) + ' ' + " | "+predictions[i].class,
	    predictions[i].bbox[0] + 5,
	    predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
    }
    
    // Write FPS to top left
    context.font = "bold 14px Arial";
    context.fillStyle = '#0000ff';
    context.fillText("[FPS]: " + fps, 10, 20)
}

function runDetection() {
    let timeBegin = Date.now();
    model.detect(video).then(predictions => {
	
	let timeEnd = Date.now();
	fps = Math.round(1000 / (timeEnd - timeBegin))
	if (predictions.length > 0) {
	    // uncomment this to output predictions to console
	    //console.log("Predictions: ", predictions);
	}
	renderPredictions(predictions, canvas, context, video);
	requestAnimationFrame(runDetection);
    });
}

// Load the model.
cocoSsd.load().then(lmodel => {
    model = lmodel;
    startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            runDetection();
        }  
    });
});
