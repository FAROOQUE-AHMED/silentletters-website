let model;
let videoElement = document.getElementById('video');
let predictedLetterElement = document.getElementById('predicted-letter');

async function loadModel() {
    // Load the model
    model = await tf.automl.loadGraphModel('model/model.json');
    console.log('Model Loaded');
}

function setupCamera() {
    // Set up camera stream
    navigator.mediaDevices.getUserMedia({
        video: true,
    }).then((stream) => {
        videoElement.srcObject = stream;
        videoElement.onloadeddata = () => {
            console.log('Camera ready');
            classifyGesture();
        };
    });
}

async function classifyGesture() {
    // Get the current frame and classify the gesture
    const predictions = await model.predict(tf.browser.fromPixels(videoElement));
    if (predictions && predictions.length > 0) {
        const predictedLetter = predictions[0].className; // Assuming className is the predicted letter
        console.log(predictedLetter);

        // Display the predicted letter in the HTML
        predictedLetterElement.textContent = predictedLetter;
    }
    // Continue classifying
    requestAnimationFrame(classifyGesture);
}

loadModel();
setupCamera();
