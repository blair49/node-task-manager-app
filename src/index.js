const express = require("express");
require("./db/mongoose");
const Task = require("./models/Task");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(userRouter);

app.use(taskRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
