# This Is Rocket League 🚗⚽

A comprehensive web application dedicated to Rocket League terminology and world records. Built with React, Express, and MongoDB.

## 🎯 Features

### 📖 Rocket League Dictionary

- **Comprehensive Term Database**: Browse Rocket League-specific terms, mechanics, and slang
- **Advanced Filtering**: Filter by category, skill level, and search functionality
- **Like System**: Community-driven content with like functionality
- **Public Submissions**: Anyone can submit new terms through an intuitive form
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🏆 World Records

- **Record Categories**: Fastest goals, longest air dribbles, highest MMR, and more
- **Proof Verification**: Links to video proof for each record
- **Trending System**: Most popular records rise to the top
- **Community Submissions**: Public form for submitting new world records
- **Detailed Information**: Record holder, achievement date, and descriptions

### 🏠 Home Dashboard

- **Trending Content**: Top 5 trending terms and records
- **Quick Navigation**: Easy access to all sections
- **Beautiful Design**: Modern UI with Material Design and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React.js** - Modern UI framework
- **Material UI** - Professional component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ThisIsRocketLeague
   ```

2. **Install dependencies**

   ```bash
   # Install all dependencies (root, server, and client)
   npm run install-all
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp server/env.example server/.env

   # Edit the .env file with your MongoDB connection
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/rocketleague

   # For MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rocketleague
   ```

4. **Start the development servers**

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
ThisIsRocketLeague/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Terms (Dictionary)

- `GET /api/terms` - Get all terms with filtering
- `GET /api/terms/:id` - Get specific term
- `POST /api/terms` - Create new term
- `POST /api/terms/:id/like` - Like a term
- `GET /api/terms/trending/limit` - Get trending terms
- `GET /api/terms/categories/list` - Get all categories

### Records (World Records)

- `GET /api/records` - Get all records with filtering
- `GET /api/records/:id` - Get specific record
- `POST /api/records` - Create new record
- `POST /api/records/:id/like` - Like a record
- `GET /api/records/trending/limit` - Get trending records
- `GET /api/records/categories/list` - Get all categories

## 🎨 Features in Detail

### Dictionary Features

- **Categories**: Mechanics, Slang, Strategy, Tactics, Equipment, Other
- **Skill Levels**: Beginner, Intermediate, Pro
- **Search**: Full-text search across terms, definitions, and examples
- **Sorting**: Newest, Trending, Most Liked, Oldest
- **Pagination**: Load more content as needed

### World Records Features

- **Categories**: Fastest Goal, Longest Air Dribble, Highest MMR, etc.
- **Proof Links**: Direct links to video proof
- **Date Tracking**: When records were achieved
- **Record Holders**: Attribution to players
- **Community Validation**: Like system for credibility

### User Experience

- **Responsive Design**: Works on all screen sizes
- **Material Design**: Professional, modern interface
- **Loading States**: Smooth user experience
- **Error Handling**: Clear error messages
- **Form Validation**: Real-time validation feedback

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Server-side validation
- **CORS Protection**: Secure cross-origin requests
- **Helmet**: Security headers
- **MongoDB Injection Protection**: Mongoose validation

## 🚀 Deployment

### Frontend (React)

```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Backend (Express)

```bash
cd server
npm start
# Deploy to Heroku, Vercel, or your preferred hosting
```

### Environment Variables for Production

```bash
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Rocket League community for inspiration
- Material UI for the beautiful component library
- MongoDB for the reliable database solution
- All contributors and supporters

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**This Is Rocket League** - Your ultimate guide to Rocket League terminology and world records! 🚗⚽
