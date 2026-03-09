# 🌿 Quick Start Guide

Get the Plant Disease Prediction application running locally in minutes!

## 📦 Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [Git](https://git-scm.com/)

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/plant-disease.git
cd plant-disease
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI (already included)
# MONGO_URI=mongodb+srv://db_user:sujithcs@cluster0.anfty74.mongodb.net/plant-disease

# Start backend server
npm start
```

Backend will run on **http://localhost:5000**

### Step 3: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

### Step 4: AI Model API Setup

```bash
# Open new terminal
cd ai-model/api

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Note: You need a trained model first!
# See ai-model/training/README.md for training instructions
# For now, the backend has a fallback mock prediction

# Start Flask API
python app.py
```

AI API will run on **http://localhost:5001**

## ✅ Verify Installation

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Frontend**
   - Open http://localhost:3000 in your browser
   - You should see the landing page

3. **AI API Health Check**
   ```bash
   curl http://localhost:5001/health
   ```

## 👤 Create Your First Account

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: minimum 6 characters
4. Click "Create Account"

## 🧪 Test Disease Detection

1. **Login** to your account
2. Click **"Upload Plant Image"** or go to Dashboard
3. **Upload** a plant leaf image
   - You can find test images online or use your own
   - Supported formats: JPG, PNG, GIF, WEBP
   - Max size: 5MB
4. Click **"Analyze Image"**
5. View results with:
   - Disease prediction
   - Confidence score
   - Symptoms
   - Remedies
   - Prevention tips

## 📁 Project Structure

```
plant-disease/
├── backend/          # Node.js Express API
├── frontend/         # React + Vite application
├── ai-model/
│   ├── training/     # Model training scripts
│   └── api/          # Flask prediction API
└── README.md
```

## 🎓 Training Your Own Model

If you want to train the AI model:

1. **Download Dataset**
   - Get PlantVillage dataset from [Kaggle](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
   - Extract to `ai-model/dataset/PlantVillage/`

2. **Train Model**
   ```bash
   cd ai-model/training
   pip install -r requirements.txt
   python train_model.py
   ```

3. **Model will be saved to**
   - `ai-model/models/plant_disease_model.h5`
   - `ai-model/models/class_labels.json`

**Note**: Training requires GPU and takes 2-3 hours. You can skip this step and use the backend's fallback predictions for development.

## 🔧 Common Issues

### Port Already in Use

```bash
# Kill process on port
# Windows
netsh interface portproxy reset

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error

- Verify MongoDB URI in `backend/.env`
- Check internet connection
- Ensure MongoDB Atlas network access allows your IP

### Missing Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# AI API
cd ai-model/api && pip install -r requirements.txt
```

## 💡 Development Tips

### Auto-reload

- **Backend**: Use `npm run dev` with nodemon
- **Frontend**: Already enabled with Vite
- **AI API**: Use `FLASK_DEBUG=True`

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Python
- MongoDB for VS Code

### Testing API with Postman

Import this collection or use cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 📚 Next Steps

1. **Explore Features**
   - Upload multiple images
   - View prediction history
   - Check dashboard statistics
   - Access admin panel (if admin)

2. **Customize**
   - Modify UI components
   - Add new features
   - Integrate additional APIs

3. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## 🆘 Getting Help

- 📖 Read full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Report issues on GitHub
- 💬 Join our community

## 🎉 You're All Set!

Start detecting plant diseases with AI! 🌱✨

---

**Happy Coding! 🚀**

FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT 5001
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app", "--workers", "1", "--threads", "4"]
