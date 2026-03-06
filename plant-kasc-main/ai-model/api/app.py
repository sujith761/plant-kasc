"""
Flask API for Plant Disease Prediction
Serves the trained TensorFlow model via REST API

Supports two modes:
  - PRODUCTION: Loads the trained TF model and runs real predictions
  - DEV/MOCK:   When no model file is found, returns mock predictions from the
                disease database so the frontend can be developed end-to-end.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import numpy as np
from PIL import Image
import os
import json
import random
from datetime import datetime

# Optional Firebase integration
try:
    import firebase_admin
    from firebase_admin import credentials, storage
    FIREBASE_AVAILABLE = True
except Exception:
    firebase_admin = None
    credentials = None
    storage = None
    FIREBASE_AVAILABLE = False

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Configuration
CONFIG = {
    'MODEL_PATH': os.environ.get('MODEL_PATH', '../models/plant_disease_model.h5'),
    'LABELS_PATH': os.environ.get('LABELS_PATH', '../models/class_labels.json'),
    'UPLOAD_FOLDER': 'uploads',
    'MAX_FILE_SIZE': 5 * 1024 * 1024,  # 5MB
    'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg', 'gif', 'webp'},
    'IMAGE_SIZE': (224, 224)
}

# Create upload folder
os.makedirs(CONFIG['UPLOAD_FOLDER'], exist_ok=True)

# Global variables for model and labels
model = None
class_labels = None
DEV_MODE = False
FIREBASE_ENABLED = False
FIREBASE_BUCKET = None

# ---------- Default 38 PlantVillage class labels ----------
DEFAULT_CLASS_LABELS = {
    "0": "Apple___Apple_scab", "1": "Apple___Black_rot",
    "2": "Apple___Cedar_apple_rust", "3": "Apple___healthy",
    "4": "Blueberry___healthy",
    "5": "Cherry_(including_sour)___Powdery_mildew",
    "6": "Cherry_(including_sour)___healthy",
    "7": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "8": "Corn_(maize)___Common_rust_",
    "9": "Corn_(maize)___Northern_Leaf_Blight",
    "10": "Corn_(maize)___healthy",
    "11": "Grape___Black_rot",
    "12": "Grape___Esca_(Black_Measles)",
    "13": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "14": "Grape___healthy",
    "15": "Orange___Haunglongbing_(Citrus_greening)",
    "16": "Peach___Bacterial_spot", "17": "Peach___healthy",
    "18": "Pepper,_bell___Bacterial_spot", "19": "Pepper,_bell___healthy",
    "20": "Potato___Early_blight", "21": "Potato___Late_blight",
    "22": "Potato___healthy", "23": "Raspberry___healthy",
    "24": "Soybean___healthy", "25": "Squash___Powdery_mildew",
    "26": "Strawberry___Leaf_scorch", "27": "Strawberry___healthy",
    "28": "Tomato___Bacterial_spot", "29": "Tomato___Early_blight",
    "30": "Tomato___Late_blight", "31": "Tomato___Leaf_Mold",
    "32": "Tomato___Septoria_leaf_spot",
    "33": "Tomato___Spider_mites Two-spotted_spider_mite",
    "34": "Tomato___Target_Spot",
    "35": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "36": "Tomato___Tomato_mosaic_virus", "37": "Tomato___healthy"
}


def load_model():
    """Load the trained model and class labels. Falls back to DEV mode if not found."""
    global model, class_labels, DEV_MODE

    # Try loading class labels first
    if os.path.exists(CONFIG['LABELS_PATH']):
        with open(CONFIG['LABELS_PATH'], 'r') as f:
            class_labels = json.load(f)
        print(f"✓ Class labels loaded: {len(class_labels)} classes")
    else:
        class_labels = DEFAULT_CLASS_LABELS
        print(f"⚠ Labels file not found – using default {len(class_labels)} classes")

    # Try loading TF model
    if os.path.exists(CONFIG['MODEL_PATH']):
        try:
            import tensorflow as tf
            from tensorflow import keras
            print("Loading TensorFlow model...")
            model = keras.models.load_model(CONFIG['MODEL_PATH'])
            print(f"✓ Model loaded from {CONFIG['MODEL_PATH']}")
            return True
        except Exception as e:
            print(f"✗ Error loading model: {str(e)}")
            print("→ Falling back to DEV/mock mode")
            DEV_MODE = True
            return True
    else:
        print(f"⚠ Model file not found at {CONFIG['MODEL_PATH']}")
        print("→ Running in DEV/mock mode (predictions will be simulated)")
        DEV_MODE = True
        return True


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in CONFIG['ALLOWED_EXTENSIONS']


def preprocess_image(image_path):
    """Preprocess image for model prediction"""
    try:
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(CONFIG['IMAGE_SIZE'])
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        # MobileNetV2 preprocessing (scale to [-1, 1])
        img_array = img_array / 127.5 - 1
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")


def mock_predict(image_path):
    """Generate a mock prediction for DEV mode using image color analysis"""
    img = Image.open(image_path).convert('RGB').resize((64, 64))
    pixels = np.array(img)
    avg_green = pixels[:, :, 1].mean()
    avg_red = pixels[:, :, 0].mean()

    # Use a simple heuristic to pick a class
    # More green → healthy, more brown/red → diseased
    healthy_classes = [k for k, v in class_labels.items() if 'healthy' in v.lower()]
    disease_classes = [k for k, v in class_labels.items() if 'healthy' not in v.lower()]

    if avg_green > avg_red + 20:
        # Mostly green → likely healthy
        top_idx = random.choice(healthy_classes)
        confidence = random.uniform(75, 95)
    else:
        top_idx = random.choice(disease_classes)
        confidence = random.uniform(60, 92)

    # Build fake top-5
    all_indices = list(class_labels.keys())
    top5_indices = [top_idx] + random.sample([i for i in all_indices if i != top_idx], 4)
    remaining_conf = 100 - confidence
    top5 = []
    for i, idx in enumerate(top5_indices):
        if i == 0:
            c = confidence
        else:
            c = remaining_conf * random.uniform(0.1, 0.5)
            remaining_conf -= c
        top5.append({
            'disease': format_disease_name(class_labels[str(idx)]),
            'confidence': round(c, 2)
        })

    return str(top_idx), round(confidence, 2), top5


def format_disease_name(disease_class):
    """Format disease class name to readable format"""
    # Replace underscores with spaces
    formatted = disease_class.replace('___', ' - ').replace('_', ' ')
    return formatted


def get_disease_info(disease_class):
    """Get additional information about the disease"""
    # Extract plant type and disease
    parts = disease_class.split('___')
    plant_type = parts[0].replace('_', ' ')
    disease = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
    
    # Determine severity
    severity = 'Low'
    if 'blight' in disease.lower() or 'rot' in disease.lower():
        severity = 'High'
    elif 'spot' in disease.lower() or 'rust' in disease.lower():
        severity = 'Medium'
    elif 'healthy' in disease.lower():
        severity = 'Low'
    else:
        severity = 'Medium'
    
    return {
        'plant_type': plant_type,
        'disease_name': disease,
        'severity': severity
    }


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    """Predict disease from uploaded image"""
    global model, class_labels, DEV_MODE

    # Check if class labels are available
    if class_labels is None:
        return jsonify({
            'success': False,
            'error': 'Server not initialised. Please check server logs.'
        }), 500

    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file provided'
        }), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': f'Invalid file type. Allowed: {", ".join(CONFIG["ALLOWED_EXTENSIONS"])}'
        }), 400

    filepath = None
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(CONFIG['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        if DEV_MODE or model is None:
            # ---------- MOCK PREDICTION ----------
            top_idx, confidence, top_5_predictions = mock_predict(filepath)
            disease_class = class_labels[str(top_idx)]
        else:
            # ---------- REAL PREDICTION ----------
            img_array = preprocess_image(filepath)
            predictions = model.predict(img_array, verbose=0)

            top_pred_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][top_pred_idx]) * 100
            disease_class = class_labels[str(top_pred_idx)]

            top_5_idx = np.argsort(predictions[0])[-5:][::-1]
            top_5_predictions = [
                {
                    'disease': format_disease_name(class_labels[str(idx)]),
                    'confidence': float(predictions[0][idx]) * 100
                }
                for idx in top_5_idx
            ]

        # Get disease info
        disease_info = get_disease_info(disease_class)

        # If Firebase is enabled, upload the image to the configured bucket
        image_url = f"/uploads/{unique_filename}"
        if FIREBASE_ENABLED and FIREBASE_AVAILABLE and FIREBASE_BUCKET:
            try:
                blob = FIREBASE_BUCKET.blob(unique_filename)
                blob.upload_from_filename(filepath)
                # Make public for easy display (ensure your bucket policy allows this)
                try:
                    blob.make_public()
                    image_url = blob.public_url
                except Exception:
                    # If cannot make public, leave path as API-served path
                    image_url = f"/uploads/{unique_filename}"
            except Exception as e:
                print(f"⚠ Firebase upload failed: {e}")
                image_url = f"/uploads/{unique_filename}"

        return jsonify({
            'success': True,
            'disease': format_disease_name(disease_class),
            'disease_class': disease_class,
            'confidence': confidence,
            'plant_type': disease_info['plant_type'],
            'severity': disease_info['severity'],
            'top_predictions': top_5_predictions,
            'image_url': image_url,
            'dev_mode': DEV_MODE,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        if filepath and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({
            'success': False,
            'error': f'Prediction failed: {str(e)}'
        }), 500


@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename):
    """Serve uploaded images so the frontend can display them"""
    from flask import send_from_directory
    return send_from_directory(CONFIG['UPLOAD_FOLDER'], filename)


@app.route('/classes', methods=['GET'])
def get_classes():
    """Get all supported disease classes"""
    global class_labels
    
    if class_labels is None:
        return jsonify({
            'success': False,
            'error': 'Class labels not loaded'
        }), 500
    
    formatted_classes = [
        {
            'id': int(idx),
            'name': format_disease_name(disease),
            'raw': disease
        }
        for idx, disease in class_labels.items()
    ]
    
    return jsonify({
        'success': True,
        'total': len(formatted_classes),
        'classes': formatted_classes
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API information"""
    return jsonify({
        'name': 'Plant Disease Prediction API',
        'version': '1.0.0',
        'description': 'AI-powered plant disease detection using deep learning',
        'endpoints': {
            'POST /predict': 'Upload image and get disease prediction',
            'GET /classes': 'Get all supported disease classes',
            'GET /health': 'Health check endpoint'
        },
        'model': {
            'type': 'MobileNetV2',
            'classes': len(class_labels) if class_labels else 0,
            'input_size': CONFIG['IMAGE_SIZE']
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Plant Disease Prediction API")
    print("=" * 60)

    # Load model on startup (always succeeds – falls back to DEV mode)
    load_model()

    # Initialize Firebase if credentials and bucket are provided
    firebase_cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS') or os.environ.get('FIREBASE_SERVICE_ACCOUNT')
    firebase_bucket_name = os.environ.get('FIREBASE_STORAGE_BUCKET')
    if firebase_cred_path and firebase_bucket_name and FIREBASE_AVAILABLE:
        try:
            cred = credentials.Certificate(firebase_cred_path) if not firebase_admin._apps else None
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {'storageBucket': firebase_bucket_name})
            FIREBASE_BUCKET = storage.bucket()
            FIREBASE_ENABLED = True
            print(f"✓ Firebase initialized. Using bucket: {firebase_bucket_name}")
        except Exception as e:
            print(f"⚠ Firebase init failed: {e}")
            FIREBASE_ENABLED = False
    else:
        if not FIREBASE_AVAILABLE:
            print("⚠ firebase-admin not installed; skipping Firebase initialization")
        else:
            print("ℹ Firebase not configured (set GOOGLE_APPLICATION_CREDENTIALS and FIREBASE_STORAGE_BUCKET to enable)")

    port = int(os.environ.get('FLASK_PORT', 5001))
    if DEV_MODE:
        print(f"\n⚠  Running in DEV/MOCK mode (no trained model)")
        print(f"   Predictions will be simulated.")
    else:
        print(f"\n✓ Real model loaded – production predictions enabled")

    print(f"✓ Listening on http://localhost:{port}")
    print("=" * 60)

    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.environ.get('FLASK_DEBUG', 'True') == 'True'
    )
