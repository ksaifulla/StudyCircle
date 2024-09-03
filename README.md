# StudyCircle

StudyCircle is a collaborative study platform designed to bring students together for shared learning experiences.

## Tech Stack

- **Frontend:**
  - [React]
  - [Tailwind CSS]
  
- **Backend:**
  - [Express]
  - [MongoDB] as the database

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/khalidSaifulla0/StudyCircle.git
   cd StudyCircle
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   cd backend
   npm install
   ```
3. **Set Up Environment Variables**

   Inside Backend/src
   Rename config.js.example file to config.js and replace with your MongoDB Url and your Jwt Secret:

   ```bash
   cd backend/src
   mv config.js.example config.js
   ```

4. **Start the Development Server**

   Backend:
   ```bash
   cd backend 
   node src/index.js
   ```
   FrontEnd:
   ```bash
   cd frontend 
   npm run dev
   ```