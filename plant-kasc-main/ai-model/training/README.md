# Plant Disease AI Model

This directory contains the AI/ML model for plant disease detection.

## Dataset

Download the PlantVillage dataset from Kaggle:
- URL: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
- Extract to: `ai-model/dataset/PlantVillage/`

The dataset contains 38 classes of plant diseases and healthy plants.

## Training

### Setup

```bash
cd ai-model/training
pip install -r requirements.txt
```

### Train the Model

```bash
python train_model.py
```

### Model Architecture

- **Base Model**: MobileNetV2 (pre-trained on ImageNet)
- **Transfer Learning**: Yes
- **Input Size**: 224x224x3
- **Output Classes**: 38
- **Optimizer**: Adam
- **Loss Function**: Categorical Crossentropy

### Training Strategy

1. **Phase 1**: Train only custom top layers (base model frozen)
2. **Phase 2** (Optional): Fine-tune last 20 layers of base model

### Expected Performance

- **Accuracy**: 95%+
- **Training Time**: ~2-3 hours (GPU recommended)
- **Model Size**: ~15MB

## Model Output

Trained model will be saved to:
- `ai-model/models/plant_disease_model.h5`
- `ai-model/models/class_labels.json`

## Supported Disease Classes

The model can detect 38 different plant diseases across multiple crops:

- **Apple**: Scab, Black Rot, Cedar Apple Rust, Healthy
- **Blueberry**: Healthy
- **Cherry**: Powdery Mildew, Healthy
- **Corn**: Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy
- **Grape**: Black Rot, Esca, Leaf Blight, Healthy
- **Orange**: Huanglongbing (Citrus Greening)
- **Peach**: Bacterial Spot, Healthy
- **Pepper**: Bacterial Spot, Healthy
- **Potato**: Early Blight, Late Blight, Healthy
- **Raspberry**: Healthy
- **Soybean**: Healthy
- **Squash**: Powdery Mildew
- **Strawberry**: Leaf Scorch, Healthy
- **Tomato**: Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy

## Usage

After training, the model can be used via:
1. Flask API (see `ai-model/api/`)
2. TensorFlow.js (convert model using `tensorflowjs_converter`)
3. Direct Python inference

## Tips for Better Results

1. Use GPU for training (CUDA-enabled)
2. Enable data augmentation
3. Use fine-tuning for better accuracy
4. Monitor validation loss to prevent overfitting
5. Use early stopping to save training time
