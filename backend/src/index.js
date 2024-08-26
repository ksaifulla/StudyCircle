const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const groupRouter = require("./routes/groups");
const initializeSocket = require("./utils/socket");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/groups", groupRouter);

const server = initializeSocket(app);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
