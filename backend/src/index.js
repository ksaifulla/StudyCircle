const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const initializeSocket = require("./utils/socket");
const userRouter = require("./routes/user");
const groupRouter = require("./routes/groups");
const fileUploadRoutes = require("./routes/fileUpload");
const {PORT, FRONTEND_URL} = require("./config")


const app = express();

// Middleware
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));  // Serve static files from uploads directory

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/groups", groupRouter);
app.use('/api/v1/files', fileUploadRoutes);  // Mount file upload routes


// FIX: Create the HTTP server here and pass it to Socket.IO
const server = http.createServer(app);
initializeSocket(server);  // Pass server instead of app

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
