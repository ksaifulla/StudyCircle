const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRouter = require("./routes/user");
const groupRouter = require("./routes/groups");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/groups", groupRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
