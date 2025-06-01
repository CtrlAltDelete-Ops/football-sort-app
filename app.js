const express = require("express");
const app = express();
const connectDB = require("./db/connectdb");
const userRouter = require("./routers/userRouter");
const playerRouter = require("./routers/playerRouter");

const port = process.env.PORT || 5050;

app.get("/", (req, res) => {
  res.send("Football API is running");
});

app.use(express.json());
app.use("/users", userRouter);
app.use("/players", playerRouter);

const runServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with failure
  }
}

runServer();

