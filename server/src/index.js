const express = require("express");
const cors = require("cors");
const router = require("./routers/urlRouter");
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => console.log("server is running on port:", port));
