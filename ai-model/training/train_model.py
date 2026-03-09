"""
Plant Disease Classification Model Training Script
Uses Transfer Learning with MobileNetV2 for efficient plant disease detection
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import json

# Configuration
CONFIG = {
    'IMAGE_SIZE': (224, 224),
    'BATCH_SIZE': 32,
    'EPOCHS': 50,
    'LEARNING_RATE': 0.0001,
    'DATASET_PATH': '../dataset/PlantVillage',  # Download from Kaggle
    'MODEL_SAVE_PATH': '../models/plant_disease_model.h5',
    'LABELS_SAVE_PATH': '../models/class_labels.json',
    'VALIDATION_SPLIT': 0.2,
    'TEST_SPLIT': 0.1
}

# Disease classes (38 classes from PlantVillage dataset)
DISEASE_CLASSES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

class PlantDiseaseModel:
    def __init__(self, config):
        self.config = config
        self.model = None
        self.history = None
        
    def create_model(self, num_classes):
        """
        Create model using MobileNetV2 with transfer learning
        """
        print(f"Creating model for {num_classes} classes...")
        
        # Load pre-trained MobileNetV2 (without top layer)
        base_model = MobileNetV2(
            input_shape=(*self.config['IMAGE_SIZE'], 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        # Create new model
        inputs = keras.Input(shape=(*self.config['IMAGE_SIZE'], 3))
        
        # Preprocessing
        x = layers.Rescaling(1./127.5, offset=-1)(inputs)
        
        # Base model
        x = base_model(x, training=False)
        
        # Custom top layers
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dense(512, activation='relu')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        
        # Output layer
        outputs = layers.Dense(num_classes, activation='softmax')(x)
        
        model = keras.Model(inputs, outputs)
        
        # Compile model
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=self.config['LEARNING_RATE']),
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=5, name='top5_accuracy')]
        )
        
        self.model = model
        print("Model created successfully!")
        return model
    
    def prepare_data(self):
        """
        Prepare data generators with augmentation
        """
        print("Preparing data generators...")
        
        # Training data augmentation
        train_datagen = ImageDataGenerator(
            rotation_range=30,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest',
            validation_split=self.config['VALIDATION_SPLIT']
        )
        
        # Validation data (no augmentation)
        val_datagen = ImageDataGenerator(
            validation_split=self.config['VALIDATION_SPLIT']
        )
        
        # Training generator
        train_generator = train_datagen.flow_from_directory(
            self.config['DATASET_PATH'],
            target_size=self.config['IMAGE_SIZE'],
            batch_size=self.config['BATCH_SIZE'],
            class_mode='categorical',
            subset='training',
            shuffle=True
        )
        
        # Validation generator
        val_generator = val_datagen.flow_from_directory(
            self.config['DATASET_PATH'],
            target_size=self.config['IMAGE_SIZE'],
            batch_size=self.config['BATCH_SIZE'],
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
        
        print(f"Found {train_generator.samples} training images")
        print(f"Found {val_generator.samples} validation images")
        print(f"Number of classes: {train_generator.num_classes}")
        
        # Save class labels
        class_indices = train_generator.class_indices
        labels = {v: k for k, v in class_indices.items()}
        
        os.makedirs(os.path.dirname(self.config['LABELS_SAVE_PATH']), exist_ok=True)
        with open(self.config['LABELS_SAVE_PATH'], 'w') as f:
            json.dump(labels, f, indent=2)
        print(f"Class labels saved to {self.config['LABELS_SAVE_PATH']}")
        
        return train_generator, val_generator
    
    def train(self, train_generator, val_generator):
        """
        Train the model
        """
        print("Starting model training...")
        
        # Callbacks
        callbacks = [
            ModelCheckpoint(
                self.config['MODEL_SAVE_PATH'],
                monitor='val_accuracy',
                save_best_only=True,
                mode='max',
                verbose=1
            ),
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            )
        ]
        
        # Train model
        self.history = self.model.fit(
            train_generator,
            validation_data=val_generator,
            epochs=self.config['EPOCHS'],
            callbacks=callbacks,
            verbose=1
        )
        
        print("Training completed!")
        return self.history
    
    def fine_tune(self, train_generator, val_generator):
        """
        Fine-tune the model by unfreezing some base model layers
        """
        print("Starting fine-tuning...")
        
        # Unfreeze the base model
        base_model = self.model.layers[2]  # MobileNetV2 layer
        base_model.trainable = True
        
        # Freeze all layers except the last 20
        for layer in base_model.layers[:-20]:
            layer.trainable = False
        
        # Recompile with lower learning rate
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=self.config['LEARNING_RATE'] / 10),
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=5, name='top5_accuracy')]
        )
        
        # Fine-tune
        history_fine = self.model.fit(
            train_generator,
            validation_data=val_generator,
            epochs=20,
            callbacks=[
                ModelCheckpoint(
                    self.config['MODEL_SAVE_PATH'],
                    monitor='val_accuracy',
                    save_best_only=True,
                    verbose=1
                ),
                EarlyStopping(
                    monitor='val_loss',
                    patience=5,
                    restore_best_weights=True
                )
            ],
            verbose=1
        )
        
        print("Fine-tuning completed!")
        return history_fine
    
    def plot_training_history(self):
        """
        Plot training history
        """
        if self.history is None:
            print("No training history available")
            return
        
        fig, axes = plt.subplots(1, 2, figsize=(15, 5))
        
        # Accuracy plot
        axes[0].plot(self.history.history['accuracy'], label='Training Accuracy')
        axes[0].plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        axes[0].set_title('Model Accuracy')
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Accuracy')
        axes[0].legend()
        axes[0].grid(True)
        
        # Loss plot
        axes[1].plot(self.history.history['loss'], label='Training Loss')
        axes[1].plot(self.history.history['val_loss'], label='Validation Loss')
        axes[1].set_title('Model Loss')
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('Loss')
        axes[1].legend()
        axes[1].grid(True)
        
        plt.tight_layout()
        plt.savefig('../models/training_history.png')
        print("Training history plot saved to ../models/training_history.png")
        plt.show()
    
    def evaluate_model(self, val_generator):
        """
        Evaluate model on validation set
        """
        print("Evaluating model...")
        
        # Predictions
        predictions = self.model.predict(val_generator)
        y_pred = np.argmax(predictions, axis=1)
        y_true = val_generator.classes
        
        # Load class names
        with open(self.config['LABELS_SAVE_PATH'], 'r') as f:
            labels = json.load(f)
        class_names = [labels[str(i)] for i in range(len(labels))]
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(y_true, y_pred, target_names=class_names))
        
        # Overall accuracy
        accuracy = np.mean(y_pred == y_true)
        print(f"\nOverall Accuracy: {accuracy * 100:.2f}%")
        
        return accuracy


def main():
    """
    Main training pipeline
    """
    print("=" * 60)
    print("Plant Disease Classification - Model Training")
    print("=" * 60)
    
    # Check if dataset exists
    if not os.path.exists(CONFIG['DATASET_PATH']):
        print(f"\n⚠️  Dataset not found at {CONFIG['DATASET_PATH']}")
        print("Please download the PlantVillage dataset from:")
        print("https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset")
        print("Extract it to the ai-model/dataset/ directory")
        return
    
    # Create model instance
    model_trainer = PlantDiseaseModel(CONFIG)
    
    # Prepare data
    train_gen, val_gen = model_trainer.prepare_data()
    
    # Create model
    model_trainer.create_model(num_classes=train_gen.num_classes)
    
    # Print model summary
    print("\nModel Summary:")
    model_trainer.model.summary()
    
    # Train model
    model_trainer.train(train_gen, val_gen)
    
    # Optional: Fine-tune
    print("\nDo you want to fine-tune the model? (Recommended)")
    # Uncomment to enable fine-tuning
    # model_trainer.fine_tune(train_gen, val_gen)
    
    # Plot training history
    model_trainer.plot_training_history()
    
    # Evaluate model
    accuracy = model_trainer.evaluate_model(val_gen)
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print(f"Model saved to: {CONFIG['MODEL_SAVE_PATH']}")
    print(f"Final Accuracy: {accuracy * 100:.2f}%")
    print("=" * 60)


if __name__ == "__main__":
    main()
