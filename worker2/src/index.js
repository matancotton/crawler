const express = require("express");
const cors = require("cors");
const router = require("./routers/workerRouter");
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => console.log("the worker is running on port:", port));
