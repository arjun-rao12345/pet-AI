# 🐾 Pet Health Care Application

A comprehensive MERN stack application for pet health management with AI-powered veterinary consultation and risk assessment.

## 🌟 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and user sessions

### 🐕 Pet Management
- Add multiple pets per user account
- Detailed pet profiles (name, type, breed, age, weight, gender)
- Edit and update pet information
- Pet-specific health tracking

### 🤖 AI-Powered Health Consultation
- OpenAI-integrated chatbox for pet health questions
- Intelligent responses based on pet symptoms and concerns
- Real-time chat interface with conversation history

### ⚠️ Risk Assessment System
- **Low Risk** (Green): General care advice and tips
- **Medium Risk** (Yellow): Monitor symptoms, schedule check-up
- **High Risk** (Orange): Veterinary consultation recommended
- **Urgent** (Red): Immediate veterinary attention required

### 🎨 Modern UI/UX
- Responsive design for desktop and mobile
- Clean, pet-friendly interface
- Intuitive navigation and user experience
- Color-coded risk indicators

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered responses
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Context API** - State management

## 📁 Project Structure

```
pet-health-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Pet.js           # Pet schema
│   │   └── Chat.js          # Chat history schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── pets.js          # Pet management routes
│   │   └── chat.js          # Chat and AI integration routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── config/
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js    # Navigation component
│   │   ├── pages/
│   │   │   ├── Home.js      # Landing page
│   │   │   ├── Login.js     # Login page
│   │   │   ├── Register.js  # Registration page
│   │   │   ├── Dashboard.js # Pet management dashboard
│   │   │   ├── AddPet.js    # Add new pet form
│   │   │   ├── PetProfile.js# Pet profile page
│   │   │   └── Chat.js      # AI chat interface
│   │   ├── context/
│   │   │   ├── AuthContext.js # Authentication state
│   │   │   └── PetContext.js  # Pet data state
│   │   ├── styles/
│   │   │   └── GlobalStyles.js # Global styling
│   │   └── App.js           # Main app component
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-health-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ShoppingCart
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

5. **Start the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000 (or 3001 if 3000 is occupied)
   - Backend API: http://localhost:5000

## 📱 Usage Guide

### 1. User Registration/Login
- Create a new account or login with existing credentials
- Secure authentication with JWT tokens

### 2. Pet Management
- Add your pets with detailed information
- View and edit pet profiles
- Manage multiple pets from the dashboard

### 3. AI Health Consultation
- Select a pet and start a chat session
- Ask health-related questions about your pet
- Receive AI-powered responses with risk assessments
- Get veterinary recommendations based on symptoms

### 4. Risk Assessment
- **Green Badge**: Low risk - General care advice
- **Yellow Badge**: Medium risk - Monitor and schedule check-up
- **Orange Badge**: High risk - Veterinary consultation recommended
- **Red Badge**: Urgent - Immediate veterinary attention required

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Pet Management
- `GET /api/pets` - Get user's pets
- `POST /api/pets` - Add new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Chat System
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/:petId` - Get chat history for pet

## 🤖 AI Integration

The application uses OpenAI's GPT model to provide intelligent responses to pet health questions. The AI system:

- Analyzes pet symptoms and health concerns
- Provides appropriate advice based on pet type and symptoms
- Assigns risk levels to determine urgency
- Recommends veterinary care when necessary
- Maintains conversation context for better responses

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## 🎨 Design Features

- Modern, responsive design
- Pet-friendly color scheme
- Intuitive user interface
- Mobile-optimized layout
- Accessibility considerations

## 🚧 Future Enhancements

- [ ] Appointment scheduling system
- [ ] Vaccination tracking
- [ ] Medical records storage
- [ ] Veterinarian directory
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Pet photo uploads
- [ ] Health analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for pet lovers everywhere! 🐾**
