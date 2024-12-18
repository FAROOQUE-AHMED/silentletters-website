let model;
let videoElement = document.getElementById('video');

async function loadModel() {
    model = await tf.automl.loadGraphModel('model/model.json');
    console.log('Model Loaded');
}

function setupCamera() {
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
    const predictions = await model.predict(tf.browser.fromPixels(videoElement));
    console.log(predictions);
}

loadModel();
setupCamera();
