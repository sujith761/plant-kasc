# Plant Disease Prediction API

Flask-based REST API for serving the plant disease detection model.

## Setup

```bash
cd ai-model/api
pip install -r requirements.txt
```

## Configuration

Create a `.env` file:

```env
FLASK_PORT=5001
MODEL_PATH=../models/plant_disease_model.h5
LABELS_PATH=../models/class_labels.json
```

## Running the API

### Development

```bash
python app.py
```

### Production (with Gunicorn)

```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

## API Endpoints

### POST /predict

Upload an image and get disease prediction.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "success": true,
  "disease": "Tomato - Early Blight",
  "confidence": 95.6,
  "plant_type": "Tomato",
  "severity": "High",
  "top_predictions": [
    {
      "disease": "Tomato - Early Blight",
      "confidence": 95.6
    }
  ],
  "timestamp": "2024-01-01T12:00:00"
}
```

### GET /classes

Get all supported disease classes.

**Response:**
```json
{
  "success": true,
  "total": 38,
  "classes": [
    {
      "id": 0,
      "name": "Apple - Apple Scab",
      "raw": "Apple___Apple_scab"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

## Testing

### Using cURL

```bash
curl -X POST http://localhost:5001/predict \
  -F "file=@path/to/plant_image.jpg"
```

### Using Python

```python
import requests

url = 'http://localhost:5001/predict'
files = {'file': open('plant_image.jpg', 'rb')}
response = requests.post(url, files=files)
print(response.json())
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid file, missing file, etc.)
- `500`: Server error (model not loaded, prediction failed, etc.)

## Deployment

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r ai-model/api/requirements.txt`
4. Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT ai-model.api.app:app`
5. Add environment variables

### Docker

```bash
docker build -t plant-disease-api .
docker run -p 5001:5001 plant-disease-api
```

## Performance

- Average inference time: < 200ms
- Supports concurrent requests
- Automatic GPU acceleration if available
- Model size: ~15MB

## Security

- File type validation
- File size limits (5MB)
- Automatic cleanup of uploaded files
- CORS enabled (configure for production)

## Troubleshooting

**Model not loading:**
- Ensure model file exists at specified path
- Check file permissions
- Verify TensorFlow installation

**Out of memory:**
- Reduce number of workers
- Use CPU mode if GPU memory is limited

**Slow predictions:**
- Enable GPU acceleration
- Use model optimization techniques
- Consider model quantization
