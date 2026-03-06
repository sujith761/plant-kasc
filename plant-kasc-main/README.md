# 🌿 Plant Disease Prediction - AI/ML MERN Application

A production-ready full-stack web application for detecting plant diseases using deep learning and image classification.

## 🚀 Features

- **AI-Powered Disease Detection** - Upload plant leaf images and get instant disease predictions
- **User Authentication** - Secure JWT-based authentication system
- **Prediction History** - Track all past predictions and results
- **Admin Dashboard** - Manage users and monitor system performance
- **Responsive Design** - Modern UI works seamlessly on all devices
- **Real-time Results** - Get disease diagnosis with confidence scores and treatment suggestions

## 🛠 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** - Modern styling
- **Axios** - API communication
- **React Router** - Navigation
- **React Icons** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcrypt** - Password hashing

### AI/ML
- **TensorFlow/Keras** - Deep learning
- **Flask** - Python microservice
- **MobileNetV2** - Transfer learning
- **PlantVillage Dataset** - Training data

## 📁 Project Structure

```
plant-disease/
├── backend/                 # Node.js Express server
│   ├── config/             # Configuration files
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & validation
│   ├── controllers/        # Business logic
│   ├── uploads/            # Uploaded images
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   ├── utils/          # Utilities
│   │   └── App.jsx         # Main app
│   └── public/             # Static assets
├── ai-model/               # AI/ML model
│   ├── training/           # Model training scripts
│   ├── api/                # Flask prediction API
│   ├── models/             # Saved models
│   └── dataset/            # Training dataset
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (3.8+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb+srv://db_user:sujithcs@cluster0.anfty74.mongodb.net/plant-disease
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
AI_API_URL=http://localhost:5001" > .env

# Run backend
npm start
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run frontend
npm run dev
```

### AI Model Setup

```bash
cd ai-model/api
pip install -r requirements.txt

# Run Flask API
python app.py
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://db_user:sujithcs@cluster0.anfty74.mongodb.net/plant-disease
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
AI_API_URL=http://localhost:5001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### AI API (.env)
```env
FLASK_PORT=5001
MODEL_PATH=../models/plant_disease_model.h5
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Predictions
- `POST /api/predict` - Upload image and predict disease
- `GET /api/predictions/history` - Get user's prediction history
- `GET /api/predictions/:id` - Get specific prediction

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `DELETE /api/admin/users/:id` - Delete user

## 🤖 AI Model Training

```bash
cd ai-model/training
python train_model.py
```

The model is trained on the PlantVillage dataset with 38 disease classes covering:
- Tomato diseases (10 classes)
- Potato diseases (3 classes)
- Corn diseases (4 classes)
- Apple diseases (4 classes)
- And more...

**Model Architecture:**
- Transfer Learning with MobileNetV2
- Input: 224x224x3 RGB images
- Output: 38 disease classes
- Accuracy: ~95%+

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend (Render)
1. Push code to GitHub
2. Connect Render to repository
3. Add environment variables
4. Deploy

### AI API (Render/HuggingFace)
```bash
cd ai-model/api
# Deploy to Render as Python service
```

### Database (MongoDB Atlas)
- Already configured with provided URI
- Ensure network access is allowed

## 🐳 Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Pages Included

1. **Landing Page** - Hero section with features
2. **Login/Register** - Authentication pages
3. **Dashboard** - Main user interface
4. **Upload** - Image upload with preview
5. **Results** - Disease prediction with treatment
6. **History** - Past predictions
7. **Admin Panel** - User management

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Protected routes
- Image file validation
- Rate limiting
- CORS configuration
- XSS protection
- Input sanitization

## 📝 Disease Classes Supported

The model can detect 38 different plant diseases including:
- Tomato: Early Blight, Late Blight, Leaf Mold, etc.
- Potato: Early Blight, Late Blight, Healthy
- Corn: Common Rust, Gray Leaf Spot, Northern Leaf Blight
- Apple: Black Rot, Cedar Rust, Scab
- And many more...

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Your Name**
- Portfolio: your-portfolio.com
- GitHub: @yourusername
- LinkedIn: linkedin.com/in/yourprofile

## 🙏 Acknowledgments

- PlantVillage Dataset
- TensorFlow/Keras Team
- MERN Stack Community

## 📧 Support

For issues or questions, please open an issue on GitHub or contact: your.email@example.com

---

**Built with ❤️ for farmers and plant health enthusiasts**
