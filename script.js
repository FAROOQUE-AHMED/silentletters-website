let model;
let videoElement = document.getElementById('video');
let predictionsList = document.getElementById('predictions-list');

// Classes of the model (A-Z)
const classes = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

async function loadModel() {
    try {
        // Load the model
        model = await tf.automl.loadGraphModel('model/model.json');
        console.log('Model Loaded Successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Failed to load the model. Please check the console for more details.');
    }
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
    }).catch((error) => {
        console.error('Error setting up camera:', error);
        alert('Failed to access the camera. Please check permissions.');
    });
}

async function classifyGesture() {
    if (!model) {
        console.error('Model is not loaded yet.');
        return;
    }

    try {
        // Get predictions
        const predictions = await model.predict(tf.browser.fromPixels(videoElement));
        console.log('Predictions:', predictions);

        // Clear existing predictions
        predictionsList.innerHTML = '';

        // Update predictions list
        classes.forEach((label, index) => {
            const confidence = predictions[index]?.probability || 0;
            const listItem = document.createElement('div');
            listItem.className = 'prediction-item';
            listItem.innerHTML = `
                <span class="label">${label}</span>
                <span class="percentage">${(confidence * 100).toFixed(2)}%</span>
            `;
            predictionsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error during classification:', error);
    }

    // Continue classifying in a loop
    requestAnimationFrame(classifyGesture);
}

// Load the model and set up the camera
loadModel();
setupCamera();
