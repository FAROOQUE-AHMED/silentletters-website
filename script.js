let model;
let videoElement = document.getElementById('video');
let predictionsList = document.getElementById('predictions-list');

// Classes of the model (A-Z)
const classes = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

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

// Function to classify gesture and update UI
async function classifyGesture() {
    // Get predictions
    const predictions = await model.predict(tf.browser.fromPixels(videoElement));

    // Clear existing predictions
    predictionsList.innerHTML = '';

    // Iterate through all classes and update predictions list
    classes.forEach((label, index) => {
        // Find the confidence score for the current class
        const confidence = predictions[index]?.probability || 0;

        // Create a list item for the class
        const listItem = document.createElement('div');
        listItem.className = 'prediction-item';

        // Add the label and confidence percentage
        listItem.innerHTML = `
            <span class="label">${label}</span>
            <span class="percentage">${(confidence * 100).toFixed(2)}%</span>
        `;

        // Append to the predictions list
        predictionsList.appendChild(listItem);
    });

    // Continue classifying in a loop
    requestAnimationFrame(classifyGesture);
}

// Load the model and set up the camera
loadModel();
setupCamera();
